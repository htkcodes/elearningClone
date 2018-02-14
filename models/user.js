var mongoose=require('mongoose');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String,bcrypt:true,required:true
	},
	email: {
		type: String
	},
	name: {
		type: String
    },
    login:{
        type:Date
    },
    logout:{
        type:Date
    }
});