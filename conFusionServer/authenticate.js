var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  //passport-local exports a local strategy for authentications
var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
//if not using passport-local-mongoose, then u need to define a authentication function as a parameter
// passpport-local-mongoose plugs in authenticate function in the User Schema

//takes care of support for sessions in passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



