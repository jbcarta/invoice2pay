var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgfacts = new mongoose.Schema({
		data: {type: Buffer, required: false}, 
		contentType: {type: String, required: false}	
	});

var taxes = new mongoose.Schema({
		linenumber: {type: String, required: false},	
		taxcode: {type: String, required: false},	
		taxamount: {type: String, required: false}
	});

var supplierinvoicedetail = new mongoose.Schema({
		linenumber: {type: String, required: true},	
		costcenter: {type: String, required: false},	
		accountcode: {type: String, required: false},	
		order: {type: String, required: false},	
		concept:{type: String, required: false},
		servicemonth:{type: String, required: false},
		description:{type: String, required: false}
	})

var schema = new Schema({
		supplier: {type: String, required: true, required: 'Debe Deber un proveedor asignado'},
		company:  {type: String, required: true},
		accountingdate: {type: String, required: false},
		documentdate: {type: String, required: false},
		documenttype:{type: String, required: false},
		documentnumber:{type: String, required: false},
		currency:{type: String, required: true},
		exchangerate:{type: String, required: false},
		netamountinvoice:{type: String, required: true},
		totaltax:{type: String, required: false},
		totalinvoice:{type: String, required: false},
		aplevel: {type: String, required: true},
		approver1: {type: String, required: true},
		approver1date: {type: String, required: false},
		approver1user: {type: String, required: false},
		release1: {type: String, required: false},
		approver2: {type: String, required: false},	
		approver2date: {type: String, required: false},
		approver2user: {type: String, required: false},		
		release2: {type: String, required: false},		
		approver3: {type: String, required: false},
		approver3date: {type: String, required: false},
		approver3user: {type: String, required: false},	
		release3: {type: String, required: false},		
		approver4: {type: String, required: false},	
		approver4date: {type: String, required: false},
		approver4user: {type: String, required: false},
		release4: {type: String, required: false},
		approver5: {type: String, required: false},
		approver5date: {type: String, required: false},
		approver5user: {type: String, required: false},
		release5: {type: String, required: false},
		approver_total: {type: String, required: false},
		createddate: {type: Date, default: Date.now,
									required: '(createddate) Debe asignar fecha de creación'},
		maxdatetorelease: {type: Date, default: new Date(+new Date() + 7*24*60*60*1000),
									required: '(maxdatetorelease) Debe asignar fecha maxima de liberación (1 semana)'},							
		createdby: {type: String, required: false},
		detail: [supplierinvoicedetail],
		detailtax: [taxes],
		imgfact: [imgfacts],
		sap_id : {type: String, required: false},
		sap_date: {type: Date, default: Date.now, required: false}
});

module.exports = mongoose.model('supplierinvoice', schema);
