// This file specifies the data model for the screentime data
// and provides functions for reading and writing it to the database.
//
// It uses Firebase Firestore as the database, and the data model is:
// - A collection called `screentime`
//   - Each document in the collection is keyed by the user's ID
//   - Each document has a collection of days, which each have an array of events for that day
// - A collection called `leaderboard`
//   - Each document in the collection points to a nested user collection
//   - Each user collection has docs keyed by the ISO date of the data contained within.
//   - Each user collection doc is of type `ScreenTimeSummaryRanked` which is just ScreenTimeSummary 
//     with an extra rank field
// - A collection called `users`
//   - Each document is keyed by the user's uid
//   - Each document contains an apikey

import { db } from './firebaseInit'
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  startAfter,
  limit
} from 'firebase/firestore/lite'
import { getFunctions, httpsCallable } from 'firebase/functions'
import type { ScreenTimeData, ScreenTimeSummary } from '@/types'

const functions = getFunctions()

export function dataToSummary(data: ScreenTimeData): ScreenTimeSummary {
  const total = data.events.reduce((acc, event) => acc + event.duration, 0)
  const categoryTotals: { [key: string]: number } = {}
  data.events.forEach((event) => {
    const category = event.category[0] || 'Uncategorized'
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

export async function getScreenTimeData(
  userId: string,
  since: Date | null = null,
  _public: Boolean = true
): Promise<ScreenTimeData[] | []> {
  const q = query(
    collection(db, 'screentime/' + userId + '/' + userId),
    where(
      'date',
      '>=',
      since?.toISOString().split('T')[0] || new Date('1900-1-1').toISOString().split('T')[0]
    ),
    where('public', '==', _public)
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    return []
  }
  const data = snapshot.docs.map((doc) => doc.data())
  if (!data) {
    return []
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
    where(
      'date',
      '>=',
      since?.toISOString().split('T')[0] || new Date('1900-1-1').toISOString().split('T')[0]
    )
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

export async function getLeaderboard(offset:number=0): Promise<ScreenTimeSummary[]> {
  /**
   * Fetches 50 docs ranked from the 'leaderboard' collection
   * @param {number} offset - The offset for fetching the leaderboard.
   */
  // makes sure offset is in steps of 50 rounding down
  offset = offset - (offset % 50)
  const q = query(
    collection(db, "leaderboard"),
    orderBy('rank'),
    limit(50),
    startAfter(offset)
  )
 
  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    return []
  }
  
  /** docs in 'leaderboard' are ScreenTimeSummaryRanked type
   *  still works since it's a superset of screenTimeSummary
  */
  const leaderboard: ScreenTimeSummary[] = []
  snapshot.forEach((doc: any) => {
    leaderboard.push(doc.data())
  })
  return leaderboard
}

export async function getApiKey(userId: string): Promise<string | null> {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data().apiKey
  } else {
    console.log('No apikey found')
    return null
  }
}

interface ApiResponse {
  apiKey: string
}

export async function rotateKey(userId: string): Promise<string | null> {
  // invoke a callable function to rotate the user's api key
  // this function is defined in functions/src/index.ts
  const rotateApiKey = httpsCallable(functions, 'rotateApiKey')
  const key = rotateApiKey({ userId: userId })
    .then((result) => {
      return (result.data as ApiResponse)?.apiKey
    })
    .catch((error) => {
      console.error(error)
      return null
    })
  return key
}
