const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    id: { type: Number, require: true },
    userId: { type: Number, require: true },
    count: { type: Number, default: 0 },                       
    gname: String,
    descr: String,
    createTime: String,
    updateTime: String
})

module.exports = mongoose.model('Group', GroupSchema)
