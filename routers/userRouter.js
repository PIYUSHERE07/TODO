const express = require('express')
const userRouter = express.Router()

userRouter.get("/",(req,res,next)=>{
  res.render("home")
})

module.exports = userRouter;