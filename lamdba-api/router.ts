'use strict';

import { Code, ApiResponse } from './utils/utils';
import { Request as R } from './utils/request';
import { decode } from './utils/jwt';

export class Router {
    controllerMap: { [propName: string]: string };
    whiteList: string[];

    constructor(controllerMap: { [propName: string]: string }, whiteList: string[]) {
        this.controllerMap = controllerMap;
        this.whiteList = whiteList;
    }

    handlerRequest(event: any, response: (error: Error | null, data: any) => void) {
        const c = this.preHandlerRequest(event);
        if (!c) {
            response(null, ApiResponse.c(Code.FORBID, 'not auth!'));
            return;
        }

        const url = R.getRequestURL(event),
            method = R.getRequestMethod(event);
        let controllerFilePath, controllerBaseURI, controllerFunction;

        Object.keys(this.controllerMap).forEach((key) => {
            if (url.startsWith(key)) {
                controllerBaseURI = key;
                controllerFilePath = this.controllerMap[key];
            }
        });

        if (controllerFilePath && controllerBaseURI) {
            // @ts-ignore
            const { Controller } = require(controllerFilePath);
            if (Controller) {
                const route = url.substring((controllerBaseURI as string).length);
                const functionMap = Controller[route];
                controllerFunction = functionMap ? functionMap[method] : null;
            } else {
                response(new Error('Controller Not Defined!'), null);
                return false;
            }
        }

        if (controllerFunction) {
            const data = R.getRequestData(event);
            controllerFunction(event, data).then(
                (resp: any) => {
                    response(null, ApiResponse.c(Code.SUCCESS, 'ok!', resp));
                },
                (error: any) => {
                    response(null, ApiResponse.c(Code.FAILED, error.message, error));
                }
            );
        } else {
            response(
                new Error(`
                    url: ${url}
                    method: ${method}
                    controllerFilePath: ${controllerFilePath}
                    controllerBaseURI: ${controllerBaseURI}
                `),
                ApiResponse.c(Code.NOT_FOUND, 'Request Function Not Found!')
            );
        }
    }

    preHandlerRequest(event: any) {
        if (event && event.body) {
            try {
                event.body = JSON.parse(event.body);
            } catch (error) {}
        }

        // token 信息解码
        const url = R.getRequestURL(event);
        if (!this.whiteList.includes(url)) {
            const auth: string = R.getRequestHeaders(event, 'authorization');
            if (auth) {
                const token = auth.split(' ').length === 2 ? auth.split(' ')[1] : undefined;
                if (token) {
                    event['auth'] = decode(token);
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
