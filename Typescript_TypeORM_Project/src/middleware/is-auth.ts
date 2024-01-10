import { JwtPayload, verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export function isAuth(req: Request | any, res: Response, next: NextFunction) {
  const authHeader: any = req.get("Authorization");

  if (!authHeader) {
    res.statusCode = 401;
    const error = new Error("Not Authenticated.");
    throw error;
  }

  const token: string = authHeader.split(" ")[1];
  console.log(token);

  //   let decodedToken:  string | JwtPayload;
  let decodedToken;

  try {
    console.log(process.env.SECRETE_KEY);
    decodedToken = verify(token, process.env.SECRETE_KEY || "") as JwtPayload;
  } catch (err: any) {
    err.status = 500;
    throw err;
  }

  if (!decodedToken) {
    res.statusCode = 401;
    const error = new Error("Not Autheticated.");
    throw error;
  }
  console.log("decoded Token userid", decodedToken.userId);
  console.log("decoded tokedn userRole ", decodedToken.userRole);

  req.userId = decodedToken.userId;
  req.userRole = decodedToken.userRole;

  next();
}
