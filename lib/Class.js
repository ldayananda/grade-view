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

var Class = mongoose.model('Class', classSchema);

exports.Class = Class;
