var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password:  {
    //     type: String,
    //     required: true
    // },// USERNAME and PASSPORT are added by PassportLocal Mongoose itself
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); // u need to plug in passport local mongoose into ur Schema

module.exports = mongoose.model('User', User);