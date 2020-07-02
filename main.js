//basic express module import
var express = require('express');
var http = require('http');
var path = require('path');
//express midleware module import
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');
//errorhandler midleware import
var expressErrorHandler = require('express-error-handler');
//session midleware import
var expressSession = require('express-session');
//crypto module import
var crypto = require('crypto');
// declear express object as app
var app = express();
var user = require('./user');
var config = require('./config');
var route_loader = require('./route');
var database_loader = require('./database');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
console.log('view module has been setted');
//set port env, or 3000
app.set('port', process.env.PORT || config.server_port); 
//set body-parser as middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
// path set using path function(var path) public for html, uploads for file io
app.use('/public', static(path.join(__dirname, 'public')));
//set cookieparser as middleware
app.use(cookieParser());
//set expressSession as middleware, it contained information from session object
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var database;
var UserSchema;
var UserModel;
// make object about use database schema and model
function createUserSchema(database){
    database.UserSchema = require('./user_schema').createSchema(mongoose);
    user.init(database, UserSchema, UserModel);
    database.UserModel = mongoose.model("user10",database.UserSchema);
    console.log('usermodel has been defined as user10')
}

var LocalStrategy = require('passport-local').Strategy;
passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, donw){
    console.log('passport local-login function has been called : ' + email + ',' + password);
    
    var database = app.get('database');
    database.UserModel.findOne({'email' : email}, function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            console.log('account is not correct');
            return done(null, flase, req.flash('loginMessage', 'there is no registed account'));
        }
        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(!authenticated){
            console.log('password is not correct');
            return done(null, false, req.flash('loginMessage', 'you password is not correct'));
        }
        
        console.log('account and password has been correct');
        return done(null, user);
    });
}));


passport.use('local-singup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, donw){
    var paramName = req.body.name || req.query.name;
    console.log('local signup function has been called : ' + email + ',' + password + ',' + paramName);
    
    process.nextTick(function(){
        
        var database = app.get('database');
        database.UserModel.findOne({'email' : email}, function(err,user){
            if(err){
                return done(err);
            }
            if(user){
                console.log('you already have account');
                return done(null,false, req.flash('singupMessage', 'you alread have account'));
            }else{
                var user =new database.UserModel({'email' : email, 'password' : password, 'name' : paramName});
                user.save(function(err){
                    if(err){
                        throw(err);
                    }
                    
                    console.log('user data has been added');
                    return done(null, user);
                });
            }
        });
    });
}));

passport.serializeUser(function(user, done){
    console.log('serializeUser function has been called');
    console.dir(user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    
    console.log('deserializeUser function has been called');
    console.dir(user);
    done(null, user);
})

//router module depend on route.js
var router = express.Router();
route_loader.init(app, express.Router());

router.route('/').get(function(req,res){
    console.log('/ path has been called');
    res.render('index.ejs');
});

router.route('/profile').get(function(req,res){
    console.log('/profile path has been called');
    console.log('re.user object value : ' + req.user);
    
    if(!req,user){
        consle.log('none authenticated user');
        res.redirect('/');
        return;
    }
    
    console.log('authenticated user');
    if(Array.isArray(req.user)){
        res.render('profile.ejs', {user : req.user[0]._doc});
    }else{
        res.render('profile.ejs',{user:req.user});
    }
});

app.get('/login', function(req,res){
    console.log('/login path has been called');
    res.render('login.ejs',{message : req.flash('loginMessage')});
});

app.post('./login', passport.authenticate('local-login',{
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/signup', function(req,res){
    console.log('/signup path has been called');
    res.render('signup.ejs',{message : req.flash('signupMessage')});
});

app.post('./signup', passport.authenticate('local-signup',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

app.get('/logout', function(req,res){
    console.log('/logout path has been called');
    req.logout();
    res.redirect('/');
});

// error handling function, module importing, use it as middleware when httperror 404 happened, outprint 404.html
var errorHandler = expressErrorHandler({
    static:
    {
        '404': './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//signal handler => close express server when process terminated
process.on('SIGTERM', function () {
    console.log("process has been terminated, your express module turn off");
    app.close();// -> this make app.on('close') gonna be down relatively
});
//express handler => close express module dependable app module when app got signal(close)
app.on('close', function () {
	console.log("express app module has been turned off. disconnect you database now");
	if (database) {
		database.close();
	}
});

// server function, ues app struct 'port' num(if would be contain env port or 3000)
http.createServer(app).listen(app.get('port'), function(){
   console.log('express web server port : '+ app.get('port'));
    
    database_loader.init(app,config);
});