const {check,validationResult} = require('express-validator')
const mongoose = require('mongoose')
const User = require('../models/user')
const Todo = require('../models/todo')

exports.getTodo =async (req,res,next)=>{
  const userId = req.session.userId;
  if(userId){
    const userFound = await User.findById(userId);
    const todolist = await userFound.populate('todoList.todoId');
    const todos = todolist.todoList.map((todo=> todo.todoId ))
    res.render("home",{
      isLoggedIn : req.session.isLoggedIn,
      userData: await User.findById(req.session.userId),
      todoList:todos
    })
  }
  else{
    res.render("home",{
      isLoggedIn : req.session.isLoggedIn,
      userData: await User.findById(req.session.userId),
      todoList:[]
    })
  }
}
exports.postTodo =[
  check('todoTopic')
    .notEmpty()
    .withMessage("Task is required.")
    .trim()
    .isLength({min:2})
    .withMessage("Task atleast contain atleast two character")
    .matches(/^[a-zA-Z0-9 \S]+$/)
    .withMessage("Task can only cantain letters and numbers"),

  async (req,res,next)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
      console.log(errors.array().map(err=> err.msg))
      return res.status(400)
      .render('home',{
        errorMessage : errors.array().map(err=> err.msg),
        isLoggedIn : req.session.isLoggedIn
      }
      )
    }
    else{
      const {todoTopic,todoDate} = req.body;
      const Todo = require('../models/todo')
      const todo = new Todo({task:todoTopic,date:todoDate});
      await todo.save().then(async (rel)=>{
        const userId = req.session.userId;
        const userFound = await User.findById(userId);
        userFound.todoList.push({todoId:rel._id.toString()})
        await userFound.save()
      })
      res.render("todoAdded")
    }
  }
]

exports.deleteTodo = async (req,res,next)=>{
  const todoId = req.body.todoId;
  await Todo.findByIdAndDelete(todoId);
  return res.redirect('/')
}
