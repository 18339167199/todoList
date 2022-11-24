import { Method } from './method.js';

export const Request = {
    getRequestURL(event: any) {
        return event.requestContext.http.path;
    },

    getRequestMethod(event: any) {
        return event.requestContext.http.method;
    },

    getRequestHeaders(event: any, key: string) {
        const { headers } = event;
        if (!key) {
            return headers;
        } else {
            return headers[key];
        }
    },

    getRequestData(event: any) {
        const method = this.getRequestMethod(event);
        const data = method === Method.GET ? event.queryStringParameters : event.body;
        return data;
    },
};
