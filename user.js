var database;
var UserSchema;
var UserModel;

var init = function(db, schema, model){
    console.log('init function has beed called');
    database = db;
    UserSchema = schema;
    UserModel = model;
}

var login = function(req, res){
    console.log("login function has been called");
    var database = req.app.get('database');
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
}

var adduser = function(req, res){
    console.log('adduser function has beed called');
    var database = req.app.get("database");
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
}


var listuser = function(req, res){
    console.log('listuser function has beed called');
    var database = req.app.get("database");
    if(database){
        database.UserModel.findAll(function(err,result){
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
}

// adding user function depend on database that input information from users.insert(id, password), if there is error, throw it with callback function
var addUser = function(database, id, password, name, callback){
    console.log('add function has beed called');
    console.log('addUser function has been called, reqesting : ' + id + ',' + password);
    var user = new database.UserModel({
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

//authorization function that depend on database 
var authUser = function(database, id, password, callback){
    //var UserModel = req.app.get('UserModel');
    console.log('auth function has beed called');
    console.log("authUser function has been called");
    database.UserModel.findById(id,function(err, result){
        if(err){
            callback(err, null);
            return;
        }
        console.log('searching ID keyword : %s', id);
        console.dir(result);
        if(result.length > 0){
            console.log('ID correct');
            var user = new database.UserModel({id : id});
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
module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;