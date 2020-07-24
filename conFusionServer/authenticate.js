var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  //passport-local exports a local strategy for authentications
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
//if not using passport-local-mongoose, then u need to define a authentication function as a parameter
// passpport-local-mongoose plugs in authenticate function in the User Schema

//takes care of support for sessions in passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,{expiresIn:3600});
};

var opts = {}; //options for jwt based strategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extracting jwt from incoming request
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log("JWT Payload: ",jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));


exports.verifyUser = passport.authenticate('jwt',{session:false}) //this will extract the token from auth header and verify the user

exports.verifyAdmin = function(req,res,next){
    if(req.user.admin)
    {
        next();
    }
    else{
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
};