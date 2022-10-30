const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const config = require('./config')
const ApiResponse = require('./utils/ApiResponse')
const code = require('./utils/code')
const { expressjwt } = require('express-jwt')
const { secretKey } = require('./utils/jwt')

const app = express()


// view engine setup
// 视图文件存放的目录
app.set('views', path.join(__dirname, 'views'))
// 视图文件使用的渲染引擎
app.set('view engine', 'ejs')


app.use(logger('dev'))
// json 支持
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 解析 cookie 插件
app.use(cookieParser())
// 静态资源文件托管
app.use(express.static(path.join(__dirname, 'public')))
// session
app.use(session({
  secret: 'keyboard cat',
  resave: false, //强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false
  saveUninitialized: true,
  cookie: {
    maxAge:2*60*60*1000 /*过期时间*/
  },
  rolling:true //在每次请求时重新设置 cookie，用于重置 cookie 过期时间（默认：false）
}))

// express jwt 中间件解析请求携带的 token
app.use(expressjwt({
  secret: secretKey,
  requestProperty: 'auth',
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  }
}).unless({
  path: config.routes.whiteList
}))

// 登录 token 解析失败
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(new ApiResponse({
      msg: 'Please log in',
      code: code.C_NOT_LOGIN_ERROR
    }))
  }
})


// 路由划分
app.use('/', require('./controller/index'))
app.use('/api/user', require('./controller/user'))
app.use('/api/todo', require('./controller/todo'))
app.use('/api/group', require('./controller/group'))


// catch 404 and forward to error handle
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
