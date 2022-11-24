'use strict';

import jwt from 'jsonwebtoken';

interface User {
    id: number,
    username: string,
    password: string,
    email: string,
    nikeName: string,
    updateTime: string,
    createTime: string,
};

export const handler = async(event: any, context: any, callback: (error: Error | null, data: any | null) => void) => {
    const SECRET_KEY = process.env['SECRET_KEY'];
    let authArr: string[] = [];
    let token = '';
    const response = {
        'isAuthorized': false,
        'context': {
            'stringKey': 'value',
            'numberKey': 1,
            'booleanKey': true,
            'arrayKey': ['value1', 'value2'],
            'mapKey': {'value1': 'value2'}
        }
    };
    
    if (event.headers.authorization) {
        const authorization: string = event.headers.authorization;
        authArr = authorization.split(' ');
        token = authArr.length === 2 ? authArr[1] : '';
    }

    if (!token || !SECRET_KEY) {
        return response; 
    }

    tokenVerify(token, SECRET_KEY).then(
        async (authData: any) => {
            response['isAuthorized'] = true
            callback(null, response);
        },
        (error: Error) => {
            callback(null, response);
        }
    )
};

// token验证
export const tokenVerify = (token: string, secretKey: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, function(error, data) {
            error ? reject(error) : resolve(data);
        })
    });
};
