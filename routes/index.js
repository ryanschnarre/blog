var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/loginapp';



router.get('/', ensureAuthenticated, function(req, res){
  // Create Array storing DB data
	var resultArray = [];

	// Connect to DB
	mongo.connect(url, function(err, db) {
		//Error Handler
		assert.equal(null, err);
		var cursor = db.collection('comment').find();

		// Pull comments from DB and send to index
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			resultArray.push(doc);
		}, function() {
			db.close();
			res.render('index', {items: resultArray});
		});

	});
});



router.get('/blog', function(req, res){
	// Create array storing DB data
	var resultArray = [];

	// Connect to Mongo DB
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection('comment').find();

		// Send comment data to unlogged in blog page
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			resultArray.push(doc);
		}, function() {
			db.close();
			res.render('blog', {items: resultArray});
		});

	});
});



router.post('/insert', function(req, res, next) {

	// Requests comment from user
  var comment = {
    comment: req.body.comment
  };

	// Connect to Mongo DB
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);

		// Insert user comment to "comment" collection
    db.collection('comment').insertOne(comment, function(err, result) {
      assert.equal(null, err);
      console.log(comment);
      db.close();
    });
  });

	// Redirect to index
	res.redirect('/');
});



function ensureAuthenticated(req, res, next){

	// If user is authenticated login, otherwise go to unlogged in blog page
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/blog');
	}

}


module.exports = router;
