const TokenModel = require('../models/token')
const { tokenExpiredTime } = require('../config')
const jwtUtil = require('../utils/jwt')

const getDateAfterDay = (day) => {
  return new Date(Date.now() + day*24*60*60*1000)
}

class TokenService {

  /**
   * 创建认证 token
   * @param {User} user
   */
  static createToken = (user) => new Promise(async (resolve, reject) => {
    const token = jwtUtil.createToken(user)
    const isTokenExsit = await TokenModel.findOne({ userId: user._id.toString() })

    try {
      const method = !!isTokenExsit ? this.update : this.add
      const result = await method(user._id.toString(), token)
      if ( (result && result.modifiedCount > 0) || (result && result._id) ) {
        resolve({
          token,
          expired: getDateAfterDay(30).getTime()
        })
      } else {
        reject(new Error('server error'))
      }
    } catch (err) {
      reject(err)
    }
  })

  /**
   * 添加 token
   * @param {number} userId
   * @param {string} token
   */
  static add = (userId, token) => new Promise(async (resolve, reject) => {
    const tokenItem = await TokenModel.findOne({ userId })
    if (tokenItem) {
      reject(new Error('The token of the user already exists!'))
      return
    }

    new TokenModel({
      userId,
      token,
      expired: getDateAfterDay(tokenExpiredTime)
    }).save(function(err, result) {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  })

  /**
   * 更新 token
   * @param {*} userId
   * @param {*} token
   */
  static update = (userId, token) => new Promise(async (resolve, reject) => {
    try {
      const updateResult = await TokenModel.updateOne(
        { userId },
        {
          token,
          expired: getDateAfterDay(tokenExpiredTime)
        }
      )
      if (updateResult.modifiedCount === 1) {
        resolve(updateResult)
      } else {
        reject(new Error('not found!'))
      }
    } catch (err) {
      reject(err)
    }

  })

}

module.exports = TokenService
