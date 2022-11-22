import request from "@/utils/request"

// 获取全部的分组
export const getGroupApi = () => request('/group', 'get')

// 根据 id 获取分组
export const getGroupByIdApi = (id: number) => request(`/group/${id}`, 'get')

// 新建分组
export const addGroupApi = (data: any) => request('/group', 'post', data)

// 更新分组
export const updateGroupApi = (data: any) => request('/group', 'put', data)

// 删除分组
export const deleteGroupApi = (ids: number[]) => request(`/group/${ids.join(',')}`, 'delete')
