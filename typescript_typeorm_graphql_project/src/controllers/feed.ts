import { Result, validationResult } from "express-validator";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
dotenv.config();

const createPost = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.statusCode = 422;
    const error = new Error("validation failed, entered data is incorrect.");
    throw error;
  }

  const existingUser = await User.findOne({
    where: {
      id: parseInt(req.userId),
    },
  });

  if (!existingUser) {
    res.statusCode = 404;
    const error = new Error("User not found!");
    throw error;
  }
  console.log(req.userId);
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;

  const post = new Post();
  post.title = title;
  post.content = content;
  post.imageUrl = imageUrl;
  post.creator = existingUser;

  post
    .save()
    .then((result) => {
      res.status(201).json({
        post: {
          title: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          creator: {
            _id: existingUser.id,
            name: existingUser.name,
          },
        },

        message: "New Post is Created succesfully.",
      });
    })
    .catch((err) => {
      // if (!err.statusCode) {
      //   err.statusCode = 500;
      // }
      // const status = err.statusCode || 500;
      // const message = err.message;
      next(err);
    });
};

const getAllPost = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  Post.find().then((posts) => {
    res
      .status(200)
      .json({ message: "Fetched posts successfully.", posts: posts });
  });
};

const getPostById = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.postId;
    Post.findOne({
      where: {
        id: postId,
      },
    })
      .then((post) => {
        if (!post) {
          res.status(404);
          const error = new Error("Could not find post.");
          throw error; // after throwing the error the catch block will executed.
        }
        res.status(200).json({ message: "Post fetched.", post: post });
      })
      .catch((err) => {
        // if (!err.statusCode) {
        //   err.statusCode = 500;
        // }
        // const status = err.statusCode || 500;
        // const message = err.message;
        next(err);
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updatePost = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422);
    const error = new Error("Validation failed, entered data is incorrect.");
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.image;

  Post.findOne({
    where: {
      id: postId,
    },
    relations: {
      creator: true,
    },
  })
    .then((post) => {
      if (!post) {
        res.status(404);
        const error = new Error("Could not find post.");
        throw error;
      }

      if (post.creator.id !== parseInt(req.userId)) {
        res.status(401);
        const error = new Error("Not Authorized.");
        throw error;
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      // if (!err.statusCode) {
      //   err.statusCode = 500;
      // }
      // const status = err.statusCode || 500;
      // const message = err.message;
      next(err);
    });
};

const deletePostById = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;

  Post.findOne({
    where: {
      id: postId,
    },
    relations: {
      creator: true,
    },
  })
    .then((post) => {
      if (!post) {
        res.status(404);
        const error = new Error("Could not fing post.");
        throw error;
      }

      if (post.creator.id !== parseInt(req.userId)) {
        res.status(401);
        const error = new Error("Not Authorized.");
        throw error;
      }
      return Post.delete({
        id: postId,
      });
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post deleted Successfully." });
    })
    .catch((err) => {
      // if (!err.statusCode) {
      //   err.statusCode = 500;
      // }
      // const status = err.statusCode || 500;
      // const message = err.message;
      next(err);
    });
};

export { createPost, getAllPost, getPostById, updatePost, deletePostById };
