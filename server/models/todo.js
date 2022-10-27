const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    groupId: String,
    done: {
        type: Number,
        default: 0
    },
    star: {
        type: Number,
        default: 0
    },
    content: String,
    note: {
        type: String,
        default: ''
    },
    createTime: {
        type: String,
        default: ''
    },
    updateTime: String,
    scheduledTime: {
        type: String,
        default: ''
    }
})

TodoSchema.virtual('expried').get(function() {
    try {
        const now = Date.now()
        const scheduled = new Date(this.scheduledTime).getMilliseconds()
        return now > scheduled
    } catch (e) {
        return false
    }
})

module.exports = mongoose.model('Todo', TodoSchema)
