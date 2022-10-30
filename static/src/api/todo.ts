import request from "@/utils/request"

// 根据 groupId 获取 todo
export const getTodoByGroupIdApi = (groupId: string) => request(`/todo/groupId/${groupId}`, 'get')

// 根据关键字模糊搜索 todo
export const searchTodoApi = (keyword: string) => request(`/todo/search/${keyword}`, 'get')

// 新增 todo
export const addTodoApi = (data: any) => request('/todo', 'post', data)

// 删除 todo
export const deleteTodoApi = (id: string) => request(`/todo/${id}`, 'delete')

// 修改 todo
export const updateTodoApi = (data: any) => request('/todo', 'put', data)

// 移动 todo 到其他的分组
export const moveToGroupApi = (todoId: string, groupId: string) => request(`/todo/move/${todoId}/${groupId}`, 'get')
