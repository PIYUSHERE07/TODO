const express = require('express')
const userRouter = require('./routers/userRouter')

const app = express();

app.set('view engine','ejs')
app.set('views','views')

app.use(userRouter)

const PORT = 3000;
app.listen(PORT,()=>{
  console.log(`Server is running on port : http://localhost:${PORT}`);
})