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

classSchema.statics.calc = function(record, cb) {
	var assign = record.assignments,
		quiz = record.quizes,
		exams = record.exams;

	var currentGrade = 
		this.calcA(assign) +
		this.calcE(exams) +
		this.calcQ(quiz);

	return {
		currentGrade,
		function(err, record) {
			if (err) {
				cb.fail(err);
			} else {
				cb.success(record);
			}
		}
	};
}

/** Calculates grades for assignments based on:
 *	- array of assignments(asignment number, number grade)
 *	- weight of assignment group
**/
classSchema.statics.calcA = function(assigns, cb) {
	this.classes.aggregate({
		{ $project : { assignments } },
		{ $unwind : assignemnts.grades },
		{ $group : { 
			_id : "$number",
			total: { $sum : "$grade" }
		}}
	},
	function(ans) {
		return ans * assigns.value;
	},
	function(err, record) {
		if (err) {
			cb.fail(err);
		} else {
			cb.success(record);
		}
	});
};

/** Calculates grades for exams based on:
 *	- array of exams(type of exam, number grade, exam weight)
 *	- weight of entire exam group
**/
classSchema.statics.calcE = function(exams, cb) {
	this.classes.aggregate({
		{ $project : { exams } },
		{ $unwind : exams.grades },
		{ $group : {
			_id : "$type",
			worth : { "$grade" * "$worth" },
			total : { $sum : "$worth" }
		}},
	},
	function(ans) {
		return ans * exams.value;
	},
	function(err, record) {
		if (err) {
			cb.fail(err);
		} else {
			cb.success(record);
		}
	});
};

/** Calculates grades for quizes based on:
 *	- array of quizes(quiz number, number grade)
 *	- weight of entire quiz group
**/
classSchema.statics.calcQ = function(quizes, cb) {
	this.classes.aggregate({
		{ $project : { quizes } },
		{ $unwind : quizes.grades },
		{ $group : { 
			_id : "$number",
			total: { $sum : "$grade" }
		}}
	},
	function(ans) {
		return ans * quizes.value;
	},
	function(err, record) {
		if (err) {
			cb.fail(err);
		} else {
			cb.success(record);
		}
	});
};

// unused for now
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
