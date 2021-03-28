var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var aboutRouter = require('./routes/about');
var ourTeamRouter = require('./routes/ourteam');
var connectRouter = require('./routes/connect');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signinRouter = require('./routes/signin');
var signupRouter = require('./routes/signup');
var profileRouter = require('./routes/profile');
var singoutRouter = require('./routes/signout');
var updateprofileRouter = require('./routes/updateprofile');
var changepasswordRouter = require('./routes/changepassword');
var cookRouter = require('./routes/cook');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', () => {
  console.log('A user has connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'secret',saveUninitialized: true,resave: true}));

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.preferences = req.session.preferences;
  next();
});

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/connect', connectRouter);
app.use('/ourteam', ourTeamRouter);
app.use('/users', usersRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/signout', singoutRouter);
app.use('/updateprofile', updateprofileRouter);
app.use('/changepassword', changepasswordRouter);

app.use('/cook', cookRouter);

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