var route = {};

var config = require('./config');

route.init = function(app, router){
    console.log('route init function has been called');
    
    initRoutes(app, router);
}

function initRoutes(app, router){
    
    var infoLen = config.route_info.length;
    console.log('initRoutes function has been called');
    
    for (var i=0; i< config.route_info.length; i++){
        var curItem = config.route_info[i];
        var curModule = require(curItem.file);
        if(curItem.type == 'get'){
            router.route(curItem.path).get(curModule[curItem.method]);
        }else if(curItem.type == 'post'){
            router.route(curItem.path).post(curModule[curItem.method]);
        }else{
            console.error('cant find routin type : ' + curItem.type);
        }
    }
    app.use('/', router);
}
module.exports = route;