import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import Video from "../models/video.js";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

ffmpeg.setFfmpegPath(ffmpegPath.path);

const videoRouter = express.Router();

// ✅ Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ✅ Configure Multer-S3 for Video & Poster Uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cineflow-videofiles", // process.env.AWS_S3_BUCKET
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      // Define the upload path based on file type
      const fileType = file.mimetype.startsWith("video/")
        ? "videos"
        : "posters";
      cb(null, `${fileType}/${Date.now()}-${path.basename(file.originalname)}`);
    }
  })
});

// ✅ API Route: Upload Video & Poster to AWS S3
videoRouter.post(
  "/upload",
  upload.fields([
    { name: "url", maxCount: 1 }, // Video file
    { name: "poster", maxCount: 1 } // Poster image
  ]),
  async (req, res) => {
    try {
      console.log("req", req);
      if (!req.files || !req.files["url"]) {
        return res.status(400).json({ error: "Video file is required" });
      }

      // Extract uploaded file locations from S3
      const videoFile = req.files["url"][0]; // Video file
      const posterFile = req.files["poster"] ? req.files["poster"][0] : null; // Poster file (optional)

      // ✅ Save video details in MongoDB
      const videoData = new Video({
        title: req.body.title,
        type: req.body.type,
        genre: req.body.genre,
        url: videoFile.location, // Video S3 URL
        posterUrl: posterFile ? posterFile.location : null // Poster S3 URL
      });

      await videoData.save();

      res.json({
        message: "Video and poster uploaded successfully to S3",
        videoUrl: videoFile.location,
        posterUrl: posterFile ? posterFile.location : null
      });
    } catch (error) {
      res.status(500).json({
        message: "Error Uploading Video & Poster",
        error: error.message
      });
    }
  }
);

// ✅ API Route: Fetch All Videos
videoRouter.get("/getAllVideos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({
      message: "Videos Fetched Successfully",
      videos: videos
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Fetching Videos",
      error: error.message
    });
  }
});

export default videoRouter;
