const express = require('express')
const userRouter = express.Router()
const todoController = require('../controllers/todoController')
const authController = require('../controllers/authController')

userRouter.get("/",todoController.getHome)
userRouter.get("/signup",authController.getSignup)
userRouter.post("/signup",authController.postSignup)
userRouter.get("/login",authController.getLogin)
userRouter.post("/login",authController.postLogin)

module.exports = userRouter;