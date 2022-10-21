const UserModel = require('../models/user')

class UserService {

    /**
     * 新增用户
     * @param {*} user 
     * @returns 
     */
    static add = (user) => new Promise((resolve, reject) => {
        const { username, password } = user

        if (!username || !password) {
            reject(new Error('必填项未填写完整！'))
            return false
        }

        new UserModel(user).save(resp => {
            resolve(true)
            console.log('add user promise resolve', resp)
        }, err => {
            reject(err)
        })
    })

}

module.exports = UserService
