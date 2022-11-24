import { Todo } from '../interface/index';
import { db } from '../utils/db';
import { getCurrentDateStr } from '../utils/utils';
const TableName = 'lmb-todo-todos';

export const TodoService = {
    // 按 id 查询待办
    getById(id: number): Promise<Todo | null> {
        id = Number(id);
        if (!id) {
            return Promise.reject(new Error('id is empty!'));
        }

        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: 'id = :id',
                    ExpressionAttributeValues: { ':id': id },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data && data.Items && data.Items.length > 0 ? (data.Items[0] as Todo) : null);
                }
            );
        });
    },

    // 按 groupId 查找待办
    getByGroupId(id: number): Promise<Todo[]> {
        id = Number(id);
        if (!id) {
            return Promise.reject(new Error('id is empty!'));
        }

        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: 'groupId = :id',
                    ExpressionAttributeValues: { ':id': id },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data.Items as Todo[]);
                }
            );
        });
    },

    // 新增待办
    add({ groupId, content, note, scheduledTime, done, star }: { groupId: number, content: string, note?: string, scheduledTime?: string, done?: 0 | 1, star?: 0 | 1 }): Promise<Todo> {
        if (!content || !groupId) {
            return Promise.reject(new Error('content or groupId is empty!'));
        }

        const Item = {
            id: Date.now(),
            groupId,
            done: done|| 0,
            star: star || 0,
            content,
            note: note || '',
            createTime: getCurrentDateStr(),
            updateTime: '',
            scheduledTime: scheduledTime || '',
        };
        return new Promise((resolve, reject) => {
            db.put({ TableName, Item }, (error: any, data: any) => {
                error ? reject(error) : resolve(Item as Todo);
            });
        });
    },

    // 更新待办
    update(todo: Todo): Promise<{ [propName: string]: any }> {
        const { id } = todo;
        if (!id) {
            return Promise.reject(new Error('id is empty!'));
        }

        todo.id = Number(todo.id);
        todo.updateTime = getCurrentDateStr();

        const updateExpression =
            'set ' +
            Object.keys(todo)
                .filter((key) => key !== 'id')
                .map((key) => `${key} = :${key}`)
                .join(', ');
        const expressionAttributeValues = {};

        Object.keys(todo)
            .filter((key) => key !== 'id')
            .forEach((key) => {
                // @ts-ignore
                expressionAttributeValues[`:${key}`] = todo[key];
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

    // 删除待办
    del(id: number): Promise<boolean> {
        if (!id) {
            return Promise.reject(new Error('groupId or id is empty!'));
        }

        return new Promise((resolve, reject) => {
            db.delete(
                {
                    TableName,
                    ConditionExpression: 'id = :id',
                    ExpressionAttributeValues: { ':id': id },
                    Key: { id: id },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(true);
                }
            );
        });
    },

    // 根据 keyword 模糊搜索
    search(keyword: string) {
        return new Promise((resolve, reject) => {
            db.scan(
                {
                    TableName,
                    FilterExpression: `contains(content, :keyword)`,
                    ExpressionAttributeValues: { ':keyword': keyword },
                },
                (error: any, data: any) => {
                    error ? reject(error) : resolve(data.Items);
                }
            );
        });
    },
};
