const express = require("express");
const path = require('path')
const router = express.Router();
const rootDir = require('../util/path')

//    /admin/add-product  => GET 
router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
  console.log("rootDir", rootDir)
  res.sendFile(path.join(rootDir,'views','add-product.html'))
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
