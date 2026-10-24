const express = require('express')
const userRouter = require('./routers/userRouter')
const path = require('path')
const rootDir = require('./utils/pathUtils')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const app = express();
const MONGO_URL = "mongodb+srv://todo:piyushere@firstcluster.lyzbkhu.mongodb.net/todo";

app.set('view engine','ejs')
app.set('views','views')
app.use(express.static(path.join(rootDir,'public')));
app.use(express.urlencoded({extended:true}))

const store = new MongoDBStore({
  uri :MONGO_URL,
  collection : 'sessions'
})

app.use(session({
  secret : "piyushmalewar",
  resave:false,
  saveUninitialized:true,
  store:store,
}))

app.use(userRouter)

const PORT = 3000;
mongoose.connect(MONGO_URL).then(()=>{
  console.log("mongo is connected");
  app.listen(PORT,()=>{
    console.log(`Server is running on port : http://localhost:${PORT}`);
  })
}).catch((error)=>{
  console.log("error occure : "+error)
})