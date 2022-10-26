const jwt = require('jsonwebtoken')
const { tokenExpiredTime } = require('../config')

const secretKey = 'tokenKey No1 φ(*￣0￣)'

module.exports = {
  createToken (user) {
    return jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: user._id.toString()
      },
      secretKey,
      {
        expiresIn: `${tokenExpiredTime}h`
      }
    )
  },
  uncoding(token) {
    
  }
}

module.exports.secretKey = secretKey
