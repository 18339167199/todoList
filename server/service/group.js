const GroupModel = require('../models/group')
const TodoModel = require('../models/todo')
const ObjectId = require('mongoose').Types.ObjectId
const { getCurrentDateStr } = require('../utils/date')

class GroupService {

  /***
   * 按分组 id 查询分组
   * @param {number} id
   */
  static findById = (id) => GroupModel.findById(id)

  /**
   * 按用户 id 查询分组
   * @param {number} userId
   */
  static findByUserId = (userId) => GroupModel.find({ userId })

  static getUserGroupIds = async (userId) => {
    const groups = await GroupModel.find({ userId }, { _id: 1 })
    return groups.map(group => group._id.toString())
  }

  /**
   * 新增分组
   * @param {Group} group
   */
  static add(group) {
    if (!group.gname) {
      return Promise.reject(new Error('gname cannot be empty!'))
    }
    group.createTime = getCurrentDateStr()
    return new GroupModel(group).save()
  }

  /**
   * 根据 ids 删除 group，支持批量删除
   * @param {number[]} ids
   */
  static async del(ids) {
    if (!ids || ids.length === 0) {
      return Promise.reject(new Error('id cannot be empty!'))
    }

    try {
      await TodoModel.deleteMany({ groupId: { $in: ids } })
      await GroupModel.deleteMany({ _id: { $in: ids } })
      return true
    } catch (err) {
      return Promise.reject(err)
    }
  }

  /**
   * 更新 group
   * @param {Group} group
   */
  static update(group) {
    const groupId = group.id
    if (!groupId) {
      return Promise.reject(new Error('groupId cannot be empty!'))
    }

    const updateGroupParams = {}
    Object.keys(group).filter(key => key !== 'id').forEach(key => {
      updateGroupParams[key] = group[key]
    })

    return GroupModel.updateOne({ _id: ObjectId(groupId) }, updateGroupParams)
  }

}

module.exports = GroupService
