const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');
const groupsRouter = require('./routes/groups');

const app = express();


// view engine setup
// 视图文件存放的目录
app.set('views', path.join(__dirname, 'views'));
// 视图文件使用的渲染引擎
app.set('view engine', 'ejs');


app.use(logger('dev'));
// json 支持
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 解析 cookie 插件
app.use(cookieParser());
// 静态资源文件托管
app.use(express.static(path.join(__dirname, 'public')));


// 路由划分
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/groups', groupsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
