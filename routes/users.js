var mongoose = require('mongoose')
var plm = require('passport-local-mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Wattsapp')

const userSchema = mongoose.Schema({
  username: String,
  number: {
    type: String,
    required: true,
  },
  picture: {
    type : String,
    default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUbq3IrAVvxyjg_WQIhKZOBrq8X_H_91GlvSNjo1rxCSj3839RR3hsDWxPQaIMO1amuyM&usqp=CAU'
  },
  socketId:{
    type: String,
  }
})

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);