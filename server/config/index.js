module.exports = {
  tokenExpiredTime: 30, // token 过期时间：30天
  routes: {
    whiteList: [
      '/',
      '/favicon.ico',
      '/api/user/error',
      '/api/user/login'
    ]
  }
}