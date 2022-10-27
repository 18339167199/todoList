const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    nikeName: String,
    email: String,
    createTime: String,
    updateTime: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('User', UserSchema)
