/**
 *
 */

const functions = require("firebase-functions/v1");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.saveToken = functions.auth.user().onCreate(async (user) => {
  // Push the token into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.getFirestore()
      .collection("tokens")
      .add({original: user.uid});

  functions.logger.log("Token added to ", writeResult.path);
});
