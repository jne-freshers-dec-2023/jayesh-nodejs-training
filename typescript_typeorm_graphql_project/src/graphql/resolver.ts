import { hash, compare } from "bcryptjs";
import { isEmail, isEmpty, isLength } from "validator";
import { sign } from "jsonwebtoken";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Request } from "express";

async function createUser({ userInput }, req: Request) {
  interface ErrorItem {
    message: string;
  }

  const errors: ErrorItem[] = [];

  if (!isEmail(userInput.email)) {
    errors.push({ message: "Email is invalid." });
  }

  if (
    isEmpty(userInput.password) ||
    !isLength(userInput.password, { min: 5 })
  ) {
    errors.push({ message: "Password too short!" });
  }

  if (errors.length > 0) {
    const error: Error & { data?: any; code?: number } = new Error(
      "Invalid input."
    );
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const existingUser = await User.findOne({
    where: {
      email: userInput.email,
    },
  });

  if (existingUser) {
    const error = new Error("User exists already!");
    throw error;
  }

  const hashedPw = await hash(userInput.password, 12);

  const user = new User();
  user.email = userInput.email;
  user.name = userInput.name;
  user.password = hashedPw;
  user.role = userInput.role;

  const createNewUser = await user.save();
  return { ...createNewUser, _id: createNewUser.id.toString };
}

async function login({ email, password }) {
  const user = await User.findOne({
    where: { email: email },
  });

  console.log("User details : ", user);

  if (!user) {
    const error = new Error("User Not Found.") as any;
    error.code = 401;
    throw error;
  }

  const isEqual = compare(password, user.password);

  if (!isEqual) {
    const error = new Error("Password is incorrect.") as any;
    error.code = 401;
    throw error;
  }

  const token = sign(
    {
      userId: user.id.toString(),
      email: user.email,
      userRole: user.role,
    },
    process.env.SECRETE_KEY,
    { expiresIn: "1h" }
  );

  
  return { token: token, userId: user.id.toString(), userRole: user.role };
}

async function createPost({ postInputData }, req: Request | any) {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>FFFFFFFFFFFFFFFF>>>>>>>>>>>>>>>>.");
  
  console.log("In created Post => ",req);
  
  if (!req.isAuth) {
    const error = new Error("User Not Found.") as any;
    error.code = 401;
    throw error;
  }

  interface ErrorItem {
    message: string;
  }

  const errors: ErrorItem[] = [];

  if (
    isEmpty(postInputData.title) ||
    !isLength(postInputData.title, { min: 5 })
  ) {
    errors.push({ message: "Title is invalid." });
  }
  if (
    isEmpty(postInputData.content) ||
    !isLength(postInputData.content, { min: 5 })
  ) {
    errors.push({ message: "Content is invalid." });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid input.") as any;
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const user = await User.findOne({
    where: { id: parseInt(req.userId.toString()) },
  });

  console.log("user => ", user);

  if (!user) {
    const error = new Error("Invalid user.") as any;
    error.code = 401;
    throw error;
  }

  const post = new Post();
  post.title = postInputData.title;
  post.content = postInputData.content;
  post.imageUrl = postInputData.imageUrl;
  post.creator = user;

  const createdPost = await post.save();
  console.log("Post : => ", post);

  user.posts.push(createdPost);
  await user.save();

  console.log("createdPost ==> ", createdPost);

  return {
    ...createdPost,
    _id: post.id.toString(),
  };
}

export default { createUser, login, createPost };
