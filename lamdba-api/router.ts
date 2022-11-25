'use strict';

import { Code, ApiResponse } from './utils/utils';
import { Request as R } from './utils/request';
import { decode } from './utils/jwt';
import type { ResponseCallback } from './interface';

export class Router {
    controllerMap: { [propName: string]: string };
    whiteList: string[];

    constructor(controllerMap: { [propName: string]: string }, whiteList: string[]) {
        this.controllerMap = controllerMap;
        this.whiteList = whiteList;
    }

    handlerRequest(event: any, response: ResponseCallback) {

        const url = R.getRequestURL(event), method = R.getRequestMethod(event);

        // 请求预处理，解析 body 请求体数据，token 信心解码，拦截所有的 OPTIONS 预请求等...
        const shouldContinue = this.preHandlerRequest(event, response, url, method);
        if (!shouldContinue) {
            return;
        }

        // 解析请求路径，请求方法，映射到具体的 controller 中执行对应的方法
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
                    // const respData = {
                    //     statusCode: 200,
                    //     headers: {
                    //         'Access-Control-Allow-Headers' : 'Content-Type',
                    //         'Access-Control-Allow-Origin': 'http://lmb-todo.s3-website-ap-southeast-1.amazonaws.com/',
                    //         'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE,PUT'
                    //     },
                    //     body: JSON.stringify(ApiResponse.c(Code.SUCCESS, 'ok!', resp))
                    // }
                    response(null, ApiResponse.c(Code.SUCCESS, 'ok!', resp));
                },
                (error: any) => {
                    response(null, ApiResponse.c(Code.FAILED, error.message, error));
                }
            );
        } else {
            response(
                null,
                ApiResponse.c(Code.NOT_FOUND, 'Request Function Not Found!', {
                    url,
                    method,
                    controllerBaseURI,
                    controllerFilePath,
                })
            );
        }
    }

    preHandlerRequest(event: any, response: ResponseCallback, url: string, method: string) {
        // 解析 body 请求体
        if (event && event.body) {
            try {
                event.body = JSON.parse(event.body);
            } catch (error) {}
        }

        // token 信息解码
        if (!this.whiteList.includes(url)) {
            const auth: string | undefined = R.getRequestHeaders(event, 'authorization');
            const token = auth ? (auth.split(' ').length === 2 ? auth.split(' ')[1] : undefined) : undefined;
            if (token) {
                event['auth'] = decode(token);
            }
        }

        return true;
    }
}
