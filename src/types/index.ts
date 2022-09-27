export type Todo = {
  id: number,
  groupId: number,
  done: number,
  star: number,
  content: string,
  note: string,
  createTime: string,
  updateTime: string,
  scheduledTime: string
}

export type Group = {
  id: number,
  userId: number,
  folderId: number,
  count: number,
  icon: string,
  gname: string,
  descr: string,
  createTime: string,
  updateTime: string
}

export type User = {
  username: string,
  password: string,
  nikeName: string,
  email: string
}
