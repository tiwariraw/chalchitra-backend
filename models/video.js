import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

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
  aiDescription: String,
  likes: {
    type: Number,
    default: 0
  },
  likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //stores user id
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model("Video", VideoSchema);
