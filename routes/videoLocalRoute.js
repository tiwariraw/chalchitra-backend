import express, { response } from "express";
//handles multipart form data
import multer from "multer";
//for video handling
import ffmpeg from "fluent-ffmpeg";
//inbuilt for file paths
import path from "path";
import Video from "../models/video.js";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const videoRouter = express.Router();

const upload = multer({
  dest:
    process.env.VIDEO_STORAGE_PATH || path.join(process.cwd(), "public/uploads")
});

videoRouter.post("/upload", upload.single("url"), async (req, res) => {
  try {
    console.log("req", req);
    const inputPath = req.file.path;
    const outputPath = `${process.env.VIDEO_STORAGE_PATH}/${req.file.originalname}`;
    ffmpeg(inputPath)
      .output(outputPath)
      .on("end", async () => {
        const newVideo = new Video({
          title: req.body.title,
          url: outputPath
        });
        await newVideo.save();
        res.status(201).json({
          message: "Video Uploaded Successfully",
          video: newVideo
        });
      })
      .on("error", (err) => {
        res.status(500).json({
          error: err.message
        });
      })
      .run();
  } catch (error) {
    res.status(500).json({
      message: "Error Uploading Video",
      error
    });
  }
});

export default videoRouter;
