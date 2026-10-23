const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    require:true
  },
  username:{
    type:String,
    require:true,
    unique:true
  },
  password:{
    type:String,
    require:true
  }
})

module.exports = mongoose.model('User',userSchema);