const express = require('express')
const UserService = require('../service/user')
const TokenService = require('../service/token')
const CommonResp = require('../utils/CommonResp')
const code = require('../utils/code')
const userRoute = express.Router()

userRoute.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

// 用户注册
userRoute.post('/add', async (request, respond, next) => {
  const user = request.body

  console.log('add user: ', user)

  try {
    const resp = await UserService.add(user)
    console.log('add user result: ', resp)
    respond.send(new CommonResp({
      code: code.SUCCESS,
      data: resp,
      msg: 'Registered successfully!'
    }))
  } catch (err) {
    respond.send(new CommonResp({
      code: code.FAILED,
      msg: 'Registration failed!'
    }))
  }
})

// 登录
userRoute.post('/login', async (request, respond, next) => {
  const { username, password } = request.body

  if (!username || !password) {
    respond.json(new CommonResp({
      code: code.FAILED,
      msg: 'username and password cannot be empty'
    }))
    return
  }

  try {
    const user = await UserService.getByUsernameAndPassword(username, password)
    if (!user) {
      respond.json(new CommonResp({
        code: code.FAILED,
        msg: 'username or password are incorrect!'
      }))
      return
    }
    const token = await TokenService.createToken(user)
    respond.json(new CommonResp({
      code: code.SUCCESS,
      msg: 'ok',
      data: {
        userInfo: {
          username: user.username,
          nikeName: user.nikeName,
          password: '',
          email: user.email
        },
        auth: token,
      }
    }))
  } catch (err) {
    console.log(err)
    respond.json(new CommonResp({
      code: code.S_UNKOWN_ERROR,
      msg: 'server error!'
    }))
  }

  console.log(`${username} login`)
})

// 获取用户信息
userRoute.get('/get', async (request, respond, next) => {
  const user = request.user

  respond.json('ok')
})

// 未登录错误
userRoute.get('/error', (request, respond) => {
  respond.status(401).json(new CommonResp({
    code: code.FAILED,
    msg: 'unauthorized'
  }))
})

module.exports = userRoute
