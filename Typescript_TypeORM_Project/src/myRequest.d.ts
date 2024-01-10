// import { Request} from "express";
declare namespace Express {
  interface Request {
    userId?: string;
    userRole?: string;
  }
}
// declare module "express" {
//   interface Request {
//     userId?: string;
//     userRole?: string;
//   }
// }
// declare module "express-serve-static-core" {
//    interface Request {
//     userId?: string;
//     userRole?: string;
//   }
// }
