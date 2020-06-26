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

//mongoose midleware import
var mongoose = require('mongoose');

//crypto module import
var crypto = require('crypto');

// declear express object as app
var app = express();

//set port env, or 3000
app.set('port', process.env.PORT || 3000); 

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

//variable for data object
var database;
//variable for schema and model object
var UserSchema;
var UserModel;
// connectDB functin delclaered for connect mongodb(ip:port/directory)
function connectDB(){
    console.log('try to connect database');
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/local')
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function(){
        console.log('your database has been connected');
        createUserSchema();
        console.log('createUserSchema function been called');
    });
    database.on('dcsconnected', function(){
        console.log('your database connection has been failed retry after 5 second');
        setInterval(connectDB, 5000);
    });
}
// make object about use database schema and model
function createUserSchema(){
    //make schema
    UserSchema = mongoose.Schema({
        id:{type : String, required : true, unique : true, 'default' : ''},
        hashed_password : {type : String, required : true, 'default' : ''},
        salt:{type : String, required : true},
        name:{type : String, index : 'hashed', 'default' : ''},
        age : {type : Number, 'default' : -1},
        created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
        updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
    });
    //virtualization for password
    UserSchema
        .virtual('password')
        .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);        
        console.log('virtual password has been called : %s, %s', this.hashed_password);
    }).get(function(){
         return this._password
    });
    console.log('UserSchema, virtual password defined');
    
    // password encrypt method
    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
        }
    });
    
    // make salt for hashing method 
    UserSchema.method('makeSalt',function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });
    
    //authorization method
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate has been called %s -> %s, %s',
                       plainText,
                       this.encryptPassword(plainText,inSalt),
                       hashed_password);
            return this.encryptPassword(plainText,inSalt) === hashed_password;
        }else{
            console.log('authenticate has been called %s -> %s, %s',
                       plainText,
                       this.encryptPassword(plainText),
                       this.hashed_password);
            return this.encryptPassword(plainText) === this.hashed_password;            
        }
    });
    /*
    //value validation function defined
    var validatePresenceOf = function(value) {
		return value && value.length;
	};
    */
	/*	
	//validation activation function
	UserSchema.pre('save', function(next) {
		if (!this.isNew) return next();

		if (!validatePresenceOf(this.password)) {
			next(new Error('not activatable password'));
		} else {
			next();
		}
	})
    */
    
    UserSchema.path('id').validate(function(id){
        return id.length;
    }, 'id column value is not exist');
    
    UserSchema.path('name').validate(function(name){
        return name.length;
    }, 'name column value is not exist');
  
    UserSchema.path('hashed_password').validate(function (hashed_password) {
        return hashed_password.length;
    }, 'hashed_password column value is not exist');
    
    UserSchema.static('findById', function(id, callback){
        return this.find({id : id}, callback);
    });
    
    UserSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });
    
    console.log('UserSchem defined complete');    
    UserModel = mongoose.model("user10",UserSchema);
    console.log('usermodel has been defined as user10')
}

// router decleared
var router = express.Router();


// when requesting process/login route, respond log and got ID/Password
router.route('/process/login').post(function(req,res){
    console.log('/process/login router has been called');
    
    var paramId = req.body.id||req.query.id;
    var paramPassword = req.body.password||req.query.password;
    console.log('requesting parameter : ' + paramId + ', ' + paramPassword);
    if(database){
        authUser(database,
                 paramId,
                 paramPassword,
                 function(err, result){
            if(err){
                callback(err,null);
                console.error(err);
                return;
            }
        console.log("function result : " + result);
        if (result){
            var username = result[0].name;
            res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
            res.write('<h1>login succesful</h1>');
            res.write('<div><p>param id: '+ paramId +'</p></div>');
            res.write('<div><p>param password: '+paramPassword+'</p></div>');
            res.write("<br><br><a href='/public/login.html'> go to login page </a>");
            res.end();
        }
        else{
            console.dir("im not here!");
            res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
            res.write('<h1>login failed</h1>');
            res.write('<div><p>param id: '+ paramId +'</p></div>');
            res.write('<div><p>param password: '+paramPassword+'</p></div>');
            res.write("<br><br><a href='/public/login.html'> go to login page </a>");
            res.end();  
        }

    });
    }else{
        res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
        res.write('<h1>database connection failed</h1>');
        res.write('<div><p>database is not online</p></div>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser has been called');
    
    var paramId = req.body.id||req.query.id;
    var paramPassword = req.body.password||req.query.password;
    var paramName = req.body.name||req.query.name;

    console.log('requesting value :' + paramId + ',' + paramPassword + ',' + paramName);
    
    if(database){
        addUser(database,
                paramId,
                paramPassword,
                paramName,
                function(err,result){
            if(err){
                callback(err,null);
                console.error(err);
                return;
            }
            if(result){
                console.dir(result);
                res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
                res.write('<h1>adding process succesful</h1>');
                res.write("<br><br><a href='/public/login.html'> go to login page </a>");
                res.end();
            }else{
                res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
                res.write('<h1>adding process failed</h1>');
                res.write("<br><br><a href='/public/login.html'> go to login page </a>");
                res.end();
            }
        })
    }else{
        res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
        res.write('<h1>database connection failed</h1>');
        res.write('<div><p>database is not online</p></div>');
        res.end();
    }    
});


router.route('/process/listuser').post(function(req,res){
    console.log('/process/listuser function has been called');
    
    if(database){
        UserModel.findAll(function(err,result){
            if(err){
                callback(err,null);
                console.error(err);
                return;
            }
            if(result){
                console.dir(result);
                res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
                res.write('<h2>user list opening</h2>');
                res.write('<div><ul>');
                for(var i = 0; i<result.length;i++){
                    var curId = result[i]._doc.id;
                    var curName = result[i]._doc.name;
                    res.write('    <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
                }
                
                res.write('</ul></div>');
                res.end();
            } else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>failed to opening user list</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>database connection failed</h1>');
        res.write('<div><p>database is not online</p></div>');
		res.end();
	}
});

// use router as middleware, that could route path given '/'
app.use('/', router);

//authorization function that depend on database 
var authUser = function(database, id, password, callback){
    console.log("authUser function has been called");
    
    UserModel.findById(id,function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log('searching ID keyword : %s', id);
        console.dir(result);
        
        if(result.length > 0){
            console.log('ID correct');
            var user = new UserModel({id : id});
            var authenticated = user.authenticate(
            password,
            result[0]._doc.salt,
            result[0]._doc.hashed_password);
        if(authenticated){
            console.log('password correct');
            callback(null, result);
        }else{
            console.log('password incorrect');
            callback(null,null);
        }
    }else{
            console.log('none information matching');
            callback(null,null);
        }
    });
}

// adding user function depend on database that input information from users.insert(id, password), if there is error, throw it with callback function
var addUser = function(database, id, password, name, callback){
    console.log('addUser function has been called, reqesting : ' + id + ',' + password);
    var user = new UserModel({
        "id" : id,
        "password" : password,
        "name" : name});
    user.save(function(err,result){
        if(err){
            callback(err, null);
            return;
        };
        console.log('user information has beed added, added information');
        callback(null, result);
    });
}


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
    
    connectDB();
});