const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  userId: { type: String, require: true },
  token: { type: String, default: '' },
  expired: { type: Date, require: true }
})

TokenSchema.virtual('isExpired').get(function() {
  return Date.now() > this.expired.getTime()
})

module.exports = mongoose.model('Token', TokenSchema)
