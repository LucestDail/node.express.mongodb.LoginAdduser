var echo_error = function(params, callback){
    console.log('JSON-RPC echo_error function has benn called');
    console.dir(params);
    
    if(params.length<2){
        callback({
            code : 400,
            message : 'Insufficient parameter'
        }, null);
        return;
    }
    
    
    var output = 'Success';
    callback(null,output);
};

module.exports = echo_error;