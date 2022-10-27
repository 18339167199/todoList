const TodoModel = require('../models/todo')

class TodoService {

  /**
   * 按 groupId 查找 todo
   * @param {number} groupId
   * @returns 
   */
  static findByGroupId = (groupId) => TodoModel.find({ groupId })

}

module.exports = TodoService
