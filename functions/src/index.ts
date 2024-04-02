/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onSchedule} from "firebase-functions/v2/scheduler";
import {
  onDocumentCreated,
  onDocumentUpdated
} from "firebase-functions/v2/firestore";

import * as admin from "firebase-admin";
import {error, info} from "firebase-functions/lib/logger";

admin.initializeApp();

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
    info("Generating ApiKey");
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
      info("ApiKey found");
      return {apiKey: doc.data()?.apiKey};
    } else {
      const apiKey = genKey.generateApiKey();
      await docref.set({apiKey: apiKey});
      info("ApiKey set and sent to client");
      return {apiKey: apiKey};
    }
  });
