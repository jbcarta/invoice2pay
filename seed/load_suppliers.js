
// Load Proveedores desde CSV

var Suppliers = require('../models/suppliers');

var mongoose = require('mongoose');


//mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');
mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

db.on('error', console.error.bind(console, 'connection error:'));


console.log('antes de ya-csv');
var csv = require('ya-csv');
console.log('antes csv.createCSV....');

var reader = csv.createCsvFileReader('maestrodeproveedores_LFA1.csv');
console.log('despues de csv.createCSV....');
//var reader = csv.createCsvFileReader('provee.csv');

var data = [];
var supplier = [];
var done = 0;
var cpt ="";

reader.on('data', function(rec) 
{

	vals = rec[0];	
	console.log('dentro de reader - vals:',vals);	
	vals1 = vals.split(";");
	if (done>0)
	{
//	if (vals1[4])
//	{
//	    cpt = vals1[4].split(";");
//
//	}
//	else
//	    cpt = "";
	//	console.log(vals1[0]);
	//	console.log(vals1[1]);
	//	console.log(vals1[2]);
	//	console.log(vals1[3]);
	//	console.log(vals1[4]);
//	console.log("rec:",done," Supplier creation in progress..", vals1[0]);
/*	console.log('vals1[4]:');
	console.log(vals1);

	console.log(vals1[4].split("|"));
*/
//	console.log('vals1[4]:'+vals1[6]);
//	console.log('cpt:'+cpt);
//    var conceptxx = [];
//    xx.push

/*      
		tmp_concepts = vals1[4].split("|");

		var arr= [];
		for (var id in tmp_concepts) {
			console.log('id:'+id);
//			arr.push.tmp_concept[id];
			arr[id] = {"concept" : tmp_concepts[id]}
		}

*/

	supplier.push( 
		new Suppliers({
			codsupplier: vals1[0],
			name: vals1[2],
			//fiscal_number: vals1[5],
			country: vals1[1],
			account_group: vals1[3]//,
			//concepts: arr
		}));

}
		done++;

//	data.push(rec);
}).on('end', function() 
{
	console.log("done:",done);
	console.log("supplier.length:",supplier.length);
	j=0
	for (var i=0; i < supplier.length; i++) {
	console.log("record nro. ",i);
	supplier[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( "Grabando:",j, result, err );
		j++;
		if (j === supplier.length) {
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


