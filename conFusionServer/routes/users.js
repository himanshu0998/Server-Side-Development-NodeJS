var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req, res, next){
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user!=null)
    {
      var err = new Error('User '+req.body.username+' already exists!');
      err.status = 403; //forbidden as user already exists
      next(err);
    }
    else
    {
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user)=>{  // to handle promise returned by return statement above
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status:'Registration Successful!', user: user});
  },(err)=>{
    next(err);
  })
  .catch((err) => {
    next(err);
  })
});


router.post('/login', (req, res, next) => {
  if(!req.session.user)
  {
    var authHeader = req.headers.authorization;
    if(!authHeader)
    {
      var err = new Error('You are not authenticated!');
      //challenging the client
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':'); //auth Header = BASIC base64_encoded_string
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then((user)=>{
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      else if(user.password !== password)
      {
        var err = new Error('Your Password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password)
      {
        req.session.user = 'authenticated'; //setting up userproperty on session
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You are authenticared');
      }
    })
    .catch((err)=>{
      next(err);
    })
  }
  else
  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});

//get request for logging out as you are not sending anything to the server as the server is already tracking the user
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/'); //redirecting the user to home page
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
