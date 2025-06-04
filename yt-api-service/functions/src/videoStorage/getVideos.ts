import * as admin from "firebase-admin";
import {onCall} from "firebase-functions/v2/https";

const firestore = admin.firestore();

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string
}

export const getVideos = onCall({maxInstances: 1}, async () => {
  // Extremely Naive and does not check if video is processed or not
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});
