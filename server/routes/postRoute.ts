import express from "express";
import { generatePost, getGenerations, getPosts, schedulePost } from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get('/', protect, getPosts);
postRouter.get ('/generations', protect,getGenerations);
postRouter.post(
  "/",
  (req, res, next) => {
    console.log("1. Route hit");
    next();
  },
  protect,
  (req, res, next) => {
    console.log("2. After protect");
    next();
  },
  upload.single("media"),
  (req, res, next) => {
    console.log("3. After multer");
    next();
  },
  schedulePost
);
postRouter.post ('/generate', protect,generatePost);

export default postRouter