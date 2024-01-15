import { hash, compare } from "bcryptjs";
import { isEmail, isEmpty, isLength } from "validator";
import { sign } from "jsonwebtoken";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

interface ErrorItem {
  message: string;
}

async function createUser({ userInput }, req: Request) {
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
    error.code = 404;
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
  console.log("In the create post resolver");

  console.log("In created Post => ", req);

  if (!req.isAuth) {
    const error = new Error("Not authenticated!") as any;
    error.code = 401;
    throw error;
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

  await user.save();

  console.log("createdPost ==> ", createdPost);

  return {
    ...createdPost,
    _id: post.id.toString(),
  };
}

async function getPosts(args: any, req: Request | any) {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!") as any;
    error.code = 401;
    throw error;
  }

  const totalPosts = await Post.count();

  const posts = await Post.find({
    order: {
      id: {
        direction: "ASC",
      },
    },
    relations: {
      creator: true,
    },
  });

  // const posts = await Post.createQueryBuilder("post")
  //   .leftJoinAndSelect("post.creator", "creator")
  //   .orderBy("post.id", "ASC")
  //   .getMany();

  console.log("Posts : => ", posts);

  return {
    posts: posts.map((p) => {
      return {
        ...p,
        id: p.id,
      };
    }),
    totalPosts: totalPosts,
  };
}

async function getPostById({ id }, req: Request | any) {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!") as any;
    error.code = 401;
    throw error;
  }

  const post = await Post.findOne({
    where: {
      id,
    },
    relations: {
      creator: true,
    },
  });

  // const post = await Post.createQueryBuilder("post")
  //   .leftJoinAndSelect("post.creator", "creator")
  //   .where("post.id = :id", { id: id })
  //   .getOne();

  console.log("Post by Id => ", post.creator);

  if (!post) {
    const error = new Error("No post found!") as any;
    error.code = 404;
    throw error;
  }

  console.log("Post creator id", post.creator.id);

  return {
    ...post,
  };
}

async function updatePost({ id, postInput }, req: Request | any) {
  console.log({ id, postInput });
  console.log("Req is Auth ", req.isAuth);

  if (!req.isAuth) {
    const error = new Error("Not authenticated!") as any;
    error.code = 401;
    throw error;
  }

  const post = await Post.createQueryBuilder("post")
    .leftJoinAndSelect("post.creator", "creator")
    .where("post.id = :id", { id: id })
    .getOne();

  if (!post) {
    const error = new Error("No post found!") as any;
    error.code = 404;
    throw error;
  }

  if (post.creator.id !== parseInt(req.userId)) {
    const error = new Error("Not authorized!") as any;
    error.code = 403;
    throw error;
  }

  const errors = [];
  if (isEmpty(postInput.title) || !isLength(postInput.title, { min: 5 })) {
    errors.push({ message: "Title is invalid." });
  }
  if (isEmpty(postInput.content) || !isLength(postInput.content, { min: 5 })) {
    errors.push({ message: "Content is invalid." });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid input.") as any;
    error.data = errors;
    error.code = 422;
    throw error;
  }

  post.title = postInput.title;
  post.content = postInput.content;
  post.imageUrl = postInput.imageUrl;

  const updatedPost = await post.save();

  return {
    ...updatedPost,
  };
}

async function deletePost({ id }, req: Request | any) {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!") as any;
    error.code = 401;
    throw error;
  }

  const post = await Post.createQueryBuilder("post")
    .leftJoinAndSelect("post.creator", "creator")
    .where("post.id = :id", { id: id })
    .getOne();

  console.log("Post ====>", post);

  if (!post) {
    const error = new Error("No post found!") as any;
    error.code = 404;
    throw error;
  }
  if (post.creator.id !== parseInt(req.userId)) {
    const error = new Error("Not authorized!") as any;
    error.code = 403;
    throw error;
  }

  await Post.delete({
    id: id,
  });

  await post.save();

  return true;
}

export default {
  createUser,
  login,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
