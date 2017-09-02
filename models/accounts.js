var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
		account: {type: String, required: true},
		description: {type: String, required: true},
		compania: {type: String, required: false}	
});

module.exports = mongoose.model('accounts', schema);

	