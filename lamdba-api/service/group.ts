import { db } from '../utils/db';
import { getCurrentDateStr } from '../utils/utils';
import type { Group } from '../interface';
const TableName = 'lmb-todo-groups';
const TodoTableName = 'lmb-todo-todos';

export const GroupService = {
    // 按 id 查询分组
    getById(id: number): Promise<Group | null> {
        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: 'id = :id',
                    ExpressionAttributeValues: { ':id': id },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data && data.Items && data.Items.length > 0 ? (data.Items[0] as Group) : null);
                }
            );
        });
    },

    // 根据 userId 获取全部分组
    getByUserId(userId: number): Promise<Group[] | null> {
        if (!userId) {
            return Promise.reject(new Error('userId is empty!'));
        }

        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: 'userId = :userId',
                    ExpressionAttributeValues: { ':userId': userId },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data.Items as Group[]);
                }
            );
        });
    },

    // 新增分组
    add({ userId, gname, descr }: { userId: number; gname: string; descr?: string }): Promise<Group> {
        if (!gname || !userId) {
            Promise.reject(new Error('gname is empty!'));
        }

        let Item = {
            id: Date.now(),
            userId,
            todoCount: 0,
            gname,
            descr: descr || '',
            createTime: getCurrentDateStr(),
            updateTime: '',
        };
        return new Promise((resolve, reject) => {
            db.put(
                {
                    TableName,
                    Item,
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(Item);
                }
            );
        });
    },

    // 按 id 删除分组
    del(id: number): Promise<any> {
        if (!id) {
            return Promise.reject(new Error('id is empty!'));
        }

        const ids = typeof id === 'number' ? [id] : id;
        return new Promise((resolve, reject) => {
            db.delete(
                {
                    TableName,
                    ConditionExpression: 'id = :id',
                    ExpressionAttributeValues: { ':id': id },
                    Key: { id: id },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data);
                }
            );
        });
    },

    // 更新分组
    update(group: Group): Promise<{ [propName: string]: any }> {
        const { id } = group;
        if (!id) {
            return Promise.reject(new Error('id is empty!'));
        }

        group.updateTime = getCurrentDateStr();

        const updateExpression =
            'set ' +
            Object.keys(group)
                .filter((key) => key !== 'id')
                .map((key) => `${key} = :${key}`)
                .join(', ');
        const expressionAttributeValues = {};

        Object.keys(group)
            .filter((key) => key !== 'id')
            .forEach((key) => {
                // @ts-ignore
                expressionAttributeValues[`:${key}`] = group[key];
            });

        return new Promise((resolve, reject) => {
            db.update(
                {
                    TableName,
                    Key: { id },
                    UpdateExpression: updateExpression,
                    ExpressionAttributeValues: expressionAttributeValues,
                    ReturnValues: 'UPDATED_NEW',
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data);
                }
            );
        });
    },

    // 分组 todoCount 自增或自减
    todoChange(type: 'a' | 'm', id: number): Promise<boolean> {
        if (!type || !id) {
            return Promise.reject(new Error('type or id is empty!'));
        }

        id = Number(id);
        return new Promise((resolve, reject) => {
            db.update(
                {
                    TableName,
                    Key: { id },
                    UpdateExpression: 'set todoCount = todoCount + :num',
                    ExpressionAttributeValues: {
                        ':num': type === 'a' ? 1 : -1,
                    },
                    ReturnValues: 'UPDATED_NEW',
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(true);
                }
            );
        });
    },
};
