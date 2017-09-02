var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		servicemonth: {type: String, required: true},
});

module.exports = mongoose.model('servicemonth', schema);

	