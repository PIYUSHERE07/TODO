const User = require('../models/user')
const {check,validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

exports.getSignup = (req,res,next)=>{
  req.session.isLoggedIn = false;
  res.render('signup',{
        isLoggedIn: false,
        errorMessage: []
      });
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
      return res.status(400)
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
          res.render('/login',
            {
              errorMessage:[]
            }
          )
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
  req.session.isLoggedIn = false;
  req.session.userId = null;
  res.render('login',
    {
      errorMessage:[]
    }
  )
}
exports.postLogin = async (req,res,next)=>{
  const {username,password} = req.body;
  const userdata = await User.find();
  const user = await userdata.find(user => user.username == username)
  if(!user){
    res.status(400).render('login',{
      errorMessage:["User Not Found"]
    });
  }
  else{
    const isMatch = await bcrypt.compare(password,user.password);

    if(isMatch){
      req.session.isLoggedIn = true;
      req.session.userId = user._id.toString();
      return req.session.save((err)=>{
        if(err) console.log(err);
        else res.redirect("/")
      })
    }
    else res.render('login',{
      errorMessage:["Username and Password not found"]
    })
  }
}

exports.getLogout = async (req,res,next)=>{
  req.session.isLoggedIn = false;
  req.session.userId=null;
  res.redirect('/')
}

exports.getDeleteAcc = async (req,res,next)=>{
  const userId = req.session.userId;
  await User.findByIdAndDelete(userId);
  req.session.isLoggedIn = false;
  req.session.userId=null;
  res.redirect('/')
}