import { Router } from "express";
import { signUp as signUpController, login as loginController, } from "../controllers/auth";
const router = Router();
router.post("/signup", signUpController);
router.post("/login", loginController);
// exports = router;
export default router;
// export = { router};
//# sourceMappingURL=auth.js.map