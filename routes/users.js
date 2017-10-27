var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


// Renders register.hbrs
router.get('/register', function(req, res) {
	res.render('register');
});


// Renders login.hbrs
router.get('/login', function(req, res) {
	res.render('login');
});



router.post('/register', function(req, res) {
	// Requests account data from user
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validates user input 
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	// Handles errors, else insert new user to "users" collection in Mongo
	if(errors) {
		res.render('register', {
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user) {
			if(err) throw err;
			console.log(user);
		});

		// Gives green light to login, redirects to login page
		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/users/login');
	}
});



passport.use(new LocalStrategy(

	// Passport checks if username is valid
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user) {
   	if(err) throw err;
   	if(!user) {
   		return done(null, false, {message: 'Unknown User'});
   	}

	 // Passport checks if password is a match
   User.comparePassword(password, user.password, function(err, isMatch) {
   		if(err) throw err;
   		if(isMatch) {
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));


// Stores cookie in brower to maintain login session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});


// Removes cookie to logout
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


// Gives routes for successful and failed logins
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });


// Logs user out, redirects to unlogged in blog page
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/blog');
});



module.exports = router;
