var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session); //takes session as a parameter
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

//Importing defined routes and corresponding actions
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

//Declaring essentials for connecting to the mongodb server using mongoose
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = config.mongoURL;
const connect = mongoose.connect(url);

//Establishing connection to the server
connect.then((db)=>{
  console.log('Connected correctly to server')
}, (err) => {
  console.log(err); 
});

var app = express();

app.all('*',(req,res,next)=>{  //for all the incoming requests no matter what the path is(*)
  if(req.secure){
    return next();
  }
  else{
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url); //if there is a request on http server, redirecting them to secure https server
  }
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Morgan and cookieparser middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); //in order to use signed cookies, secret key is set

//Using Session instead of cookies //This session gets added to req
// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());
//passport session midlleware loads the username and password directly into the req 

//moved up as the incoming user can access index and users endpoint without being authenticated and no other endpoint
app.use('/', indexRouter);
app.use('/users', usersRouter);

// declaring basic authentication middleware here so that user can be authorized before carrying out further
// middleware functionalities

// AUth function while using Passport
// function auth (req, res, next) {
//   // console.log(req.session);
//   if(!req.user) {
//       var err = new Error('You are not authenticated!');
//       err.status = 403;
//       return next(err);
//   }
//   else {
//     next();
//   }
// }

// function auth (req, res, next) {
//   console.log(req.session);
//   if(!req.session.user) {
//       var err = new Error('You are not authenticated!');
//       err.status = 403;
//       return next(err);
//   }
//   else {
//     if (req.session.user === 'authenticated') {
//       next();
//     }
//     else {
//       var err = new Error('You are not authenticated!');
//       err.status = 403;
//       return next(err);
//     }
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public'))); //helps to serve static data from public folder


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

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
