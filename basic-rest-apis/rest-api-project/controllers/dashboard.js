
const express = require('express')
const User = require("../models/user")


exports.userInfo = (req,res,next) =>{

 User.find()
    .then((users) =>{
       return users.map((user) => {
            let userData = {}
           userData.Name =  user.name,
           userData.TotalPost = user.posts.length
           console.log(userData);

           return userData;
        })
    }).then(userInfo => {
        console.log("user Info ",userInfo);
        return res.status(200).json({
            message : "User info fetched successfully.",
            userDetails : userInfo
        })
    }).catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}