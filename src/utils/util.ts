export const getCurrentDateStr = (): string => {
  const date = new Date()
  return date.toLocaleString().replaceAll('/', '-')
}

// drawer 打开的方式
export enum DRAWER_TYPE {
  ADD_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP
}
