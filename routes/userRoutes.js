import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { authenticationToken } from "../middlewares/authenticationMiddleware.js";

const userRouter = express.Router();

userRouter.get("/profile", authenticationToken, async (req, res) => {
  try {
    // "-password" refers to exclude the password field
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error
    });
  }
});

export default userRouter;
