import LocalStorage from "@/utils/localStroage"
import { TOKEN, TOKEN_EXPIRED } from "@/utils/constant"

export const getCurrentDateStr = (): string => {
  const date = new Date()
  return date.toLocaleString().replaceAll('/', '-')
}

export const setToken = (token: string, token_expired: number) => {
  LocalStorage.set(TOKEN, token)
  LocalStorage.set(TOKEN_EXPIRED, token_expired)
}

/**
 * 获取 token 信息
 * @returns string
 */
export const getToken = () => LocalStorage.get<string>(TOKEN)

/**
 * 清除 token 信息
 */
export const clearToken = () => {
  LocalStorage.remove(TOKEN)
  LocalStorage.remove(TOKEN_EXPIRED)
}

/**
 * 判断当前的 token 是否有效
 * @returns boolean
 */
export const isTokenEffective = (): boolean => {
  const token = getToken()
  const token_expired = LocalStorage.get<number>(TOKEN_EXPIRED)
  const result = !!token && !!token_expired && (Date.now() < token_expired)
  if (!result) {
    // token 失效清除
    clearToken()
  }
  return result
}

// drawer 打开的方式
export enum DRAWER_TYPE {
  ADD_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP
}
