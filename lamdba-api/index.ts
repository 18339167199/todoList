'use strict';

import { Router } from './router';

export const handler = function (event: any, context: any, callback: (error: Error | null, data: any) => void) {
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
