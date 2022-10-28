const UserModel = require('../models/user')
const { getCurrentDateStr } = require('../utils/date')
const ObjectId = require('mongoose').Types.ObjectId
const GroupService = require('../service/group')
const TodoService = require('../service/todo')

class UserService {

  /**
   * 按 username 和 password 查找用户, 当 password 不传或者为空时按 username 查找
   * @param {string} username
   * @param {string} password
   */
  static findByUsernameAndPassword(username, password) {
    if (!username) {
      return Promise.reject(new Error('username cannot be empty!'))
    }

    const queryParams = { username }
    if (password) {
      queryParams.password = password
    }

    return UserModel.findOne(queryParams)
  }

  /**
   * 按 id 查找用户
   * @param {number} id 
   */
  static findById(id) {
    if (!id) {
      return Promise.reject(new Error('id cannot be empty!'))
    }
    return UserModel.findOne({ _id: ObjectId(id) })
  }

  /**
   * 新增用户
   * @param {User} user 
   */
  static async add(user) {
    const { username, password } = user
    if (!username || !password) {
      return Promise.reject(new Error('username or password cannot be empty!'))
    }

    const queryDBUser = await this.findByUsernameAndPassword(username)
    if (queryDBUser) {
      return Promise.reject(new Error('same username already exists, please change the username!'))
    }

    const createUser = {
      username: user.username,
      password: user.password,
      email: user.email || '',
      nikeName: user.nikeName || 'Todo',
      createTime: getCurrentDateStr()
    }

    // 创建用户
    const newUser = await new UserModel(createUser).save()

    // 创建用户的默认分组
    const userId = newUser._id.toString()
    const group = await GroupService.add({ userId, gname: '我的一天', descr: '每日计划' })
    await GroupService.add({ userId, gname: '重要', descr: '重要的事情' })
    await GroupService.add({ userId, gname: '今天吃什么', descr: '' })
    await GroupService.add({ userId, gname: '娱乐活动安排', descr: '放松身心，适当运动~' })

    // 创建用户的默认待办
    const groupId = group._id.toString()
    await TodoService.add({ groupId, content: '我的待办，今天的任务待完成！', note: '为待办添加备注~', done: 0, star: 1 })
    await TodoService.add({ groupId, content: '待办已完成，继续完成下一个待办！', note: '', done: 1, star: 0 })

    return newUser
  }

}

module.exports = UserService
