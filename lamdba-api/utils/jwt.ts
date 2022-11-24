import jwt from 'jsonwebtoken';

const secretKey = 'tokenKey No1 φ(*￣0￣)';

// 创建 token
export const createToken = (data: any) => {
    return jwt.sign(data, secretKey, {
        expiresIn: `${30}h`,
    });
};

// 解码 token
export const decode = (token: string) => {
    try {
        const data: any = jwt.decode(token);
        return data;
    } catch (error: any) {
        return null;
    }
};
