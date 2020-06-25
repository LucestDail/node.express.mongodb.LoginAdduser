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

// declear express variable as app
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

// router decleared
var router = express.Router();

//mongo database midleware import
var mongoClient = require('mongodb').MongoClient;

//variable for data object
var database;

//variable for schema and model object
var UserSchema;
var UserModel;

// connectDB functin delclaered for connect mongodb(ip:port/directory)
function connectDB()
{
    
    console.log('try to connect database');
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/local')
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function(){
        console.log('your database has been connected');
        UserSchema = mongoose.Schema({
            id:{type : String, required : true, unique : true},
            name:{type : String, indes : 'hashed'},
            password:{type : String, required : true},
            age : {type : Number, 'default' : -1},
            created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
            updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
        });
        console.log('schema has been defined');
        UserSchema.static('findById', function(id, callback){
            return this.find({id : id}, callback);
        });

        UserSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        console.log('UserSchem defined complete');    
        UserModel = mongoose.model("user",UserSchema);
        console.log('usermodel has been defined')
    });
    database.on('dcsconnected', function(){
        console.log('your database connection has been failed retry after 5 second');
        setInterval(connectDB, 5000);
    });
}

//authorization function that depend on database 
var authUser = function(database, id, password, callback){
    console.log("authUser function has been called");
    
    UserModel.findById(id,function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log('searching ID keyword : ' + id);
        console.dir(result);
        
        if(result.length > 0){
            console.log('ID correct');
            
        if(result[0]._doc.password == password){
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

// use router as middleware, that could route path given '/'
app.use('/', router);

// when requesting process/login route, respond log and got ID/Password
router.route('/process/login').post(function(req,res){
    console.log('/process/login router has been called');
    
    var paramId = req.body.id||req.query.id;
    var paramPassword = req.body.password||req.query.password;
    if(database){authUser(database, paramId, paramPassword, function(err, result){
        if(err){
            throw err;
        }
        console.log("function result : " + result);
        if (result){
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

// adding user function depend on database that input information from users.insert(id, password), if there is error, throw it with callback function
var addUser = function(database, id, password, name, callback){
    console.log('addUser function has been called, reqesting : ' + id + ',' + password);
    var user = UserModel({"id" : id,
                      "password" : password,
                      "name" : name});
    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        };
        console.log('user information has beed added, added information : ' + id + ',' + password);
        callback(null, user);
    });
}

router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser has been called');
    
    var paramId = req.body.id||req.query.id;
    var paramPassword = req.body.password||req.query.password;
    var paramName = req.body.name||req.query.name;

    console.log('requesting value :' + paramId + ',' + paramPassword + ',' + paramName);
    
    if(database){
        addUser(database,paramId, paramPassword,paramName,function(err,result){
                if(err)
        throw err;
        
        if(result && result.insertedCount > 0){
            console.log(result);
        
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
                console.log('error occured while user list opening');
                res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
                res.write('<h2>user list opening failed</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }if(result){
                console.log(result);
                res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
                res.write('<h2>user list opening</h2>');
                res.write('<div><ul>');
                
                for(var i = 0; i<result.length;i++){
                    var curId = result[i]._doc.id;
                    var curName = result[i]._doc.name;
                    res.write('<li>#' + i + ' : ' + curId + ',' + curName + '</li>');
                }
                
                res.write('</ul></div>');
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


// error handling function, module importing, use it as middleware when httperror 404 happened, outprint 404.html
var errorHandler = expressErrorHandler({
    static:
    {
        '404': './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// server function, ues app struct 'port' num(if would be contain env port or 3000)
var server = http.createServer(app).listen(app.get('port'), function(){
   console.log('express web server port : '+ app.get('port'));
    
    connectDB();
});