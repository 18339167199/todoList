import { User } from '../interface';
import { db } from '../utils/db';
import { getCurrentDateStr } from '../utils/utils';
const TableName = 'lmb-todo-users';

export const UserService = {
    // 获取全部的用户
    getAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: 'username = :username',
                    ExpressionAttributeValues: {
                        ':username': 'root112',
                    },
                },
                function (error: any, data: any) {
                    error ? reject(error) : resolve(data as User[]);
                }
            );
        });
    },

    // 根据 id 查询用户
    getById(id: number): Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: 'id = :id',
                    ExpressionAttributeValues: {
                        ':id': id,
                    },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data && data.Items && data.Items[0] ? (data.Items[0] as User) : null);
                }
            );
        });
    },

    // 根据 username 和 password 查找用户
    getByUsernameAndPassword(username: string, password?: string): Promise<User | null> {
        let attr: { [propName: string]: string } = { ':username': username };
        password && (attr[':password'] = password);
        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: password ? 'username = :username AND password = :password' : 'username = :username',
                    ExpressionAttributeValues: attr,
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data && data.Items && data.Items[0] ? (data.Items[0] as User) : null);
                }
            );
        });
    },

    // 新增用户
    async add(user: User): Promise<User> {
        const { username, password, email, nikeName } = user;
        if (!username || !password) {
            throw new Error('username or password is empty!');
        }

        const isUsernameExist = await this.getByUsernameAndPassword(username);
        if (isUsernameExist) {
            throw new Error(`username ${username} is already exist!`);
        }

        let Item = {
            id: Date.now(),
            username,
            password,
            email: email ? email : '',
            nikeName: nikeName ? nikeName : '',
            createTime: getCurrentDateStr(),
            updateTime: '',
        };
        return new Promise((resolve, reject) => {
            db.put({ TableName, Item }, (error: any, data: any) => {
                error ? reject(error) : resolve(Item);
            });
        });
    },
};
