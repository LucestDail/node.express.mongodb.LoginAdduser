//import local middleware
var local_login = require('./local_login');
var local_signup = require('./local_signup');
var facebook = require('./facebook');

//get app, passport object from main code
module.exports = function(app, passport){
    console.log('passport function has been called');
    
    passport.serializeUser(function(user, done){
        console.log('serializeUser function has been called');
        console.dir(user);
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        console.log('deserializeUser function has been called');
        console.dir(user);
        done(null, user);
    });
    passport.use('local-login',local_login);
    passport.use('local-signup',local_signup);
	passport.use('facebook', facebook(app, passport));
};



