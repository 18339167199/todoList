import { Method } from '../utils/method';
import { GroupService as G } from '../service/group';
import { TodoService as T } from '../service/todo';

const { GET, POST, PUT, DELETE } = Method;

export const Controller = {
    '': {
        // 新增分组
        [POST]: async function (event: any, data: any) {
            try {
                const user = event.auth;
                const userId = user.id;
                // @ts-ignore
                return await G.add({
                    gname: data.gname,
                    descr: data.descr,
                    userId,
                });
            } catch (error) {
                throw error;
            }
        },
        // 获取用户全部分组
        [GET]: async function (event: any, data: any) {
            try {
                const groupId = data?.groupId;
                const userId = event.auth.id;
                const method = groupId ? G.getById : G.getByUserId;
                const params = groupId ? Number(groupId) : userId;
                return await method(params);
            } catch (error) {
                throw error;
            }
        },
        // 删除分组
        [DELETE]: async function (event: any, data: any) {
            try {
                const id = data.id;
                const todos = await T.getByGroupId(id);
                await Promise.all(todos.map(todo => T.del(todo.id)));
                return await G.del(id);
            } catch (error) {
                throw error;
            }
        },
        // 更新分组
        [PUT]: async function (event: any, data: any) {
            try {
                return await G.update(data);
            } catch (error) {
                throw error;
            }
        },
    },
};
