var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	approver_code: {type: String, required: true},
	description: {type: String, required: true}
});

module.exports = mongoose.model('approver', schema);