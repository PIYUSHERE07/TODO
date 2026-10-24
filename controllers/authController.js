const User = require('../models/user')
const {check,validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

exports.getSignup = (req,res,next)=>{
  req.session.isLoggedIn = false;
  res.render('signup')
}

exports.postSignup = [
  check('firstname')
  .notEmpty()
  .withMessage("Firstname is required.")
  .trim()
  .isLength({min:2})
  .withMessage("Firstname atleast contain atleast two character")
  .matches(/^[a-zA-Z\S]+$/)
  .withMessage("Firstname can only cantain letters"),

  check('lastname')
  .notEmpty()
  .withMessage("Lastname is required.")
  .trim()
  .isLength({min:2})
  .withMessage("Lastname atleast contain atleast two character")
  .matches(/^[a-zA-Z\S]+$/)
  .withMessage("Lastname can only cantain letters"),

  check('username')
  .notEmpty()
  .withMessage("username is required.")
  .trim()
  .isLength({min:5})
  .withMessage("username atleast contain atleast five character")
  .matches(/^[a-zA-Z0-9\S]+$/)
  .withMessage("Firstname can only cantain letters and numbers"),

  check('password')
  .notEmpty()
  .withMessage("Password is required")
  .trim()
  .isLength({min:8})
  .withMessage("password atleast contain 8 characters")
  .matches(/^[a-zA-Z0-9\s@#$%&]+$/)
  .withMessage("password can contain only letters,numbers and some special charecter(@,#,$,%,&)"),

  check('conformPass')
  .trim()
  .custom((value,{req})=>{
    if(value != req.body.password){
      throw new Error("password does not matches")
    }
    return true;
  }),

  (req,res,next)=>{
    console.log(req.body);
    req.session.isLoggedIn = false
    const {firstname,lastname,username,password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log("user not saved")
      console.log(errors.array().map((error)=>error.msg))
      return res.status(422)
      .render('signup',{
        isLoggedIn: false,
        errorMessage: errors.array().map((error)=>error.msg),
        oldInput:{
          firstname,
          lastname,
          username,
          password
        }
      });
    }
    else{
      bcrypt.hash(password,12)
      .then(hashPassword=>{
        const user = new User({firstname,lastname,username,password:hashPassword});
        user.save()
        .then(()=>{
          res.redirect('/login')
        })
        .catch((err)=>{
          console.log("error in saving data : "+err)
          res.render('signup',{
          isLoggedIn: false,
          errorMessage: errors.array().map((error)=>error.msg),
          oldInput:{
            firstname,
            lastname,
            username,
            password
          }
        });
        })
      })
    }
  }
]
  
exports.getLogin = (req,res,next)=>{
  res.render('login')
}
exports.postLogin = async (req,res,next)=>{
  const {username,password} = req.body;
  const userdata = await User.find();
  const user = await userdata.find(user => user.username == username)
  
  if(!user){
    res.status(401).redirect('/login');
  }
  else{
    const isMatch = await bcrypt.compare(password,user.password);

    if(isMatch){
      req.session.isLoggedIn = true;
      res.redirect("/")
    }
    else res.redirect('/login')
  }
}