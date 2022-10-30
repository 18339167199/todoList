const TodoModel = require('../models/todo')
const GroupService = require('../service/group')
const { getCurrentDateStr } = require('../utils/date')
const ObjectId = require('mongoose').Types.ObjectId

class TodoService {

  /**
   * 按 groupId 查找 todo
   * @param {number} groupId
   */
  static findByGroupId = (groupId) => TodoModel.find({ groupId })

  /**
   * 按 id 查找 todo
   * @param {number} id
   */
  static findById = (id) => TodoModel.findById(id)

  /**
   * 按关键字模糊查询 todo
   * @param {string} keyword
   */
  static findByKeyword = async (userId, keyword) => {
    // TodoModel.find({ content: new RegExp(keyword, 'i') })
    const groupIds = await GroupService.getUserGroupIds(userId)
    
    console.log(groupIds)
    return TodoModel.find({ content: new RegExp(keyword, 'i'), groupId: { $in: groupIds } })
  }

  /**
   * 新增 todo
   * @param {Todo} todo
   */
  static async add(todo) {
    try {
      const groupId = todo.groupId
      const { modifiedCount } = await GroupService.update({ id: groupId, $inc: { count: 1 } })
      if (modifiedCount === 0) {
        throw new Error('group not found!')
      }
      todo.createTime = getCurrentDateStr()
      return new TodoModel(todo).save()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  /**
   * 更新 todo
   * @param {Todo} todo
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
   */
  static async del(todoId) {
    try {
      const todo = await this.findById(todoId)
      await GroupService.update({ id: todo.groupId, $inc: { count: -1 } })
      return TodoModel.deleteOne({ _id: ObjectId(todoId) })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  /**
   * 将 todo 移动到另一个分组
   * @param {number} todoId
   * @param {number} groupId
   */
  static async move(todoId, groupId) {
    try {
      const todo = await this.findById(todoId)
      await GroupService.update({ id: todo.groupId, $inc: { count: -1 } })
      const afterGroup = await GroupService.update({ id: groupId, $inc: { count: 1 } })
      if (afterGroup.modifiedCount === 0) {
        GroupService.update({ id: todo.groupId, $inc: { count: 1 } })
        throw new Error('group not found!')
      }
      return this.update({ id: todoId, groupId })
    } catch (err) {
      Promise.reject(err)
    }
  }

}

module.exports = TodoService
