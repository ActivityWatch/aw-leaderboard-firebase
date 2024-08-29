import {onRequest} from "firebase-functions/v2/https"
import {onObjectFinalized} from "firebase-functions/v2/storage"
import {onSchedule} from "firebase-functions/v2/scheduler"
import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import * as genKey from "generate-api-key"
import {info, debug, error} from "firebase-functions/logger"
import {
  RawEvent, Event, ScreenTimeData, ScreenTimeSummary, ScreenTimeSummaryRanked,
} from "./types"
// TODO: move imports to functions that use them to reduce cold start time
admin.initializeApp()

exports.onUserCreated = functions.auth.user().onCreate((user) => {
  info("User created: ", user.uid);
  const db = admin.firestore()
  const colpath = "users"
  const docpath = user.uid
  const apiKey = genKey.generateApiKey()
  // TODO: handle possible collisions
  return db.collection(colpath).doc(docpath).set({apiKey: apiKey})
})

exports.onUserDeleted = functions.auth.user().onDelete((user) => {
  // TODO: consider what to do with the user's data
  info("User deleted: ", user.uid)
  const db = admin.firestore()
  const colpath = "users"
  const docpath = user.uid
  return db.collection(colpath).doc(docpath).delete()
})
export const getApiKey = functions.https.onCall(async (_, context) => {
  /** A callable function only executed when the user is logged in */
  info("Getting ApiKey")
  debug("Request data: ", context)
  if (!context.auth) {
    error("Not authenticated")
    return {error: "Not authenticated"}
  }
  const db = admin.firestore()
  const colpath = "users"
  const docpath = context.auth?.uid
  const docref = db.collection(colpath).doc(docpath)
  const doc = await docref.get()
  if (doc.exists && doc.data() && doc.data()?.apiKey) {
    info("ApiKey found and sent to client")
    return {apiKey: doc.data()?.apiKey}
  } else {
    const apiKey = genKey.generateApiKey()
    await docref.set({apiKey: apiKey})
    info("ApiKey set and sent to client")
    return {apiKey: apiKey}
  }
})
export const rotateApiKey = functions.https.onCall(async (_, context) => {
  /** A callable function only executed when the user is logged in */
  info("Rotating ApiKey")
  debug("Request data: ", context)
  if (!context.auth) {
    error("Not authenticated")
    return {error: "Not authenticated"}
  }
  const db = admin.firestore()
  const colpath = "users"
  const docpath = context.auth?.uid
  const docref = db.collection(colpath).doc(docpath)
  const doc = await docref.get()
  if (doc.exists && doc.data() && doc.data()?.apiKey) {
    const apiKey = genKey.generateApiKey()
    await docref.update({apiKey: apiKey})
    info("ApiKey rotated and sent to client")
    return {apiKey: apiKey}
  } else {
    await docref.set({apiKey: genKey.generateApiKey()})
    info("ApiKey set and sent to client")
    return {apiKey: doc.data()?.apiKey}
  }
})

exports.updateLeaderboardData = functions.runWith({timeoutSeconds: 540, memory: "2GB"})
.pubsub.schedule("every day 00:00").onRun(async () => {
  info("Updating leaderboard data")
  const db = admin.firestore()
  const batch = db.batch()
  const leaderboardColpath = "leaderboard"
  const screentimeColpath = "screentime"

  // List all screentime document references
  const screentimeDocRefs = await db.collection(screentimeColpath).listDocuments()
  const summariesMap = new Map<string, ScreenTimeSummary>()
  const totalsMap = new Map<string, number>()

  // Process documents in parallel
  await Promise.all(screentimeDocRefs.map(async (docRef) => {
    const userId: string = docRef.id
    const userDocRefs = await db.collection(`${screentimeColpath}/${userId}/${userId}`).listDocuments()
    const events: Event[] = []

    // Read user documents in parallel
    const userDocs = await Promise.all(userDocRefs.map(dayDocRef => dayDocRef.get()))
    userDocs.forEach(dayDoc => {
      const dayDocData = dayDoc.data()
      if (dayDocData?.events) {
        events.push(...dayDocData.events)
      }
    })

    const screenTimeData: ScreenTimeData = {
      userId,
      events,
      date: new Date().toISOString().split("T")[0],
      public: true,
    }
    const summary = dataToSummary(screenTimeData)
    summariesMap.set(userId, summary)
    totalsMap.set(userId, summary.total)
  }))

  // Sort summaries map by total screen time
  const sortedSummaries = new Map(
    [...summariesMap.entries()].sort((a, b) => b[1].total - a[1].total)
  )

  // Update leaderboard with ranked summaries
  let rank = 1
  for (const [userId, summary] of sortedSummaries) {
    const rankedSummary: ScreenTimeSummaryRanked = {
      ...summary,
      rank: rank++,
    }
    batch.set(db.collection(leaderboardColpath).doc(userId), rankedSummary)
  }

  // Commit batch
  await batch.commit()
  info("Leaderboard data updated successfully")
  
})

exports.uploadData = onRequest(async (request, response) => {
  info("Storing data")
  debug("Request data: ", request.body)
  if (!request.body.apiKey) {
    error("No apiKey provided!")
    response.status(400).send({error: "No apiKey provided!"})
    return
  }
  if (!request.body.data) {
    error("No data provided to store!")
    response.status(400).send({error: "No data provided!"})
    return
  }

  const apiKey = request.body.apiKey
  const db = admin.firestore()
  const querySnapshot = await db.collection("users")
    .where("apiKey", "==", apiKey).get()
  debug("QuerySnapshot: ", querySnapshot)
  if (querySnapshot.empty) {
    error("Invalid apiKey provided!")
    response.status(403).send({error: "Invalid apiKey provided!"})
    return
  }
  const userId = querySnapshot.docs[0].id
  const bucket = admin.storage().bucket()
  const dataToStore = request.body.data

  const filename = `${userId}/${Date.now()}.json`
  const file = bucket.file(filename)
  await file.save(dataToStore)

  response.send({message: "Data stored successfully!"})
})

exports.onUploadData = onObjectFinalized(
  {cpu: 4, memory: "2GiB"},
  async (event) => {
    info("Processing uploaded data")
    const file = event.data
    const bucket = admin.storage().bucket()
    const data = await bucket.file(file.name).download()
    const userId = file.name.split("/")[0]
    const dataString = data.toString()
    const jsonData: [RawEvent] = JSON.parse(dataString)
    const db = admin.firestore()
    const batch = db.batch()
    const colpath = `screentime/${userId}/${userId}`
    const promises = []
    const dateMap = new Map<string, Event[]>()
    for (const rawEvent of jsonData) {
    // reduce from type RawEvent to Event
      const event: Event = {
        timestamp: rawEvent.timestamp,
        duration: rawEvent.duration,
        data: rawEvent.data,
        category: rawEvent.data.$category ?
          rawEvent.data.$category : "Uncategorized",
      }

      let date = new Date(event.timestamp).toISOString().split("T")[0]
      date = date.replace(/\//g, "-")
      if (dateMap.has(date)) {
        dateMap.get(date)?.push(event)
      } else {
        dateMap.set(date, [event])
      }
    }
    const dates = dateMap.entries()
    for (const [date, events] of dates) {
      const promise = db
        .collection(colpath)
        .doc(date)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const events = doc.data()?.events as Event[]
            events.push(...events)
            batch.update(doc.ref, {events: events})
          } else {
            batch.set(db.collection(colpath).doc(date), {
              events: [...events],
              userId: userId,
              date: date,
              public: true,
            })
          }
        })
      promises.push(promise)
    }
    await Promise.all(promises)
    // TODO: error handling
    await batch.commit()
    info("Data processed successfully")
  })

function dataToSummary(data: ScreenTimeData): ScreenTimeSummary {
  const total = data.events.reduce((acc, event) => acc + event.duration, 0)
  const categoryTotals: { [key: string]: number } = {}
  data.events.forEach((event) => {
    const category = event.category[0] || "Uncategorized"
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0
    }
    categoryTotals[category] += event.duration
  })
  return {
    userId: data.userId,
    total,
    date: data.date,
    categoryTotals,
  }
}
