const express = require('express')
const GroupService = require('../service/group')
const code = require('../utils/code')
const { c } = require('../utils/ApiResponse')
const groupRouter = express.Router()

// 获取用户的所有分组
groupRouter.get('/', async (request, response, next) => {
  try {
    const userId = request.auth.id
    const groups = await GroupService.findByUserId(userId)
    const result = groups.map(({ _id, count, gname, descr, createTime, updateTime }) =>
      ({ id: _id, count, gname, descr, createTime, updateTime }))
    response.json(c(code.SUCCESS, 'ok!', result))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 查询分组
groupRouter.get('/:id', async (request, response, next) => {
  try {
    const group = await GroupService.findById(request.params.id)
    response.json(c(code.SUCCESS, 'ok', group))
  } catch (err) {
    response.json(c(code.C_PARAMETER_ERROR, 'specified id not found!'))
  }
})

// 新增分组
groupRouter.post('/', async (request, response, next) => {
  try {
    const user = request.auth
    const resp = await GroupService.add({
      userId: user.id,
      gname: request.body.gname,
      descr: request.body.descr
    })
    response.json(c(code.SUCCESS, 'ok', resp))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 更新分组
groupRouter.put('/', async (request, response, next) => {
  try {
    const group = request.body
    const { modifiedCount } = await GroupService.update(group)
    response.json(c(code.SUCCESS, 'ok!', modifiedCount))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 删除分组
groupRouter.delete('/:id', async (request, response, next) => {
  try {
    const ids = request.params.id.split(',')
    const resp = await GroupService.del(ids)
    response.json(c(code.SUCCESS, 'ok', resp.deletedCount))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

module.exports = groupRouter
