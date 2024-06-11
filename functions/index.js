/**
 *
 */

import {AccessToken} from "livekit-server-sdk";
const functions = require("firebase-functions/functions");

// The Firebase Admin SDK to access Firestore.
const firebaseAdmin = require("firebase-admin");
firebaseAdmin.initializeApp();

exports.saveToken = functions.auth.user().onCreate(async (user) => {
  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  const roomName = "quickstart-room";
  // identifier to be used for participant.
  // it's available as LocalParticipant.identity with livekit-client SDK
  const participantName = user.displayName;

  const at = new AccessToken(
      process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity: participantName,
        // token to expire after 10 minutes
        ttl: "10m",
      });
  at.addGrant({roomJoin: true, room: roomName});

  const token = await at.toJwt();

  // Push the token into Firestore using the Firebase Admin SDK.
  const writeResult = await firebaseAdmin.getFirestore()
      .collection("tokens")
      .add({original: user.uid, token: token});

  functions.logger.log("Token added to ", writeResult.path);
});
