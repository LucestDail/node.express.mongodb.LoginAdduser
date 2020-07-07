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
//passport and flash module import
var passport = require('passport');
var flash = require('connect-flash');
var config = require('./config');
var route_loader = require('./route');
var database = require('./database');
var app = express();
var socketio = require('socket.io');
var cors = require('cors');

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
//use passport as middleware. befor using, initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

//router module depend on route.js
var router = express.Router();
route_loader.init(app, router);

//passport-local module import as middleware
var configPassport = require('./passport');
configPassport(app, passport);

var userPassport = require('./user_passport');
userPassport(router, passport);


// error handling function, module importing, use it as middleware when httperror 404 happened, outprint 404.html
var errorHandler = expressErrorHandler({
    static:
    {
        '404': './public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//if uncaughtException occured, server process maintain
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('maintain server process, not terminate');
	console.log(err.stack);
});

//signal handler => close express server when process terminated
process.on('SIGTERM', function () {
    console.log("process has been terminated, your express module turn off");
    app.close();// -> this make app.on('close') gonna be down relatively
});
//express handler => close express module dependable app module when app got signal(close)
app.on('close', function () {
	console.log("express app module has been turned off. disconnect you database now");
	if (database.db) {
		database.db.close();
	}
});

// server function, ues app struct 'port' num(if would be contain env port or 3000)
var server = http.createServer(app).listen(app.get('port'), function(){
   console.log('express web server port : '+ app.get('port'));
    
    database.init(app,config);
});

var io = socketio.listen(server);
console.log('socket.io has been called');
var login_ids = {};
io.sockets.on('connection', function(socket){
    console.log('connection info : ' + JSON.stringify(socket.request.connection._peername));
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    socket.on('message',function(message){
        console.log('message has been called' + JSON.stringify(message));
        if(message.recepient == 'ALL'){
            console.log('All client has been transfered');
            io.sockets.emit('message', message);
        }else{
            if(login_ids[message.recepient]){
                io.sockets.connected[login_ids[message.recepient]].emit('message',message);
                sendResponse(socket, 'message','200','message has been sended');
            }else{
                sendResponse(socket,'login','404','cant find sender id');
            }
        }   
    });
    socket.on('login', function(login){
        console.log('login event has been called');
        console.dir(login);
        
        console.log('connected socket id : ' + JSON.stringify(socket.id));
        login_ids[login.id] = socket.id;
        socket.login_id = login.id;
        console.log('number of connected client id : ' + JSON.stringify(Object.keys(login_ids).length));
        sendResponse(socket, 'login','200','login has been successed');
    });
});

function sendResponse(socket, command, code, message){
    var statusObj = {
        command : command,
        code : code,
        message : message
    };
    socket.emit('response', statusObj);
}