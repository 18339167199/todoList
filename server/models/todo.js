const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    id: { type: Number, require: true },
    groupId: { type: Number, require: true },
    done: Number,
    star: Number,
    content: String,
    note: String,
    createTime: String,
    updateTime: String,
    scheduledTime: String
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

export default TodoSchema
