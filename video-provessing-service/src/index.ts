import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
    // get path of input video from request body
    const inputVideoPath = req.body.inputVideoPath;
    const outputVideoPath = req.body.outputVideoPath;
    
    if (!inputVideoPath || !outputVideoPath) {
        res.status(400).send("Bad Request: Missing input or output video path");
    }
    
    ffmpeg(inputVideoPath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
        res.status(200).send("Video processing completed successfully");
    })
    .on("error", (err) => {
        console.error(`An error occurred: ${err.message}`)
        res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputVideoPath);
    
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});