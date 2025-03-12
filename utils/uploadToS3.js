import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

//configuring s3 bucket
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const fileType = file.mimetype.startsWith("video/") ? "videos" : "images";
      cb(null, `${fileType}/${file.fieldname}-${Date.now()}${fileExt}`);
    }
  }),
  limits: { fileSize: 60 * 1024 * 1024 } // 50MB limit
});
