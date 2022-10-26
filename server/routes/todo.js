const express = require('express')
const todoRouter = express.Router()

// 获取指定 groupId 下的所有 todo
todoRouter.get('/group/:groupId', (request, response, next) => {
  const groupId = request.params.groupId  
})

// 新增 todo

// 查询 todo

// 更新 todo

// 删除 tood

module.exports = todoRouter
