const express = require('express')
const GroupService = require('../service/group')
const code = require('../utils/code')
const { c } = require('../utils/ApiResponse')
const groupRoute = express.Router()

// 获取用户的所有分组
groupRoute.get('/', async (request, response, next) => {
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
groupRoute.get('/:id', async (request, response, next) => {
  try {
    const group = await GroupService.findById(request.params.id)
    response.json(c(code.SUCCESS, 'ok', group))
  } catch (err) {
    response.json(c(code.C_PARAMETER_ERROR, 'specified id not found!'))
  }
})

// 新增分组
groupRoute.post('/', async (request, response, next) => {
  try {
    const userId = request.auth.id
    const { gname, descr } = request.body
    await GroupService.add({ userId, gname, descr })
    response.json(c(code.SUCCESS, 'ok'))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 更新分组
groupRoute.put('/', async (request, response, next) => {
  try {
    const group = request.body
    const { modifiedCount: m } = await GroupService.update(group)
    response.json(c(
      m === 1 ? code.SUCCESS : code.FAILED,
      m === 1 ? 'ok!' : 'group not found!',
    ))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 删除分组
groupRoute.delete('/:id', async (request, response, next) => {
  try {
    const ids = request.params.id.split(',')
    const resp = await GroupService.del(ids)
    response.json(c(code.SUCCESS, 'ok', resp.deletedCount))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

module.exports = groupRoute
