'use strict';

export class ApiResponse {
    code: number;
    data: any;
    msg: string;

    constructor({ code, data, msg }: { code: number; data: any; msg: string }) {
        this.code = code;
        this.data = data != null && data != undefined ? data : null;
        this.msg = msg || '';
    }
    setCode(code: number) {
        this.code = code;
    }
    getCode() {
        return this.code;
    }
    setMsg(msg: string) {
        this.msg = msg;
    }
    getMsg() {
        return this.msg;
    }
    setData(data: any) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    static c(code: number, msg: string, data?: any) {
        return new ApiResponse({ code, msg, data });
    }
}

export const Code = {
    SUCCESS: 0, // 成功
    FAILED: 400, // 失败
    FORBID: 403, // 禁止访问
    NOT_FOUND: 404, // 资源未找到
    C_UNKOWN_ERROR: 1000, // 服务端未知错误
    C_NOT_LOGIN_ERROR: 1001, // 用户未登录
    C_PARAMETER_ERROR: 1002, // 参数错误
    S_UNKOWN_ERROR: 10001, // 服务端未知错误
};

export const getCurrentDateStr = () => {
    const date = new Date();
    return date.toLocaleString().replaceAll('/', '-');
};

export const isObject = (value: any) => Object.prototype.toString.call(value) === '[object Object]';

export const isArray = (value: any) => Object.prototype.toString.call(value) === '[object Array]';
