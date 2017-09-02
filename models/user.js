var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userFiOrdersSchema = new mongoose.Schema({
	fiorder : {type: String, required: false},
	description: {type: String, required: false}
})

var userSupplierSchema = new mongoose.Schema({
	codsupplier : {type: String, required: false},
	namesupplier: {type: String, required: false}
})

var userCecos = new mongoose.Schema({
	ceco : {type: String, required: false},
	description: {type: String, required: false}
})

var userAccount = new mongoose.Schema({
	account : {type: String, required: false},
	description: {type: String, required: false}
})

var userSchema = new Schema (
{
	name: {type: String, required: false},
	email: {type: String, required: true},
	password: {type: String, required: false},
	cecos: [userCecos],
	accounts: [userAccount],	
	supplier: [userSupplierSchema],
	fi_orders: [userFiOrdersSchema],
	approver: {type: String, requiered: false},
	administrator:  {type: String, required: false},
	invoiceloader:  {type: String, required: false}
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);

