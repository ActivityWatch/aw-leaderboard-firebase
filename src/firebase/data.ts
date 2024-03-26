// This file specifies the data model for the screentime data
// and provides functions for reading and writing it to the database.
//
// It uses Firebase Firestore as the database, and the data model is:
// - A collection called `screentime`
//   - Each document in the collection is keyed by the user's ID
//   - Each document has a collection of days, which each have an array of events for that day

import { db } from './firebaseInit'
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore/lite'
import type { ScreenTimeData, ScreenTimeSummary } from '@/types'

export function dataToSummary(data: ScreenTimeData): ScreenTimeSummary {
  const total = data.events.reduce((acc, event) => acc + event.duration, 0)
  const categoryTotals: { [key: string]: number } = {}
  data.events.forEach((event) => {
    const category = event.data.category
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0
    }
    categoryTotals[category] += event.duration
  })
  return {
    userId: data.userId,
    total,
    date: data.date,
    categoryTotals
  }
}

export async function addScreenTimeData(userId: number, data: ScreenTimeData) {
  const docRef = doc(db, 'screentime', userId.toString())
  const stdoc = await getDoc(docRef)
  const existingData = stdoc.exists() ? stdoc.data() : null
  if (existingData) {
    await updateDoc(docRef, {
      events: [...existingData.events, ...data.events]
    })
  } else {
    await setDoc(docRef, data)
  }
}

export async function getScreenTimeData(userId: string, since: Date | null = null, _public: Boolean = true): Promise<ScreenTimeData[] | null> {
  const q = query(
    collection(db, 'screentime/' + userId + '/' + userId),
    // where('date', '>=', since || new Date('1900-1-1')),
    where('public', '==', _public)
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    return null
  }
  const data = snapshot.docs.map((doc) => doc.data())
  if (!data) {
    return null
  }
  return data as ScreenTimeData[]
}

export async function getPublicScreenTimeData(
  since: Date | null = null
): Promise<{ [key: number]: ScreenTimeSummary[] } | null> {
  // Returns all public screentime data, for all users, since `since`, aggregated by user
  const q = query(
    collection(db, 'screentime'),
    where('public', '==', true),
    where('date', '>=', since || new Date('1900-1-1'))
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    return null
  }
  const summaries: { [key: string]: ScreenTimeSummary[] } = {}
  snapshot.forEach((doc: any) => {
    const screentimedata = doc.data() as ScreenTimeData
    const userId = screentimedata.userId
    const summary = dataToSummary(screentimedata)
    if (!summaries[userId]) {
      summaries[userId] = []
    }
    summaries[userId].push(summary)
  })
  return summaries
}

export async function getLeaderboard(): Promise<ScreenTimeSummary[]> {
  // Returns the top 50 users by screen time in the current week
  // This function could be cached for performance (underlying data changes ~hourly)
  const dbRef = collection(db, 'leaderboard')
  const snapshot = await getDocs(dbRef)
  const leaderboard: ScreenTimeSummary[] = []
  snapshot.forEach((doc: any) => {
    leaderboard.push(doc.data())
  })
  return leaderboard
}
