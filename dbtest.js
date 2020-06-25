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

// declear express variable as app
var app = express();

//set port env, or 3000
app.set('port', process.env.PORT || 3000); 

//set body-parser as middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// path set using path function(var path) - upblic for html, uploads for file io
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

//variable database for data object
var database;

// connectDB functin delclaered for connect mongodb(ip:port/directory)
function connectDB()
{
    
    mongoClient.connect('mongodb://localhost:27017',{useUnifiedTopology:true},function(err,client){
        if(err)
            throw err;
        
        database = client.db('local');
    })
}

//authorization function that depend on database 
var authUser = function(database, id, password, callback)
{
    var users = database.collection('users');
    users.find(
    {
        "id" : id,
        "password" : password
    }).toArray(function(err,docs){
        if(err){
        callback(err, null);
        return;
        }
        if(docs.length>0)
            {
                console.log('searching for mathing : id [%s], pwd[%s]',id,password);
                callback(null,docs);
            }
        else
        {
            console.log('can not find matching information');
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
    
    if(database){
        authUser(database, paramId, paramPassword, function(err, docs){
        if(err)
        {throw err;}
        if (docs){
            console.dir(docs);
            var username = docs[0].name;
            res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
            res.write('<h1>login succesful</h1>');
            res.write('<div><p>param id: '+ paramId +'</p></div>');
            res.write('<div><p>param password: '+paramPassword+'</p></div>');
            res.write("<br><br><a href='/public/login.html'> go to login page </a>");
            res.end();
        }else{
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

// adding user function depend on database that input information from users.insert(id, password, name), if there is error, throw it with callback function
var addUser = function(database, id, password, name, callback){

    console.log('addUser functin has been called, req : ' + id + ',' + password + ',' + name);
    var users = database.collection('users');
    
    users.insertMany([{"id" : id,
                      "password" : password,
                      "name" : name}],
                    function(err, result)
                    {
        
        if(err){
            callback(err, null);
            return;
        }
        if(result.insertedCount > 0){
            console.log('user information has beed added, added information : ' + result.insertedCount);
        }else{
            console.log('none added information.');
        }
        callback(null, result);
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