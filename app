var
	express = require('express'),
	app = express(),
	PORT = 2000,
	mongoose = require('mongoose'),
	MONGO_URL = 'mongodb://localhost/grading',
	db = mongoose.connection,
	classes = require('./lib/Class.js').Class,
	cb = function(res) {
		return {
			success : function(body) {
				res.send(body);
			},
			fail : function(err) {
				console.log(err);
			}
		};
	};

mongoose.connect(MONGO_URL);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Mongoose connection established");
});

app.get('/', function(req, res) {
	classes.getClasses(cb(res));
});

app.get('/:id', function(req, res) {
	var title = req.param('id');
	classes.getClass(title, cb(res));
});

app.listen(PORT, function() {
	console.log("App up on port " + PORT);
});
