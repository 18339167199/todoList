const TodoModel = require('../models/todo')
const GroupService = require('../service/group')
const { getCurrentDateStr } = require('../utils/date')
const ObjectId = require('mongoose').Types.ObjectId

class TodoService {

  /**
   * 按 groupId 查找 todo
   * @param {number} groupId
   * @returns 
   */
  static findByGroupId = (groupId) => TodoModel.find({ groupId })

  /**
   * 按 id 查找 todo
   * @param {number} id
   */
  static findById = (id) => TodoModel.findById(id)

  /**
   * 新增 todo
   * @param {Todo} todo 
   * @returns 
   */
  static async add(todo) {
    if (!todo.content) {
      return Promise.reject(new Error('content cannot be empty!'))
    }

    const groupId = todo.groupId
    const group = await GroupService.update({
      id: groupId,
      $inc: { count: 1 } // count ++
    })

    todo.createTime = getCurrentDateStr()
    return new TodoModel(todo).save()
  }

  /**
   * 更新 todo
   * @param {Todo} todo 
   * @returns 
   */
  static update(todo) {
    const todoId = todo.id
    if (!todoId) {
      return Promise.reject(new Error('todoId cannot be empty!'))
    }

    const updateTodoParams = {}
    Object.keys(todo).filter(key => key !== 'id').forEach(key => {
      updateTodoParams[key] = todo[key]
    })
    updateTodoParams.updateTime = getCurrentDateStr()

    return TodoModel.updateOne({ _id: ObjectId(todoId) }, updateTodoParams)
  }

  /**
   * 删除 todo
   * @param {number} todoId 
   * @returns 
   */
  static async del(todoId) {
    if (!todoId) {
      return Promise.reject(new Error('todoId cannot be empty!'))
    }

    const todo = await this.findById(todoId)
    if (!todo) {
      return Promise.reject(new Error('todo not found!'))
    }

    const groupId = todo.groupId
    const group = await GroupService.update({
      id: groupId,
      $inc: { count: -1 } // count --
    })

    return TodoModel.deleteOne({ _id: ObjectId(todoId) })
  }
}

module.exports = TodoService
