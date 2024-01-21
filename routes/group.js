const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({

    groupName: {
        type: String,
        unique: true
    },

    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]



})

module.exports = mongoose.model('Group',groupSchema)