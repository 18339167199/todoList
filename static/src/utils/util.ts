import LocalStorage from "@/utils/localStroage"
import { TOKEN, TOKEN_EXPIRED } from "@/utils/constant"

export const getCurrentDateStr = (): string => {
  const date = new Date()
  return date.toLocaleString().replaceAll('/', '-')
}

/**
 * 判断当前的 token 是否有效
 * @returns boolean
 */
export const isTokenEffective = (): boolean => {
  const token = LocalStorage.get<string>(TOKEN)
  const token_expired = LocalStorage.get<number>(TOKEN_EXPIRED)
  return !!token && !!token_expired && (Date.now() < token_expired)
}

export const getToken = () => LocalStorage.get<string>(TOKEN)

// drawer 打开的方式
export enum DRAWER_TYPE {
  ADD_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP
}
