const mongoose = require('mongoose')
const User = require('./user')

const todoSchema = mongoose.Schema({
    task:{
      type:String,
      required: true
    },
    date:{
      type:Date,
      required: true
    }
},
{timestamp:true}
)


todoSchema.pre('findOneAndDelete',async function(next){
  const todoId  = this.getQuery()["_id"]
  await User.updateMany(
    {'todoList.todoId':todoId.toString()},
    {
      $pull:{
        todoList:{todoId : todoId.toString()}
      }
    }
  )
})

module.exports = mongoose.model("Todo",todoSchema);