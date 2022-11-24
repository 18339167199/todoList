import { Method } from '../utils/method';
import { GroupService as G } from '../service/group';
import { TodoService as T } from '../service/todo';
import type { Todo } from '../interface';

const { GET, POST, PUT, DELETE } = Method;

export const Controller = {
    '': {
        // 按 id 查找待办
        [GET]: async function (event: any, data: any) {
            try {
                return await T.getById(data.id);
            } catch (error) {
                throw error;
            }
        },
        // 创建待办
        [POST]: async function (event: any, data: any) {
            try {
                if (!data.groupId || !data.content) {
                    throw new Error('groupId or content is empty!');
                }
                await G.todoChange('a', data.groupId);
                return await T.add(data);
            } catch (error) {
                throw error;
            }
        },
        // 更新待办
        [PUT]: async function (event: any, data: any) {
            try {
                return T.update(data);
            } catch (error) {
                throw error;
            }
        },
        // 删除待办
        [DELETE]: async function (event: any, data: any) {
            try {
                const todo = await T.getById(data.id);
                await G.todoChange('m', (todo as Todo).groupId);
                return await T.del(data.id);
            } catch (error) {
                throw error;
            }
        },
    },

    // 按 groupId 查询所有的待办
    '/groupId': {
        [GET]: async function (event: any, data: any) {
            try {
                return T.getByGroupId(data.groupId);
            } catch (error) {
                throw error;
            }
        },
    },

    // 移动带待办到其他的分组
    '/move': {
        [POST]: async function (event: any, data: any) {
            try {
                const todo = await T.getById(data.todoId);
                await G.todoChange('m', (todo as Todo).groupId);
                await G.todoChange('a', data.groupId);
                // @ts-ignore
                return T.update({
                    id: data.todoId,
                    groupId: data.groupId,
                });
            } catch (error) {
                throw error;
            }
        },
    },

    // 模糊搜索
    '/search': {
        [GET]: async function (event: any, data: any) {
            try {
                return T.search(data.keyword);
            } catch (error) {
                throw error;
            }
        },
    },
};
