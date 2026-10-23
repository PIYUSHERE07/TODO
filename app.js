const express = require('express')
const userRouter = require('./routers/userRouter')
const path = require('path')
const rootDir = require('./utils/pathUtils')
const mongoose = require('mongoose')

const app = express();

app.set('view engine','ejs')
app.set('views','views')
app.use(express.static(path.join(rootDir,'public')));

app.use(userRouter)

const PORT = 3000;
mongoose.connect("mongodb+srv://todo:piyushere@firstcluster.lyzbkhu.mongodb.net/todo").then(()=>{
  console.log("mongo is connected");
  app.listen(PORT,()=>{
    console.log(`Server is running on port : http://localhost:${PORT}`);
  })
}).catch((error)=>{
  console.log("error occure : "+error)
})