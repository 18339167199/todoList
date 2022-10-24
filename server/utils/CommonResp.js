class CommonResp {

    constructor({ code, data, msg }) {
        this.code = code
        this.data = data || null
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

}

module.exports = CommonResp
