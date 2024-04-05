// import {onSchedule} from "firebase-functions/v2/scheduler";
import {
  onDocumentCreated,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";

import {onRequest} from "firebase-functions/v2/https";
import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import {error, info} from "firebase-functions/lib/logger";
import * as functions from "firebase-functions";
import * as genKey from "generate-api-key";

import {Event, RawEvent} from "./types";

admin.initializeApp(); // TODO: cleanup global scope imports and inits
exports.onUserCreated = functions.auth.user().onCreate((user) => {
  info("User created: ", user.uid);
  const db = admin.firestore();
  const colpath = "users";
  const docpath = user.uid;
  const apiKey = genKey.generateApiKey();
  const jsonObj = JSON.parse(`{"apiKey": "${apiKey}"}`);
  return db.collection(colpath).doc(docpath).set(jsonObj);
});

exports.onUserDeleted = functions.auth.user().onDelete((user) => {
  info("User deleted: ", user.uid);
  const db = admin.firestore();
  const colpath = "users";
  const docpath = user.uid;
  return db.collection(colpath).doc(docpath).delete();
});
exports.CalculateCategoryTotals = onDocumentCreated(
  "leaderboard/{userId}", (event) => {
    info("Calculating totals");
    const snapshot = event.data;
    if (!snapshot) {
      error("Document does not exist");
      return;
    }
    const data = snapshot.data();
    const categoriesTotals = data.CategoryTotals as { [key: string]: number };
    let total = 0;
    for (const category in categoriesTotals) {
      /* eslint guard-for-in: 1 */
      total += categoriesTotals[category];
    }
    const db = admin.firestore();
    const colpath = "leaderboard";
    db.collection(colpath).doc(snapshot.id).update({total: total}).then(() => {
      info("Total updated");
    }).catch((error) => {
      error("Error updating total: ", error);
    });
  });

exports.UpdateCategoryTotals = onDocumentUpdated(
  "leaderboard/{userId}", (event) => {
    info("Updating totals on document update");
    const snapshot = event.data;
    if (!snapshot) {
      error("Document does not exist");
      return;
    }
    const data = snapshot.after.data();
    const categoriesTotals = data.CategoryTotals as { [key: string]: number };
    let total = 0;
    for (const category in categoriesTotals) {
      /* eslint guard-for-in: 1 */
      total += categoriesTotals[category];
    }
    const db = admin.firestore();
    const colpath = "leaderboard";
    db.collection(colpath).doc(snapshot.after.id)
      .update({total: total}).then(() => {
        info("Total updated");
      }).catch((error) => {
        error("Error updating total: ", error);
      });
  });

  export const getApiKey = functions.https.onCall(async (_, context) => {
    /** A callable function only executed when the user is logged in */
    info("Getting ApiKey");
    info("Request data: ", context);
    if (!context.auth) {
      error("Not authenticated");
      return {error: "Not authenticated"};
    }
    const db = admin.firestore();
    const colpath = "users";
    const docpath = context.auth?.uid;
    const docref = db.collection(colpath).doc(docpath);
    const doc = await docref.get();
    if (doc.exists && doc.data() && doc.data()?.apiKey) {
      info("ApiKey found and sent to client");
      return {apiKey: doc.data()?.apiKey};
    } else {
      const apiKey = genKey.generateApiKey();
      await docref.set({apiKey: apiKey});
      info("ApiKey set and sent to client");
      return {apiKey: apiKey};
    }
  });
  export const rotateApiKey = functions.https.onCall(async (_, context) => {
    /** A callable function only executed when the user is logged in */
    info("Rotating ApiKey");
    info("Request data: ", context);
    if (!context.auth) {
      error("Not authenticated");
      return {error: "Not authenticated"};
    }
    const db = admin.firestore();
    const colpath = "apiKeys";
    const docpath = context.auth?.uid;
    const docref = db.collection(colpath).doc(docpath);
    const doc = await docref.get();
    if (doc.exists && doc.data() && doc.data()?.apiKey) {
      const apiKey = genKey.generateApiKey();
      await docref.update({apiKey: apiKey});
      info("ApiKey rotated and sent to client");
      return {apiKey: apiKey};
    } else {
      await docref.set({apiKey: genKey.generateApiKey()});
      info("ApiKey set and sent to client");
      return {apiKey: doc.data()?.apiKey};
    }
  });
  
  exports.uploadData = onRequest(async (request, response) => {
    info("Storing data");
    info("Request data: ", request.body);
    if (!request.body.apiKey) {
      error("No apiKey provided!");
      response.status(400).send({error: "No apiKey provided!"});
      return;
    }
    if (!request.body.data) {
      error("No data provided to store!");
      response.status(400).send({error: "No data provided!"});
      return;
    }
  
    const apiKey = request.body.apiKey;
    const db = admin.firestore();
    const querySnapshot = await db.collection("users")
      .where("apiKey", "==", apiKey)
      .get();
    info("QuerySnapshot: ", querySnapshot);
    if (querySnapshot.empty) {
      error("Invalid apiKey provided!");
      response.status(403).send({error: "Invalid apiKey provided!"});
      return;
    }
    const userId = querySnapshot.docs[0].id;
    const bucket = admin.storage().bucket();
    const dataToStore = request.body.data;
  
    const filename = `${userId}/${Date.now()}.json`;
    const file = bucket.file(filename);
    await file.save(dataToStore);
  
    response.send({message: "Data stored successfully!"});
  });
  
  exports.onUploadData = onObjectFinalized(
    {cpu: 4}, async (event) => {
      info("Processing uploaded data");
      const file = event.data;
      const bucket = admin.storage().bucket();
      const data = await bucket.file(file.name).download();
      const userId = file.name.split("/")[0];
      const dataString = data.toString();
      const jsonData: [RawEvent] = JSON.parse(dataString);
      const db = admin.firestore();
      const colpath = `screentime/${userId}/${userId}`;
      const promises = [];
      for (const rawEvent of jsonData) {
        // reduce from type RawEvent to Event
        const event:Event = {
          timestamp: rawEvent.timestamp,
          duration: rawEvent.duration,
          data: rawEvent.data,
        };
        // check if a doc with the same date exists
        // date in yyyy-mm-dd format
        let date = new Date(event.timestamp).toISOString().split("T")[0];
        date = date.replace(/\//g, "-");
        const doc = await db.collection(colpath).doc(date).get();
        if (doc.exists) {
          const events = doc.data()?.events as Event[];
          events.push(event);
          const promise = db.collection(colpath).doc(date)
            .update({events: events});
          promises.push(promise);
        } else {
          const promise = db.collection(colpath).doc(date).set({events: [event]});
          promises.push(promise);
        }
      }
      await Promise.all(promises);
      info("Data processed successfully");
    });
  