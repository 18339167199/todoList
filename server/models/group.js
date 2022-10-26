const mongoose = require('mongoose')
const { getCurrentDateStr } = require('../utils/date')

const GroupSchema = new mongoose.Schema({
    userId: String,
    count: {
        type: Number,
        default: 0
    },                       
    gname: String,
    descr: String,
    createTime: {
        type: String,
        default: ''
    },
    updateTime: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Group', GroupSchema)
