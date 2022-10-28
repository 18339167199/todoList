/**
 * 定义通用的数据返回
 */
class ApiResponse {

    constructor({ code, data, msg }) {
        this.code = code
        this.data = (data != null && data != undefined) ? data : null
        this.msg = msg || ''
    }

    setCode(code) {
        this.code = code
    }
    getCode() {
        return this.code
    }

    setMsg(msg) {
        this.msg = msg
    }
    getMsg() {
        return this.msg
    }

    setData(data) {
        this.data = data
    }
    getData() {
        return this.data
    }

    static c(code, msg, data) {
        return new ApiResponse({ code, msg, data })
    }

}

module.exports = ApiResponse
