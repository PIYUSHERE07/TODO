const express = require('express')
const userRouter = express.Router()
const todoController = require('../controllers/todoController')
const authController = require('../controllers/authController')

userRouter.get("/",todoController.getTodo)
userRouter.post("/",todoController.postTodo)
userRouter.post("/delete",todoController.deleteTodo)
userRouter.get("/signup",authController.getSignup)
userRouter.post("/signup",authController.postSignup)
userRouter.get("/login",authController.getLogin)
userRouter.post("/login",authController.postLogin)
userRouter.get("/logout",authController.getLogout)
userRouter.get("/deleteAcc",authController.getDeleteAcc)

module.exports = userRouter;