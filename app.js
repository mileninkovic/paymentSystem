var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "paymentsystem"
});
dbCon.connect(function(err) {
  if (err) throw err;
  console.log("Connected!")
});
var sqlQuery = null;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.post('/registerData', (req, res) =>{
  let username = req.body.user;
  let password = req.body.password;
  //Add mySQL database
  if (username && password) {
    sqlQuery = `INSERT INTO userstbl (username, password) VALUES ('${username}', '${password}')`;
    dbCon.query(sqlQuery, function (err, result){
      if (err) throw err;
      console.log("Query completed successfully!")
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(500);
  }
});

app.post('/loginData', (req, res) =>{
  let username = req.body.user;
  let password = req.body.password;
  //Add mySQL database
  if (username && password) {
    sqlQuery = `SELECT * FROM userstbl WHERE username = '${username}' AND password = '${password}'`;
    dbCon.query(sqlQuery, function (err, result){
      if (err) throw err;
      console.log("Query completed successfully!")
      console.log(result.length);
      if (!result.length) {
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
      }
    });
  }
});

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
