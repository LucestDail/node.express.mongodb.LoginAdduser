//passport-local module import as middleware
var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    //set field value name
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, done){ // get req with database middleware. get value email, password. return value : done
    console.log('passport local-login function has been called : ' + email + ',' + password);
    var database = req.app.get('database');
    database.UserModel.findOne({'email' : email}, function(err,user){//database.UserModel(refer from database.js) make object 'findOne' for login process
        // if error occured, return done as err
        if(err){
            return done(err);
        }
        // if id is not valid, return flash message
        if(!user){
            console.log('account is not correct');
            return done(null, false, req.flash('loginMessage', 'there is no registed account'));
        }
        //if password is not correct, return flash message and 
        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(!authenticated){
            console.log('password is not correct');
            return done(null, false, req.flash('loginMessage', 'you password is not correct'));
        }
        console.log('account and password has been correct');
        return done(null, user);
    });
});