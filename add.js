var add = function(params, callback){
    console.log('JSON-RPC add has been called');
    console.dir(params);
    if(params.length < 2){
        callback({
            code : 400,
            message : 'Insufficient parameters'
        }, null);
        return;
    }
    var a = params[0];
    var b = params[1];
    var output = a+b;
    callback(null, output);
};
module.exports = add;
