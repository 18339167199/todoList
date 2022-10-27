const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
  expired: String
})

TokenSchema.virtual('isExpired').get(function() {
  return Date.now() > this.expired.getTime()
})

module.exports = mongoose.model('Token', TokenSchema)
