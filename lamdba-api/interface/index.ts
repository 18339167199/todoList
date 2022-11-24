export interface Group {
    id: number,
    userId: number,
    gname: string,
    descr: string,
    todoCount: number,
    updateTime: string,
    createTime: string,
}

export interface Todo {
    id: number,
    groupId: number,
    content: string,
    note: string,
    done: 1 | 0,
    star: 1 | 0,
    updateTime: string,
    createTime: string,
    scheduledTime: string
}

export interface User {
    id: number,
    username: string,
    password: string,
    email: string,
    nikeName: string,
    updateTime: string,
    createTime: string,
}
