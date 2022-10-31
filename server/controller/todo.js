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
    response.json(c(code.SUCCESS, 'ok!', resp.map(todo => ({
      id: todo._id.toString(),
      groupId: todo.groupId,
      content: todo.content,
      note: todo.note,
      done: todo.done,
      star: todo.star,
      createTime: todo.createTime,
      updateTIme: todo.updateTime,
      scheduledTime: todo.scheduledTime
    }))))
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

// 模糊查询所有的 todo
todoRoute.get('/search/:keyword', async (request, response, next) => {
  try {
    const userId = request.auth.id
    const keyword = request.params.keyword
    const resp = await TodoService.findByKeyword(userId, keyword)
    response.json(c(code.SUCCESS, 'ok!', resp.map(todo => ({
      id: todo._id.toString(),
      groupId: todo.groupId,
      content: todo.content,
      note: todo.note,
      done: todo.done,
      star: todo.star,
      createTime: todo.createTime,
      updateTIme: todo.updateTime,
      scheduledTime: todo.scheduledTime
    }))))
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
    const { modifiedCount: m } = await TodoService.update(todo)
    response.json(c(
      m === 1 ? code.SUCCESS : code.FAILED,
      m === 1 ? 'ok!' : 'todo not found!'
    ))
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
    console.log(err)
    response.json(c(code.FAILED, 'todo not found'))
  }
})

// 移动 todo 到其他的分组
todoRoute.get('/move/:todoId/:groupId', async (request, response, enxt) => {
  try {
    const { todoId, groupId } = request.params
    const { modifiedCount: m } = await TodoService.move(todoId, groupId)
    if(m === 0) {
      throw new Error('Parameter error!')
    }
    response.json(c(code.SUCCESS, 'ok!'))
  } catch (err) {
    response.json(c(code.FAILED, err.message))
  }
})

module.exports = todoRoute
