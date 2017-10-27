// For mongo db object modeling
var mongoose = require('mongoose');
// Encryption method for password
var bcrypt = require('bcryptjs');
// Schema for user account
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});
var User = module.exports = mongoose.model('User', UserSchema);


// Encrypts and hashes password to be stored in MongoDB user collection
module.exports.createUser = function(newUser, callback) {

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
		});

}


// Queries username
module.exports.getUserByUsername = function(username, callback) {

	var query = {username: username};
	User.findOne(query, callback);

}


// Queries userID
module.exports.getUserById = function(id, callback) {

	User.findById(id, callback);

}


// Compares user entered password with hashed password in MongoDB
module.exports.comparePassword = function(candidatePassword, hash, callback) {

	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});

}
