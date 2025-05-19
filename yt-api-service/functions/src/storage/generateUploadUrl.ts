import * as functions from "firebase-functions";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

const storage = new Storage();

const rawVideoBucketName = "simonpfeif-yt-raw-videos";

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  try {
    // Check if the user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }
    const auth = request.auth;
    const data = request.data;
    const fileExtension = data?.fileExtension;

    if (!fileExtension) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing file extension in request data."
      );
    }

    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique filename
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    console.log(`Signed URL created for file: ${fileName}`);
    return {url, fileName};
  } catch (error: any) {
    console.error("generateUploadUrl error:", error.message, error.stack);
    throw new functions.https.HttpsError("internal",
      "Failed to generate upload URL", error.message);
  }
});
