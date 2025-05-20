import {
  downloadRawVideo,
  convertVideo,
  uploadProcessedVideo,
  deleteRawVideo,
  deleteProcessedVideo
} from "./storage";

import { isVideoNew, setVideo } from "./firestore";

export async function processVideoMessage(message: any): Promise<void> {
  const inputFileName = message.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  if (!await isVideoNew(videoId)) {
    throw new Error("Video already processing or processed");
  }

  await setVideo(videoId, {
    id: videoId,
    uid: videoId.split('-')[0],
    status: 'processing'
  });

  await downloadRawVideo(inputFileName);

  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (error) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    throw new Error("Video processing failed");
  }

  await uploadProcessedVideo(outputFileName);

  await setVideo(videoId, {
    status: 'processed',
    filename: outputFileName
  });

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);
}
