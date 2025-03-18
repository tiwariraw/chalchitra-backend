import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

//configuring s3 bucket
const s3 = new S3Client({
  region: "ap-south-1", //process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
  }
});

export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cineflow-videofiles", // process.env.AWS_S3_BUCKET
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      // Define the upload path based on file type
      const fileType = file.mimetype.startsWith("video/")
        ? "videos"
        : req.body.avatar
        ? "profiles"
        : "posters";
      cb(null, `${fileType}/${Date.now()}-${path.basename(file.originalname)}`);
    }
  })
  // limits: { fileSize: 60 * 1024 * 1024 } // 50MB limit
});
