import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Todo, Group, User } from '@/types'
import LocalStorage from '@/utils/localStroage'
import { getCurrentDateStr } from '@/utils/util'

export const useDataStore = defineStore('data', () => {
  const todos = reactive<Todo[]>([])
  const groups = reactive<Group[]>([])
  const users = reactive<User[]>([])
  const loginUser = ref<User>({ // 当前登录的用户
    id: -1,
    username: '',
    password: '',
    nikeName: '',
    email: ''
  })

  const todoIdCount = ref<number>(0)
  const groupIdCount = ref<number>(0)
  const userIdCount = ref<number>(0)

  // Actions
  const restoreFromLocalStroage = () => {
    const dataFromLocalStorage = LocalStorage.get<{
      todos: Todo[],
      groups: Group[],
      users: User[],
      loginUser: User,
      todoIdCount: number,
      groupIdCount: number,
      userIdCount: number
    }>('state')

    if (!dataFromLocalStorage) {
      return
    }

    if (dataFromLocalStorage.todos) {
      todos.splice(0, todos.length)
      todos.push(...dataFromLocalStorage.todos)
    }

    if (dataFromLocalStorage.groups) {
      groups.splice(0, groups.length)
      groups.push(...dataFromLocalStorage.groups)
    }

    if (dataFromLocalStorage.users) {
      users.splice(0, users.length)
      users.push(...dataFromLocalStorage.users)
    }

    if (dataFromLocalStorage.loginUser) {
      loginUser.value = dataFromLocalStorage.loginUser
    }

    if (dataFromLocalStorage.todoIdCount) {
      todoIdCount.value = dataFromLocalStorage.todoIdCount
    }

    if (dataFromLocalStorage.groupIdCount) {
      groupIdCount.value = dataFromLocalStorage.groupIdCount
    }

    if (dataFromLocalStorage.userIdCount) {
      userIdCount.value = dataFromLocalStorage.userIdCount
    }
  }

  const login = ({ username, password }: { username: string, password: string }) => {
    return new Promise<{
      msg: string,
      data: User
    }>((resolve, reject) => {
      const user = users.find(user => user.username === username && user.password === password)

      if (!user) {
        reject(new Error('用户名或密码错误，请检查后重试！'))
        return
      }

      // 登录成功
      loginUser.value = user

      setTimeout(resolve, 1000, {
        msg: `欢迎回来！${user.nikeName}`,
        data: user
      })
    })
  }

  const addUser = (user: User) => {
    return new Promise<string>((resolve, reject) => {
      if (!user.username || !user.password) {
        reject(new Error('用户名或【密码了不能为空！'))
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

  const addGroup = (group: Group): boolean => {
    group.id = ++groupIdCount.value
    if (group.userId > 0) {
      groups.push(group)
      return true
    }
    return false
  }

  const addTodo = (todo: Todo): boolean => {
    const group = groups.find(group => group.id === todo.groupId)
    if (!group) {
      return false
    }
    todo.id = ++todoIdCount.value
    todos.push(todo)
    group.count ++
    return true
  }

  // Getters
  const hasLogined = computed(() =>
    loginUser.value.id > 0 && loginUser.value.username && loginUser.value.password)

  return {
    todos,
    groups,
    users,
    loginUser,
    todoIdCount,
    groupIdCount,
    userIdCount,
    login,
    restoreFromLocalStroage,
    addUser,
    addGroup,
    addTodo,
    hasLogined
  }
})