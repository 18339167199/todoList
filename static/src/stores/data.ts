import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Todo, Group, User } from '@/types'
import LocalStorage from '@/utils/localStroage'
import { clearToken } from '@/utils/util'
import { TOKEN, TOKEN_EXPIRED } from '@/utils/constant'
import { setToken } from '@/utils/util'

// api
import { loginApi, getUserInfoApi } from '@/api/user'
import { getGroupApi, addGroupApi, updateGroupApi, deleteGroupApi } from '@/api/group'
import { getTodoByGroupIdApi, addTodoApi, deleteTodoApi, updateTodoApi, moveToGroupApi, searchTodoApi } from '@/api/todo'

export const useDataStore = defineStore('data', () => {
  const todos = reactive<Todo[]>([])
  const groups = reactive<Group[]>([])
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
  const fetchTodo = async (groupId: string) => {
    try {
      const { code, data } = await getTodoByGroupIdApi(groupId || '')
      if (code === 0) {
        todos.splice(0, todos.length)
        todos.push(...data)
      }
    } catch (err) {
      return false
    }
  }
  const getTodoById = (id: string) => todos.find(todo => todo.id === id)
  const addTodo = async (todo: { groupId: string , content: string, note: string, scheduledTime: string }) => {
    try {
      const { code } = await addTodoApi(todo)
      return code === 0
    } catch (err) {
      return false
    }
  }
  const updateTodoStatus = async ({ id, type, value }: { id: string, type: 'done' | 'star', value: 0 | 1 }) => {
    try {
      const todo = getTodoById(id)
      const { code } = await updateTodoApi({ id, [type]: value })
      if (code === 0 && todo) {
        todo[type] = value
      }
      return code === 0
    } catch (err) {
      return false
    }
  }
  const updateTodo = async (todo: Todo) => {
    try {
      const { code } = await updateTodoApi(todo)
      return code === 0
    } catch (err) {
      return false
    }
  }
  const deleteTodo = async (todoId: string) => {
    try {
      const { code } = await deleteTodoApi(todoId)
      return code === 0
    } catch (err) {
      return false
    }
  }
  const searchTodo = async (keyWord: string) => {
    try {
      const { code, data } = await searchTodoApi(keyWord)
      if (code === 0) {
        todos.splice(0, todos.length)
        todos.push(...data)
      }
      return code === 0
    } catch (err) {
      return []
    }
  }
  const moveToGroup = async (todoId: string, groupId: string) => {
    try {
      const { code } = await moveToGroupApi(todoId, groupId)
      return code === 0
    } catch (err) {
      return false
    }
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
  const getGroups = computed(() => groups)
  const getGroupNameById = computed(() => (id: string) => {
    const group = groups.find(group => group.id === id)
    return group ? group.gname : ''
  })

  // todo
  const getTodos = computed(() => todos)

  return {
    todos,
    groups,
    loginUser,
    todoIdCount,
    groupIdCount,
    userIdCount,
    login,
    loginOut,
    restoreUserInfo,
    fetchGroup,
    addGroup,
    updateGroup,
    deleteGroupByIds,
    getTodoById,
    fetchTodo,
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
    getTodos
  }
})
