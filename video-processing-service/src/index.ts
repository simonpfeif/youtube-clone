import express from "express";
import { setupDirectories } from "./storage";
import { processVideoMessage } from "./videoProcessor";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  let data;
  try {
    const message = Buffer.from(req.body.message.data, "base64").toString("utf-8");
    data = JSON.parse(message);
    if (!data?.bucket || !data?.name) {
      throw new Error("Invalid message format");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Bad request: missing body, bucket, or file name");
    return;
  }

  try {
    await processVideoMessage(data);
    res.status(200).send("Video processing completed successfully");
  } catch (error: any) {
    const message = error?.message || "Internal server error";
    const code = message.includes("already") ? 400 : 500;
    console.error("Processing error:", message);
    res.status(code).send(message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
