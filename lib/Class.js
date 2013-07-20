var mongoose, Assignment, Exam, Quiz;

mongoose = require('mongoose');
Assignment = mongoose.Schema({
	number : String,
	grade : Number
});

Exam = mongoose.Schema({
	type: String,
	grade: Number,
	worth : Number
});

Quiz = mongoose.Schema({
	number: String,
	grade : Number
});

var classSchema = mongoose.Schema({
	title : String,
	code : String,
	professor : String,
	semester : String,
	assignments : { value: Number, grades: [Assignment] },
	exams : { value : Number, grades : [Exam] },
	quizes : { value : Number, grades : [Quiz] }
});

classSchema.statics.getClasses = function(cb) {
	this.find({},
		function(err, records) {
			if (err) { 
				cb.fail(err);
			} else {
				cb.success(records);
				console.log(records);
			}
		});
};

classSchema.statics.getClass = function(title, cb) {
	this.find({ title : title }, { _id : 0},
		function(err, record){
			if (err) { 
				cb.fail(err);
			} else {
				cb.success(record);
			}
		});
};

classSchema.statics.add = function(record, cb) {
	this.findOneAndUpdate(
		{ title : record.title}, 
		record, 
		{ upsert : true }, 
		function(err, record) {
			if (err) { 
				cb.fail(err);
			} else {
				cb.success(record);
			}
		});
};

// used for now
classSchema.statics.remove = function(id, cb) {
	this.findOneAndRemove({ title : id },
		function(err, record) {
			if (err) {
				cb.fail(err);
			} else {
				cb.success(record);
			}
	});
};

var Class = mongoose.model('Class', classSchema);

exports.Class = Class;
