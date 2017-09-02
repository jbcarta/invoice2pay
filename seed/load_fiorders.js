
// Load Proveedores desde CSV

var Fiorders = require('../models/fiorders');

var mongoose = require('mongoose');


//mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');
mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

db.on('error', console.error.bind(console, 'connection error:'));

var csv = require('ya-csv');
var reader = csv.createCsvFileReader('Datos_maestros_de_órdenes_AUFK.csv');
var data = [];
var fiorders = [];
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

	fiorders.push( 
		new Fiorders({
			order: vals1[0],
			description: vals1[8]
		}));

		done++;

//	data.push(rec);
}).on('end', function() 
{
	console.log("done:",done);
	console.log("accounts.length:",fiorders.length);
	j=0
	for (var i=0; i < fiorders.length; i++) {
	console.log("record nro. ",i);
	fiorders[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( "Grabando:",j, result, err );
		j++;
		if (j === fiorders.length) {
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


