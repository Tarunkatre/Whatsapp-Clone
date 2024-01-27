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
    default:'default.jpeg'
  },
  socketId:{
    type: String,
  }
})

userSchema.plugin(plm);
module.exports = mongoose.model('users', userSchema);