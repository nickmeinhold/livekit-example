/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.saveDoc = functions.auth.user().onCreate(async (user) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("users")
    .doc(user.uid).set({ original: user.email });
  // Send back a message that we've successfully written the message
  functions.logger.info("Doc with ID: ${writeResult.id} added.");
});
