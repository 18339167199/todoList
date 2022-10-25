const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const config = require('./config')
const CommonResp = require('./utils/CommonResp')
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


// express Jwt 中间件
// app.use(expressjwt({
//   secret: secretKey,
//   algorithms: ['HS256'],
//   getToken: function(req) {
//     const auth = req.headers.authorization
//     const authSplitArr = auth.split(' ')
//     if (auth && authSplitArr.length === 2) {
//       return authSplitArr[1]
//     }

//     console.log('on expressjwt auth', auth)
//     return ''
//   }
// }).unless({
//   path: config.routes.whiteList
// }))

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
    res.status(401).json(new CommonResp({
      msg: 'Please log in',
      code: code.C_NOT_LOGIN_ERROR
    }))
  }
})


// 请求拦截器，token 
app.use(async function(req, res, next) {
  console.log('req.auth', req.auth)
  next()
  return

  const whiteList = config.routes.whiteList
  const requestURL = req.url
  const authorization = req.headers['authorization']

  console.log('拦截器：')

  const validation = new Promise((resolve, reject) => {

    // 白名单直接放行
    if (whiteList.includes(requestURL)) {
      resolve()
      return
    }

    // 判断 token 是否有效


  })

  validation.then(() => {
    next()
  }, err => {
    res.json(new CommonResp({
      code: code.FORBID,
      msg: err.message
    }))
  })

})


// 路由划分
app.use('/', require('./routes/index'))
app.use('/api/user', require('./routes/user'))
app.use('/api/todo', require('./routes/todo'))
app.use('/api/group', require('./routes/group'))


// catch 4r04 and forward to error handle
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
