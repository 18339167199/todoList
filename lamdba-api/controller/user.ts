import { User } from '../interface';
import { UserService as U } from '../service/user';
import { GroupService as G } from '../service/group';
import { TodoService as T } from '../service/todo';
import { Method } from '../utils/method';
import { createToken } from '../utils/jwt';

const { GET, POST, PUT, DELETE } = Method;

export const Controller = {
    // 获取用户信息
    '': {
        [GET]: async function (event: any, data: any) {
            try {
                const auth = event.auth;
                const userId = auth.id;
                const user = await U.getById(userId);
                return {
                    username: (user as User).username,
                    nikeName: (user as User).nikeName,
                    email: (user as User).email,
                    createTime: (user as User).createTime,
                    updateTime: (user as User).updateTime,
                };
            } catch (error) {
                throw error;
            }
        },
    },

    // 注册
    '/register': {
        [POST]: async function (event: any, data: any) {
            try {
                const user = await U.add(data);
                const userId = user.id;

                const group1 = await G.add({ userId, gname: '我的一天', descr: '每日计划' });
                await G.add({ userId, gname: '重要', descr: '重要的事情' });
                await G.add({ userId, gname: '今天吃什么', descr: '' });
                await G.add({ userId, gname: '娱乐活动安排', descr: '放松身心，适当运动~' });

                await T.add({ groupId: group1.id, content: '我的待办，今天的任务已完成！', done: 1 });
                await T.add({ groupId: group1.id, content: '待办已完成，继续完成下一个待办！', star: 1 });
                
                return user;
            } catch (error) {
                throw error;
            }
        },
    },

    // 登录
    '/login': {
        [POST]: async function (event: any, data: any) {
            try {
                const { username, password } = data;
                if (!username || !password) {
                    throw new Error('username or password is empty!');
                }

                const user = await U.getByUsernameAndPassword(username, password);
                if (user) {
                    // 登录成功
                    return {
                        userInfo: {
                            username: (user as User).username,
                            nikeName: (user as User).nikeName,
                            email: (user as User).email,
                            password: '',
                        },
                        auth: {
                            token: createToken({
                                id: user.id,
                                username: user.username,
                                password: user.password,
                                nikeName: user.nikeName,
                                email: user.email
                            }),
                            expired: Date.now() + 30 * 24 * 60 * 60 * 1000,
                        },
                    };
                }

                throw new Error('username or password error, check and try again!');
            } catch (error) {
                throw error;
            }
        },
    },
};
