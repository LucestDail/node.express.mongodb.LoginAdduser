//passport-local module import as middleware
var LocalStrategy = require('passport-local').Strategy;

//almost same as local_login.js
module.exports = new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done) {
        var paramName = req.body.name || req.query.name;
    console.log('local signup function has been called : ' + email + ',' + password + ',' + paramName);
	    process.nextTick(function() {
	    	var database = req.app.get('database');
		    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
		        if (err) {
		            return done(err);
		        }
            if(user){
                console.log('you already have account');
                return done(null,false, req.flash('signupMessage', 'you alread have account'));
            }else{
                var user = new database.UserModel({'email' : email, 'password' : password, 'name' : paramName});
                user.save(function(err){//save user data to database
                    if(err){
                        throw(err);
                    }
                    console.log('user data has been added');
                    return done(null, user);
                });
            }
        });
    });
});