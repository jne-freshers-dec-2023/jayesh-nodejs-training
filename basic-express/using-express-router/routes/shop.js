const express = require("express");

const router = express.Router();

// exact path + method
router.get("/", (req, res, next) => {
  res.send("<h1>Hello from Express! (shop)</h1>");
});

module.exports = router;
