var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
        profileFields:['id','email','displayName']
	}, function(accessToken, refreshToken, profile, done) {
		console.log('passport facebook function has been called');
		console.dir(profile);
		/*
		var options = {
		    criteria: { 'facebook.emails': profile.emails }
		};
		*/
		var database = app.get('database');
	    database.UserModel.findOne({'email ': profile.emails}, function (err, user) {
			if (err) return done(err);
      
			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
					email: profile.emails[0].value,
					provider: 'facebook',
					authToken: accessToken,
					facebook: profile._json
				});
        
				user.save(function (err) {
					if (err) console.log(err);
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
	    });
	});
};
