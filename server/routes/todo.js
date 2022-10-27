const { response, request } = require('express')
const express = require('express')
const TodoService = require('../service/todo')
const { c } = require('../utils/ApiResponse')
const code = require('../utils/code')
const todoRoute = express.Router()

// 获取指定 groupId 下的所有 todo
todoRoute.get('/groupId/:groupId', async (request, response, next) => {
  try {
    const groupId = request.params.groupId
    const resp = await TodoService.findByGroupId(groupId)
    response.json(c(code.SUCCESS, 'ok!', resp))
  } catch (err) {
    response.status(500).json(c(code.S_UNKOWN_ERROR, 'server error!'))
  }
})

// 查询 todo
todoRoute.get('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const resp = await TodoService.findById(id)
    response.json(c(code.SUCCESS, 'ok!', resp))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 新增 todo
todoRoute.post('/', async (request, response, next) => {
  try {
    const todo = request.body
    const resp = await TodoService.add(todo)
    response.json(c(code.SUCCESS, 'ok!', resp))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 更新 todo
todoRoute.put('/', async (request, response, next) => {
  try {
    const todo = request.body
    const { modifiedCount } = await TodoService.update(todo)
    response.json(c(code.SUCCESS, 'ok!', modifiedCount))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

// 删除 todo
todoRoute.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const resp = await TodoService.del(id)
    response.json(c(code.SUCCESS, 'ok!', resp))
  } catch (err) {
    response.json(c(code.FAILED, 'ok!'))
  }
})

module.exports = todoRoute
