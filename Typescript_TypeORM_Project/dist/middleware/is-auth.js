import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export function isAuth(req, res, next) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        res.statusCode = 401;
        const error = new Error("Not Authenticated.");
        throw error;
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    //   let decodedToken:  string | JwtPayload;
    let decodedToken;
    try {
        console.log(process.env.SECRETE_KEY);
        decodedToken = verify(token, process.env.SECRETE_KEY || "");
    }
    catch (err) {
        err.status = 500;
        throw err;
    }
    if (!decodedToken) {
        res.statusCode = 401;
        const error = new Error("Not Autheticated.");
        throw error;
    }
    console.log(decodedToken.userId);
    console.log(decodedToken.userRole);
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.userRole;
    next();
}
;
//# sourceMappingURL=is-auth.js.map