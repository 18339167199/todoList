import request from '@/utils/request'

// 登录
export const loginApi = (data: { username: string, password: string }) => request('/user/login', 'post', data)

// 注册
export const registerApi = (data: any) => request('/user/register', data)

// 获取用户信息
export const getUserInfoApi = () => request('/user', 'get')
