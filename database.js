var mongoose = require('mongoose');

var database = {};

database.init = function(app, config){
    
    console.log('init function has been called');
    connect(app, config);
}
// connect function delclaered for connect mongodb(ip:port/directory)
function connect(app, config){
    console.log('connect function has been called');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection;
    database.db.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.db.on('open', function(){
        console.log('your database has been connected');
        createSchema(app, config);
        console.log('createUserSchema function been called');
    });
    database.db.on('dcsconnected', function(){
        console.log('your database connection has been failed retry after 5 second');
        setInterval(connectDB, 5000);
    });
    
}

function createSchema(app, config){
    
    var schemaLen = config.db_schemas.length;
    console.log('schema number of config.js file : ' + schemaLen);
    
    for(var i=0;i<schemaLen;i++){
        var curItem = config.db_schemas[i];
        var curSchema = require(curItem.file).createSchema(mongoose);
        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('model defined for collection : ' + curItem.collection);
        
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('%s schem and %s model has beed added to attribution');
    }
    app.set('database', database);
    console.log('database object has been added to app object attribution')
}

module.exports = database;