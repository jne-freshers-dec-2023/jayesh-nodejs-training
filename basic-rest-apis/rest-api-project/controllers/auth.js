const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const role = req.body.role;

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      console.log(hashPassword);
      const user = new User({
        email: email,
        name: name,
        password: hashPassword,
        role: role,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "User created!", userId: result._id, userRole: role });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with this email could not found.");
        error.status = 401;
        throw error;
      }
      loadedUser = user;
      console.log("loadedc ",loadedUser);
      return bcrypt.compare(password, user.password);
    })
    .then((isValid) => {
      if (!isValid) {
        const error = new Error("Wrong Password.");
        error.status = 401;
        throw error;
      }
      console.log("user ROle from ", loadedUser.role);

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
          userRole: loadedUser.role,
        },
        process.env.SECRETE_KEY,
        { expiresIn: "1h" }
      );
      console.log("token : ", token);
      res
        .status(200)
        .json({
          token: token,
          userId: loadedUser._id,
          userRole: loadedUser.role,
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
