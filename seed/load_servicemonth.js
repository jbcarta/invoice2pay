
// Load Proveedores desde CSV

var Servicemonth = require('../models/servicemonth');

var mongoose = require('mongoose');


//mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');

// para usar con internet servidor de claxson
  mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

db.on('error', console.error.bind(console, 'connection error:'));

var csv = require('ya-csv');
var reader = csv.createCsvFileReader('servicemonth.csv');
var data = [];
var adata = [];
var done = 0;



reader.on('data', function(rec) 
{
	vals = rec[0];	
	vals1 = vals.split(";");
	//	console.log(vals1[0]);
	//	console.log(vals1[1]);
	//	console.log(vals1[2]);
	//	console.log(vals1[3]);
	//	console.log(vals1[4]);
//	console.log("rec:",done," Supplier creation in progress..", vals1[0]);

	adata.push( 
		new Servicemonth({
			servicemonth: vals1[0]
		}));

		done++;

//	data.push(rec);
}).on('end', function() 
{
	console.log("done:",done);
	console.log("adata.length:",adata.length);
	j=0
	for (var i=0; i < adata.length; i++) {
	console.log("record nro. ",i);
	adata[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( "Grabando:",j, result, err );
		j++;
		if (j === adata.length) {
			exit();
		}
	});
}

});


function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");		
}


