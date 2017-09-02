var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	    img_name: {type: String, required: false},
		img_file: {type: Buffer, required: false}, 
		img_contentType: {type: String, required: false},
	    pdf_name: {type: String, required: false},
		pdf_file: {type: Buffer, required: false}, 
		pdf_contentType: {type: String, required: false}
	});


module.exports = mongoose.model('supplierinvoiceImagen', schema);
