module.exports = {
    server_port : 3000,
    db_url : 'mongodb://localhost:27017/local',
    db_schemas : [{
    file : './user_schema',
    collection : 'user1000',
    schemaName : 'UserSchema',
    modelName : 'UserModel'
}],
    jsonrpc_api_path : '/api',
    route_info : [
        /*
        {file : './user', path : '/process/login', method : 'login', type : 'post'},
        {file : './user', path : '/process/adduser', method : 'adduser', type : 'post'},
        {file : './user', path : '/process/listuser', method : 'listuser', type : 'post'}
    */
    ]
    ,facebook: {		// passport facebook
		clientID: '277904173465784',
		clientSecret: '7d274ca83f4de1fa3e8d5b5aa62616c0',
		callbackURL: '/auth/facebook/callback'
	}
    /*
    ,twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
    */
}