//crypto module import
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose){
    //make schema
    UserSchema = mongoose.Schema({
        id:{type : String, required : true, unique : true, 'default' : ''},
        hashed_password : {type : String, required : true, 'default' : ''},
        salt:{type : String, required : true},
        name:{type : String, index : 'hashed', 'default' : ''},
        age : {type : Number, 'default' : -1},
        created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
        updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
    });
    //virtualization for password
    UserSchema
        .virtual('password')
        .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);        
        console.log('virtual password has been called : %s, %s', this.hashed_password);
    }).get(function(){
         return this._password
    });
    console.log('UserSchema, virtual password defined');
    
    // password encrypt method
    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
        }
    });
    
    // make salt for hashing method 
    UserSchema.method('makeSalt',function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });
    
    //authorization method
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate has been called %s -> %s, %s',
                       plainText,
                       this.encryptPassword(plainText,inSalt),
                       hashed_password);
            return this.encryptPassword(plainText,inSalt) === hashed_password;
        }else{
            console.log('authenticate has been called %s -> %s, %s',
                       plainText,
                       this.encryptPassword(plainText),
                       this.hashed_password);
            return this.encryptPassword(plainText) === this.hashed_password;            
        }
    });
    //value validation function defined
    var validatePresenceOf = function(value) {
		return value && value.length;
	};
	//validation activation function
	UserSchema.pre('save', function(next) {
		if (!this.isNew) return next();

		if (!validatePresenceOf(this.password)) {
			next(new Error('not activatable password'));
		} else {
			next();
		}
	})    
    UserSchema.path('id').validate(function(id){
        return id.length;
    }, 'id column value is not exist');
    
    UserSchema.path('name').validate(function(name){
        return name.length;
    }, 'name column value is not exist');
  
    UserSchema.path('hashed_password').validate(function (hashed_password) {
        return hashed_password.length;
    }, 'hashed_password column value is not exist');
    
    UserSchema.static('findById', function(id, callback){
        return this.find({id : id}, callback);
    });
    
    UserSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });
    
    console.log('UserSchem defined complete');    
    
    return UserSchema;
};

module.exports = Schema;