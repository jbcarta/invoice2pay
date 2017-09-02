var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	aplevel: {type: String, required: true},
	currency: {type: String, required: true},
	valmin: {type: Number, required: false},
	valmax: {type: Number, required: true}	
});

module.exports = mongoose.model('approvallevels', schema);