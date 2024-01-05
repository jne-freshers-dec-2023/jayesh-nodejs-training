const express = require("express");
const authController = require("../controllers/auth");
const { signUpValidation } = require("../validations/signup");

const router = express.Router();

router.post("/signup", signUpValidation, authController.signUp);

router.post("/login", authController.login);

module.exports = router;
