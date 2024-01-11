import { hash, compare } from "bcryptjs";
import { isEmail, isEmty, isLength } from "validator";
import { sign } from "jsonwebtoken";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
