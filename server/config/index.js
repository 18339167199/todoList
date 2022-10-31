module.exports = {
  tokenExpiredTime: 30, // token 过期时间：30天
  routes: {
    whiteList: [
      '/',
      '/favicon.ico',
      '/api/user/error',
      '/api/user/login',
      '/api/user/register'
    ]
  },
  dbConfig: {
    url: 'mongodb://127.0.0.1:27017/todo'
  }
}
