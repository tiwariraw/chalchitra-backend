import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: String,
  genre: String,
  url: {
    type: String,
    required: true
  }, //link to the video file in the storage (cloud or local)
  posterUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model("Video", VideoSchema);
