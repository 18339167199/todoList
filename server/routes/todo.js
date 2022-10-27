const express = require('express')
const TodoService = require('../service/todo')
const { c } = require('../utils/ApiResponse')
const code = require('../utils/code')
const todoRouter = express.Router()

// 获取指定 groupId 下的所有 todo
todoRouter.get('/groupId/:groupId', async (request, response, next) => {
  try {
    const groupId = request.params.groupId
    const resp = await TodoService.findByGroupId(groupId)
    response.json(c(code.SUCCESS, 'ok!', resp))
  } catch (err) {
    response.status(500).json(c(code.S_UNKOWN_ERROR, 'server error!'))
  }
})

// 新增 todo

// 查询 todo

// 更新 todo

// 删除 tood

module.exports = todoRouter
