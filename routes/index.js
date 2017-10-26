var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/loginapp';


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var resultArray = [];
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection('comment').find();
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
	var resultArray = [];
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection('comment').find();
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
  var comment = {
    comment: req.body.comment
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('comment').insertOne(comment, function(err, result) {
      assert.equal(null, err);
      console.log(comment);
      db.close();
    });
  });

	res.redirect('/');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/blog');
	}
}

module.exports = router;
