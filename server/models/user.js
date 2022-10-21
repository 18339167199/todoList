const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id: { type: Number, require: true },
    username: String,
    password: String,
    nikeName: String,
    email: String,
    createTime: Date
})

module.exports = mongoose.model('User', UserSchema)
