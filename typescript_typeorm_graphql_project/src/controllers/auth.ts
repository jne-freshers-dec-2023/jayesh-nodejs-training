import { validationResult } from "express-validator";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";
dotenv.config();

const signUp = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      res.statusCode = 422;
      const error = new Error("Validation Failed.");
      throw error;
    }

    const email: string = req.body.email;
    const name: string = req.body.name;
    const password: string = req.body.password;
    const role: string = req.body.role;

    const hashPassword = await hash(password, 12);

    console.log(hashPassword);

    const user = new User();

    user.email = email;
    user.name = name;
    user.role = role;
    user.password = hashPassword;

    const result = await user.save();

    res
      .status(200)
      .json({ message: "User created!", userId: result.id, userRole: role });
    return result;
  } catch (err: any) {
    // if (!err.statusCode) {
    //   err.statusCode = 500;
    // }
    const status = err.statusCode || 500;
    const message = err.message;
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.statusCode = 404;
      const error = new Error("User with this email could not found.");
      throw error;
    }

    const isValid: boolean = await compare(password, user.password);

    if (!isValid) {
      res.statusCode = 401;
      const error = new Error("Wrong Password.");
      throw error;
    }
    console.log("user ROle from ", user.role);

    const token = sign(
      {
        email: user.email,
        userId: user.id.toString(),
        userRole: user.role,
      },
      process.env.SECRETE_KEY || "",
      { expiresIn: "1h" }
    );

    console.log("token : ", token);
    res.status(200).json({
      token: token,
      userId: user.id,
      userRole: user.role,
    });
  } catch (err: any) {
    // if (!err.statusCode) {
    //   err.statusCode = 500;
    // }
    const status = err.statusCode || 500;
    const message = err.message;
    next(err);
  }
};

export { signUp, login };
