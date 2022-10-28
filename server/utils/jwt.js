const jwt = require('jsonwebtoken')
const { tokenExpiredTime } = require('../config')

const secretKey = 'tokenKey No1 φ(*￣0￣)'

// jwt 创建 token
const createToken = (user) => jwt.sign(
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

module.exports = {
  createToken,
  secretKey
}
