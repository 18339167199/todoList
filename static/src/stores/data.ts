import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Todo, Group, User } from '@/types'
import LocalStorage from '@/utils/localStroage'
import { getCurrentDateStr } from '@/utils/util'
import { clearToken } from '@/utils/util'
import { TOKEN, TOKEN_EXPIRED } from '@/utils/constant'
import { setToken } from '@/utils/util'

// api
import { loginApi, getUserInfoApi } from '@/api/user'
import { getGroupApi, addGroupApi, updateGroupApi, deleteGroupApi } from '@/api/group'

export const useDataStore = defineStore('data', () => {
  const todos = reactive<Todo[]>([])
  const groups = reactive<Group[]>([])
  const users = reactive<User[]>([])
  const loginUser = ref<User>({
    username: '',
    password: '',
    nikeName: '',
    email: ''
  })

  const todoIdCount = ref<number>(0)
  const groupIdCount = ref<number>(0)
  const userIdCount = ref<number>(0)

  /**
   * Actions
   */

  const restoreUserInfo = async () => {
    try {
      const { code, data } = await getUserInfoApi()
      if (code === 0) {
        loginUser.value = data
      }
    } catch (err) {
      console.log('dataStore 33 line', err)
    }
  }

  const login = (data: { username: string, password: string }):Promise<{
    msg: string,
    data: User
  }> => {
    return new Promise((resolve, reject) => {
      loginApi(data).then(resp => {
        if (resp.code === 0) {
          loginUser.value = resp.data.userInfo
          setToken(resp.data.auth.token, resp.data.auth.expired)
          resolve({
            msg: `欢迎回来！${resp.data.userInfo.nikeName}`,
            data: resp.data.userInfo
          })
        } else {
          reject(new Error(resp.msg))
        }
      }, err => {
        reject(err)
      })
    })
  }

  const loginOut = () => {
    clearToken()
    loginUser.value = {
      username: '',
      password: '',
      nikeName: '',
      email: ''
    }
  }

  // user
  const addUser = (user: User) => {
    return new Promise<string>((resolve, reject) => {
      if (!user.username || !user.password) {
        reject(new Error('用户名或密码不能为空！'))
        return
      }

      if (users.find(u => u.username === user.username)) {
        reject(new Error('该用户名已存在，请更换后重试！'))
        return
      }
      
      // add user
      user.id = ++userIdCount.value
      user.nikeName = user.nikeName ? user.nikeName : 'todo007'
      users.push(user)

      // add default group
      const group1: Group = {
        id: -1,
        userId: user.id,
        count: 0,
        gname: '我的一天',
        descr: '每日计划',
        createTime: getCurrentDateStr(),
        updateTime: ''
      }
      const group2: Group = {
        id: -1,
        userId: user.id,
        count: 0,
        gname: '重要',
        descr: '重要的事情',
        createTime: getCurrentDateStr(),
        updateTime: ''
      }
      const group3: Group = {
        id: -1,
        userId: user.id,
        count: 0,
        gname: '今天吃什么',
        descr: '',
        createTime: getCurrentDateStr(),
        updateTime: ''
      }
      const group4: Group = {
        id: -1,
        userId: user.id,
        count: 0,
        gname: '娱乐活动安排',
        descr: '放松身心，适当运动~',
        createTime: getCurrentDateStr(),
        updateTime: ''
      }
      addGroup(group1)
      addGroup(group2)
      addGroup(group3)
      addGroup(group4)

      // add default todo
      const todo1: Todo = {
        id: todos.length + 1,
        groupId: group1.id,
        done: 0,
        star: 1,
        content: '我的待办，今天的任务待完成!',
        note: '',
        createTime: getCurrentDateStr(),
        updateTime: '',
        scheduledTime: ''
      }
      const todo2: Todo = {
        id: todos.length + 1,
        groupId: group1.id,
        done: 1,
        star: 0,
        content: '待办已完成，继续执行下一个计划!',
        note: '',
        createTime: getCurrentDateStr(),
        updateTime: '',
        scheduledTime: ''
      }
      addTodo(todo1)
      addTodo(todo2)

      setTimeout(resolve, 1000, '注册成功，请登录！')
    })
  }

  // group
  const fetchGroup = async () => {
    const resp = await getGroupApi()
    if (resp.code === 0) {
      groups.splice(0, groups.length)
      groups.push(...resp.data)
      return true
    }

    return false
  }
  const getGroupById = async (id: string) => groups.find(group => group.id === id)
  const addGroup = async (group: { gname: string, descr: string }) => {
    try {
      const { code } = await addGroupApi(group)
      return code === 0
    } catch (err) {
      return false
    } finally {
      fetchGroup()
    }
  }
  const updateGroup= async (group: { id: string, gname: string, descr: string }) => {
    try {
      const { code } = await updateGroupApi(group)
      return code === 0
    } catch (err) {
      return false
    } finally {
      fetchGroup()
    }
  }
  const deleteGroupByIds = async (ids: string[]) => {
    try {
      const { code } = await deleteGroupApi(ids)
      return code === 0
    } catch (err) {
      return false
    } finally {
      fetchGroup()
    }
  }

  // todo
  const getTodoById = (id: number) => todos.find(todo => todo.id === id)
  const addTodo = (todo: Todo): boolean => {
    const group = getGroupById(todo.groupId)
    if (!group) {
      return false
    }
    todo.id = ++todoIdCount.value
    todo.createTime = getCurrentDateStr()
    todos.push(todo)
    group.count ++
    return true
  }
  const updateTodoStatus = ({ id, type, value }: { id: number, type: 'done' | 'star', value: 0 | 1 }) => {
    const todo = getTodoById(id)
    if (!todo) {
      return false
    }
    todo[type] = value
    todo.updateTime = getCurrentDateStr()
    return true
  }
  const updateTodo = (todo: Todo) => {
    const originTodo = getTodoById(todo.id)
    if (!originTodo) {
      return false
    }
    originTodo.content = todo.content
    originTodo.note = todo.note
    originTodo.updateTime = getCurrentDateStr()
    originTodo.scheduledTime = todo.scheduledTime
    return true
  }
  const deleteTodo = (id: number): boolean => {
    const todo = getTodoById(id)
    if (!todo) {
      return false
    }
    const group = getGroupById(todo.groupId)

    if (!group) {
      return false
    }
    todos.splice(todos.indexOf(todo), 1)
    group.count --
    return true
  }
  const searchTodo = (keyWord: string): Todo[] => {
    const loginUserId = loginUser.value.id
    const groupIds = groups.filter(group => group.userId === loginUserId).map(group => group.id)
    return todos.filter(todo => groupIds.includes(todo.groupId) && todo.content.includes(keyWord))
  }
  const moveToGroup = (todoId: number, groupId: number) => {
    const todo = getTodoById(todoId)
    const afterGroup = getGroupById(groupId)
    if (!todo || !afterGroup || todo.groupId === afterGroup.id) {
      return false
    }
    const beforeGroup = getGroupById(todo.groupId)
    if (!beforeGroup) {
      return false
    }
    beforeGroup.count --
    afterGroup.count ++
    todo.updateTime = getCurrentDateStr()
    todo.groupId = afterGroup.id
    return true
  }

  /**
   * Getters
   */

  const hasLogined = computed(() => {
    const token = LocalStorage.get<string>(TOKEN)
    const tokenExpired = LocalStorage.get<number>(TOKEN_EXPIRED)
    return !!loginUser.value.username && !!token && !!tokenExpired && (Date.now() < tokenExpired)
  })

  const getUserInfo = computed(() => loginUser.value)

  // group
  const getGroups = computed(() => groups.filter(group => group.userId === loginUser.value.id))
  const getGroupNameById = computed(() => (id: string) => {
    const group = groups.find(group => group.id === id)
    if (!group) {
      return ''
    }
    return group.gname
  })

  // todo
  const getTodosByGroupId = computed(() => {
    return (groupId: number) => todos.filter(todo => todo.groupId === groupId)
  })

  return {
    todos,
    groups,
    users,
    loginUser,
    todoIdCount,
    groupIdCount,
    userIdCount,
    login,
    loginOut,
    restoreUserInfo,
    addUser,
    fetchGroup,
    addGroup,
    updateGroup,
    deleteGroupByIds,
    getTodoById,
    addTodo,
    updateTodoStatus,
    updateTodo,
    deleteTodo,
    searchTodo,
    moveToGroup,
    hasLogined,
    getUserInfo,
    getGroups,
    getGroupNameById,
    getTodosByGroupId
  }
})
