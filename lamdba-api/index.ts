'use strict';

import type { ResponseCallback } from './interface';
import { Router } from './router';

export const handler = function (event: any, context: any, callback: ResponseCallback) {
    const route = new Router(
        {
            '/api/user': './controller/user.js',
            '/api/group': './controller/group.js',
            '/api/todo': './controller/todo.js',
        },
        ['/api/user/register', '/api/user/login']
    );

    route.handlerRequest(event, callback);
};
