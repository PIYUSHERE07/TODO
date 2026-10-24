const mongoose = require('mongoose')
const mongodb = require('mongodb')

const todoSchema = mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  },
  todoList:[{
    task:{
      type:String,
      required: true
    },
    date:{
      type:Date,
      required: true
    }
  }
  ]
},
{timestamp:true}
)

module.exports = mongoose.model("Todo",todoSchema);