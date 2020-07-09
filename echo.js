var echo = function(params, callback){
    console.log('json-rpc echo has been called');
    console.dir(params);
    callback(null, params);
};


module.exports = echo;