const express = require("express");
const { body } = require("express-validator/check");
const { postValidation } = require("../validations/post");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// router.use(isAuth)
router.get("/posts", isAuth,feedController.getPosts);

router.post("/post", isAuth,postValidation, feedController.createPost);

router.get("/post/:postId", isAuth,feedController.getPost);

router.put("/post/:postId",isAuth,postValidation, feedController.updatePost);

router.delete("/post/:postId", isAuth,feedController.deletePost);

module.exports = router;
