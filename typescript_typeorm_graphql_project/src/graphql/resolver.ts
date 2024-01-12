import { hash, compare } from "bcryptjs";
import { isEmail, isEmty, isLength } from "validator";
import { sign } from "jsonwebtoken";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

async function createUser({ userInput }, req: Request) {
  let errors: Array<{
    message: string;
  }>;

  if (!isEmail(userInput.email)) {
    errors.push({ message: "Email is invalid." });
  }

  if (isEmty(userInput.password) || isLength(userInput.password, { min: 5 })) {
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

export default { createUser };
