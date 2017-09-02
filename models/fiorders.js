var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		order: {type: String, required: true},
		description: {type: String, required: true},	
});

module.exports = mongoose.model('fiorders', schema);

	