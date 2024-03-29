const { body } = require("express-validator/check");
const User = require("../models/user");

const signUpValidation = [
  body("email")
    .isEmail()
    .withMessage("Please Enter a valid Email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          new Promise().reject("Email is already exists.");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),
  body("role").trim().not().isEmpty(),
];

module.exports = { signUpValidation };
