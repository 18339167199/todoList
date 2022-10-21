const express = require('express')
const UserService = require('../service/user')
const CommonResp = require('../utils/CommonResp')
const code = require('../utils/code')
const userRoute = express.Router()

/* GET users listing. */
userRoute.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

userRoute.post('/add', async (request, respond, next) => {
  const user = request.body

  console.log('add user: ', user)

  try {
    const resp = await UserService.add(user)
    console.log('add user result: ', resp)
    respond.send(new CommonResp({
      code: code.SUCCESS,
      data: resp,
      msg: '注册成功！'
    }))
  } catch (err) {
    respond.send(new CommonResp({
      code: code.FAILED,
      msg: '注册失败！'
    }))
  }
})

userRoute.get('/get/:id', (request, respond) => {
  const params = request.params
  User.find({}, (err, res) => {
    if (err) {
      respond.send('error')
      return
    }

    respond.send(res)
  })

  User.find()

  console.log('params: ', params)
})

module.exports = userRoute
