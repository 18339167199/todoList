const express = require('express')
const UserService = require('../service/user')
const TokenService = require('../service/token')
const { c } = require('../utils/ApiResponse')
const code = require('../utils/code')
const userRoute = express.Router()

// 获取用户信息
userRoute.get('/', async (request, response, next) => {
  try {
    const userId = request.auth.id
    const resp = await UserService.findById(userId)
    response.json(c(code.SUCCESS, 'ok!', {
      username: resp.username,
      nikeName: resp.nikeName,
      email: resp.email,
      createTime: resp.createTime,
      updateTime: resp.updateTime
    }))
  } catch (err) {
    response.json(c(code.FORBID, 'user is not login.'))
  }
})

// 用户注册
userRoute.post('/', async (request, response, next) => {
  try {
    const user = request.body
    const resp = await UserService.add(user)
    response.json(c(code.SUCCESS, 'ok!', resp))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 登录
userRoute.post('/login', async (request, response, next) => {
  const { username, password } = request.body
  if (!username || !password) {
    response.json(c(code.FAILED, 'username and password cannot be empty'))
    return
  }

  try {
    const user = await UserService.findByUsernameAndPassword(username, password)
    if (!user) {
      response.json(c(code.FAILED, 'username or password are incorrect!'))
      return
    }
    const token = await TokenService.createToken(user)
    response.json(c(code.SUCCESS, 'ok!', {
      userInfo: {
        username: user.username,
        nikeName: user.nikeName,
        password: '',
        email: user.email
      },
      auth: token,
    }))
    console.log(`${username} login`)
  } catch (err) {
    console.log('login error!', err)
    response.json(c(code.S_UNKOWN_ERROR, 'server error!'))
  }
})

module.exports = userRoute
