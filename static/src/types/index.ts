export type Todo = {
  id: string,
  groupId: string,
  done: 0 | 1,
  star: 0 | 1,
  content: string,
  note: string,
  createTime: string,
  updateTime: string,
  scheduledTime: string
}

export type Group = {
  id: string,
  userId: string,
  count: number,
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
