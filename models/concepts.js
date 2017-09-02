var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	concept : {type: String, required: false}
});

module.exports = mongoose.model('concepts', schema);