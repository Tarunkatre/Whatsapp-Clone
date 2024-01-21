var mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  message:{
    type: String,
    required: true
  },
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  reciever:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
},{
    timestamps:true
})

module.exports = mongoose.model('Message', messageSchema);