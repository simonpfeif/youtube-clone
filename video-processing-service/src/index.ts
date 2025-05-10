import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo} from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
    // Get the bucket name and file from the Cloud pub/sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, "base64").toString("utf-8");
        data = JSON.parse(message);
        if (!data || !data.bucket || !data.name) {
            throw new Error("Invalid message format");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request: missing body, bucket or file name");
        return;
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Convert the video to a lower resolution
    try {
        await convertVideo(inputFileName, outputFileName);
    }
    catch (error) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);

        console.error(`Error processing video: ${error}`);
        res.status(500).send("Internal server error: video processing failed");
        return;
    }

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);
    
    res.status(200).send("Video processing completed successfully");
    return;
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});