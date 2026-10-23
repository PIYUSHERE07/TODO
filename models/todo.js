const mongoose = require('mongoose')
const mongodb = require('mongodb')

const todoSchema = mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
    unique:ture
  },
  todoList:[{
    task:{
      type:stirng,
      required: true
    },
    date:{
      type:date,
      required: true
    }
  }
  ]
},
{timestamp:true}
)

module.exports = mongoose.exports('Todo',todoSchema);