export type Todo = {
  id: number,
  groupId: number,
  done: 0 | 1,
  star: 0 | 1,
  content: string,
  note: string,
  createTime: string,
  updateTime: string,
  scheduledTime: string
}

export type Group = {
  id: number,
  userId: number,
  todoCount: number,
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
