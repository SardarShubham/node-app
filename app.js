var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(db => {console.log("!!Connected to databasee!!")}, (err=>console.log(err)))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// ******************** cookie parser ****************************************************
app.use(cookieParser('12345-67890-09876-54321'));



app.use(express.static(path.join(__dirname, 'public')));

// ********************************** authentication ****************************
const auth = (req, res, next) => {
  console.log("inside auth function");

  if (!req.signedCookies.user){
    console.log("SigCookei: ",req.signedCookies.user);
    var authheader = req.headers.authorization;
    // if auth header not present give error 
    if (!authheader){
      var err = new Error('You are not Authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    // if auth header is present
    var auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    if (auth[0] == 'admin' && auth[1] == 'madman'){
      res.cookie('user', 'admin', {signed: true});
      next();
    }
    else{
      var err = new Error('You are not Authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  }

  // else set cookie
  else{
    if (req.signedCookies.user === 'admin') next();
    else {
      var err = new Error('Your are not authenticated');
      err.status = 401;
      next(err);
    }
  }
}

app.use(auth);  // placed here so that user cant access anything below without authentication
// **********************************************************************************
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("error function inided!");
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
