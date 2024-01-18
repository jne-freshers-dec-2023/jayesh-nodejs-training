import { JwtPayload, verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export function isAuth(req: Request | any, res: Response, next: NextFunction) {
  const authHeader: any = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token: string = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = verify(token, process.env.SECRETE_KEY || "") as JwtPayload;
  } catch (err: any) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  console.log("decoded Token userid", decodedToken.userId);
  console.log("decoded tokedn userRole ", decodedToken.userRole);

  req.userId = decodedToken.userId;
  req.userRole = decodedToken.userRole;
  req.isAuth = true;

  next();
}
