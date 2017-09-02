var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		aplevel: {type: String, required: true},
		approver1: {type: String, required: true},
		approver2: {type: String, required: false},	
		approver3: {type: String, required: false},		
		approver4: {type: String, required: false},	
		approver5: {type: String, required: false},	
		costcenter:{type: String, required: true}
	
});

module.exports = mongoose.model('approvalscheme', schema);