const express = require('express')
const userRouter = express.Router()
const todoController = require('../controllers/todoController')

userRouter.get("/",todoController.getHome)

module.exports = userRouter;