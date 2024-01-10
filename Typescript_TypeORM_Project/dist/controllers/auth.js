var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult } from "express-validator";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { User } from "../entities/User";
dotenv.config();
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.statusCode = 422;
            const error = new Error("Validation Failed.");
            throw error;
        }
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const role = req.body.role;
        const hashPassword = yield hash(password, 12);
        console.log(hashPassword);
        const user = new User();
        user.email = email;
        user.name = name;
        user.role = role;
        user.password = hashPassword;
        const result = yield user.save();
        res
            .status(200)
            .json({ message: "User created!", userId: result.id, userRole: role });
        return result;
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let loadedUser;
        const user = yield User.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            res.statusCode = 401;
            const error = new Error("User with this email could not found.");
            throw error;
        }
        loadedUser = user;
        const isValid = yield compare(password, user.password);
        if (!isValid) {
            res.statusCode = 401;
            const error = new Error("Wrong Password.");
            throw error;
        }
        console.log("user ROle from ", loadedUser.role);
        const token = sign({
            email: loadedUser.email,
            userId: loadedUser.id.toString(),
            userRole: loadedUser.role,
        }, process.env.SECRETE_KEY || "", { expiresIn: "1h" });
        console.log("token : ", token);
        res.status(200).json({
            token: token,
            userId: loadedUser.id,
            userRole: loadedUser.role,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
export { signUp, login };
//# sourceMappingURL=auth.js.map