const GroupModel = require('../models/group')
const ObjectId = require('mongoose').Types.ObjectId
const { getCurrentDateStr } = require('../utils/date')

class GroupService {

  /***
   * @param id id
   */
  static findById = (id) => GroupModel.findById(id)

  static findByUserId = (userId) => GroupModel.find({ userId })

  /**
   * 新增分组
   * @param {Group} group 
   * @returns 
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
  static del(ids) {
    if (!ids || ids.length === 0) {
      return Promise.reject(new Error('id cannot be empty!'))
    } else if (ids.length === 1) {
      return GroupModel.remove({ _id: ObjectId(ids[0]) })
    } else {
      return GroupModel.remove({ _id: { $in: ids } })
    }
  }

  /**
   * 更新 group
   * @param {Group} group 
   * @returns 
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
