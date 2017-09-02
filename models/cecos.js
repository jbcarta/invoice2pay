var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		companyceco: {type: String, required: false},
		ceco: {type: String, required: true},
		company: {type: String, required: true},
		description: {type: String, required: false},	
		owner: {type: String, required: false}	
});

module.exports = mongoose.model('cecos', schema);

	