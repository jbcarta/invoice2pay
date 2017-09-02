
// Load Proveedores desde CSV

var Suppliers = require('../models/suppliers');

var mongoose = require('mongoose');


//mongoose.connect('mongodb://127.0.0.1:27017/casupo');
mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

db.on('error', console.error.bind(console, 'connection error:'));





var csv = require('ya-csv');

var csv = require('ya-csv');
var reader = csv.createCsvFileReader('provee.csv');
var data = [];
var supplier = [];
reader.on('data', function(rec) 
{
	vals = rec[0];	
	vals1 = vals.split(";");
	console.log(vals1[0]);
	console.log(vals1[1]);
	console.log(vals1[2]);
	console.log(vals1[3]);
	console.log(vals1[4]);

	supplier = [
		new Suppliers({
			codsupplier: vals1[0],
			name: vals1[2],
			fiscal_number: vals1[4],
			country: vals1[1],
			sap_account_group: vals1[3]
		})]

	data.push(rec);
}).on('end', function() 
{
//	console.log(data);
});


//console.trace("Approver creation in progress..");
console.log("Supplier creation in progress..");

var done = 0;
for (var i=0; i < supplier.length; i++) {
	console.log("record nro. ",i);
	supplier[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( "Dentro de Save:",done, err );
		done++;
		if (done === supplier.length) {
			exit();
		}
	});
}

//console.trace("Approver created..");
console.log("Supplier created..");

function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");		
}



