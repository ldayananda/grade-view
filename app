var
	express = require('express'),
	app = express(),
	PORT = 2000,
	mongoose = require('mongoose'),
	MONGO_URL = 'mongodb://localhost/grading',
	db = mongoose.connection,
	classes = require('./lib/Class.js');

mongoose.connect(MONGO_URL);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Mongoose connection established");
});

app.get('/', function(req, res) {
	res.send('welcome');
});

app.listen(PORT, function() {
	console.log("App up on port " + PORT);
});
