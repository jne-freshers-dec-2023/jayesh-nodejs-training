import { Router } from "express";
import { isAuth } from "../middleware/is-auth";
import {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePostById
} from "../controllers/feed";
import express from "express";

const router = Router();

const app = express();

app.use(isAuth);

router.post("/post", isAuth, createPost);

router.get("/posts", isAuth, getAllPost);

router.get("/post/:postId", isAuth, getPostById);

router.put("/post/:postId", isAuth, updatePost);

router.delete("/post/:postId", isAuth, deletePostById);

export { router };
