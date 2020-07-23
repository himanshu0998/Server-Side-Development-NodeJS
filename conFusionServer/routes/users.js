var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Using passport-local-mongoose(plm)
router.post('/signup',function(req, res, next){
  //register is the function provided by plm plugin which takes parameters as shown
  User.register(new User({username: req.body.username}), 
    req.body.password , (err,user) => {
    if(err)
    {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else
    {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err,user)=>{
        if(err)
        {
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login',passport.authenticate('local'),(req, res, next) => {

  var token =  authenticate.getToken({_id:req.user._id}); //only user id is enough as a payload to generate jwt
  //in case of jwt, once the user is authenticated using local strategy, a jwt token is issued and the sessions are not created
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true,token: token,status:'You are successfully logged In!'});
});

// router.post('/signup',function(req, res, next){
//   User.findOne({username: req.body.username})
//   .then((user) => {
//     if(user!=null)
//     {
//       var err = new Error('User '+req.body.username+' already exists!');
//       err.status = 403; //forbidden as user already exists
//       next(err);
//     }
//     else
//     {
//       return User.create({
//         username: req.body.username,
//         password: req.body.password
//       });
//     }
//   })
//   .then((user)=>{  // to handle promise returned by return statement above
//     res.statusCode = 200;
//     res.setHeader('Content-Type','application/json');
//     res.json({status:'Registration Successful!', user: user});
//   },(err)=>{
//     next(err);
//   })
//   .catch((err) => {
//     next(err);
//   })
// });


// router.post('/login', (req, res, next) => {
//   if(!req.session.user)
//   {
//     var authHeader = req.headers.authorization;
//     if(!authHeader)
//     {
//       var err = new Error('You are not authenticated!');
//       //challenging the client
//       res.setHeader('WWW-Authenticate','Basic');
//       err.status = 401;
//       return next(err);
//     }

//     var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':'); //auth Header = BASIC base64_encoded_string
//     var username = auth[0];
//     var password = auth[1];

//     User.findOne({username: username})
//     .then((user)=>{
//       if (user === null) {
//         var err = new Error('User ' + username + ' does not exist!');
//         err.status = 403;
//         return next(err);
//       }
//       else if(user.password !== password)
//       {
//         var err = new Error('Your Password is incorrect!');
//         err.status = 403;
//         return next(err);
//       }
//       else if(user.username === username && user.password === password)
//       {
//         req.session.user = 'authenticated'; //setting up userproperty on session
//         res.statusCode = 200;
//         res.setHeader('Content-Type','text/plain');
//         res.end('You are authenticared');
//       }
//     })
//     .catch((err)=>{
//       next(err);
//     })
//   }
//   else
//   {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('You are already authenticated!');
//   }
// });

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
