const UserModel = require('../models/user')
const ObjectId = require('mongoose').Types.ObjectId

class UserService {

    /**
     * 按 username 和 password 查找用户, 当 password 不传或者为空时按 username 查找
     * @param {string} username
     * @param {string} password
     * @returns User
     */
    static getByUsernameAndPassword = (username, password) => new Promise(async (resolve, reject) => {
        if (!username) {
            reject(new Error('username 不能为空！'))
            return
        }

        const queryParams = { username }
        if (password) {
            queryParams.password = password
        }

        try {
            const user = await UserModel.findOne(queryParams)
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })

    /**
     * 按 id 查找用户
     * @param {number} id 
     * @returns User 
     */
    static getById = (id) => new Promise(async (resolve, reject) => {
        if (!id) {
            reject(new Error('id 不能为空！'))
            return
        }

        try {
            const user = await UserModel.findOne({ _id: ObjectId(id) })
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })

    /**
     * 新增用户
     * @param {User} user 
     * @returns 
     */
    static add = (user) => new Promise(async (resolve, reject) => {
        const { username, password } = user

        if (!username || !password) {
            reject(new Error('Required fields not complete!'))
            return
        }

        const queryDBUser = await this.getByUsernameAndPassword(user.username)
        if (queryDBUser) {
            reject(new Error('The same username already exists, please change the username!'))
            return
        }

        try {
            await new UserModel(user).save()
            resolve(true)
        } catch (err) {
            reject(err)
        }
    })

}

module.exports = UserService
