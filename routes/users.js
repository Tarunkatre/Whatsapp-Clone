var mongoose = require('mongoose')
var plm = require('passport-local-mongoose');


const userSchema = mongoose.Schema({
  username: String,
  number: {
    type: String,
    required: true,
  },
  picture: {
    type : String,
    default:'user.jpeg'
  },
  socketId:{
    type: String,
  }
})

userSchema.plugin(plm);
module.exports = mongoose.model('users', userSchema);