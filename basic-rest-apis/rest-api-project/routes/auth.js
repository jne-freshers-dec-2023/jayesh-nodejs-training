
const express = require('express');
const {body} = require('express-validator/check')
const authController = require('../controllers/auth')
const User = require('../models/user')

const router = express.Router()

router.post('/signup',[
    body('email').isEmail().withMessage('Please Enter a valid Email.')
    .custom((value,{req}) =>{
        return User.findOne({email :value}).then( (userDoc) =>{
            if(userDoc){
                new Promise().reject('Email is already exists.')
            }
        })
    }).normalizeEmail(),
    body('password').trim().isLength({min : 5}),
    body('name').trim().not().isEmpty()

], authController.signUp)

router.post('/login',authController.login)

module.exports = router;