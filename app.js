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

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

mongoose.connect(MONGO_URL);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Mongoose connection established");
});

app.get('/', function(req, res) {
});

app.get('/classes', function(req, res) {
	classes.getClasses(cb(res));
});

app.get('/:id', function(req, res) {
	var title = req.param('id');
	classes.getClass(title, cb(res));
});

app.post('/grading', function(req, res) {
	var record = req.body;
	classes.add(record, cb(res));
});

app.post('/calculate', function(req, res) {
	var record = req.body;
	classes.calc(record, cb(res));
});

app.listen(PORT, function() {
	console.log("App up on port " + PORT);
});
