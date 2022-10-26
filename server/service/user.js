const UserModel = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId

class UserService {

  /**
   * 按 username 和 password 查找用户, 当 password 不传或者为空时按 username 查找
   * @param {string} username
   * @param {string} password
   * @returns User
   */
  static getByUsernameAndPassword(username, password) {
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
   * @returns User 
   */
  static getById(id) {
    if (!id) {
      return Promise.reject(new Error('id cannot be empty!'))
    }
    return UserModel.findOne({ _id: ObjectId(id) })
  }

  /**
   * 新增用户
   * @param {User} user 
   * @returns 
   */
  static async add(user) {
    const { username, password } = user
    if (!username || !password) {
      return Promise.reject(new Error('Required fields not complete!'))
    }

    const queryDBUser = await this.getByUsernameAndPassword(user.username)
    if (queryDBUser) {
      return Promise.reject(new Error('The same username already exists, please change the username!'))
    }

    return new UserModel(user).save()
  }
}

module.exports = UserService
