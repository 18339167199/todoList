const code = {

    SUCCESS: 0, // 成功

    FAILED: 400, // 失败

    FORBID: 403, // 禁止访问

    NOT_FOUND: 404, // 资源未找到

    // 客户端错误
    C_UNKOWN_ERROR: 1000,

    C_NOT_LOGIN_ERROR: 1001, // 用户未登录

    C_PARAMETER_ERROR: 1002,

    // 服务端错误
    S_UNKOWN_ERROR: 10001 // 服务端未知错误

}

module.exports = code
