import { Router } from "express";
// import { login, signUp } from "../controllers/auth";
import {
  signUp as signUpController,
  login as loginController
} from "../controllers/auth";

const router = Router();

router.post("/signup", signUpController);

router.post("/login", loginController);

export { router };
