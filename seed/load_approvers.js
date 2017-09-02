
var Approver = require('../models/approver');

var mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');

var db = mongoose.connection;

mongoose.connection.on('open', function() 
{
	console.log("Connected to Mongoose...");
});


db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
  // we're connected!
//  console.error.bind(console, 'connected...')
//});



var approver = [
	new Approver({
		approver_code: 'SF',
		description: 'Supervisor Finanzas'}),
	new Approver({
		approver_code: 'SI',
		description: 'Supervisor IT'}),
	new Approver({
		approver_code: 'JF',
		description: 'Jefe Finanzas'}),
	new Approver({
		approver_code: 'JI',
		description: 'Jefe IT'}),
	new Approver({
		approver_code: 'GF',
		description: 'Gerente Finanzas'}),
	new Approver({
		approver_code: 'GI',
		description: 'Gerente IT'}),
	new Approver({
		approver_code: 'DF',
		description: 'Director Finanzas'}),
	new Approver({
		approver_code: 'DI',
		description: 'Director IT'}),
	new Approver({
		approver_code: 'VPI',
		description: 'VP IT'}),
	new Approver({
		approver_code: 'VPF',
		description: 'VP Finanzas'})

];

//console.trace("Approver creation in progress..");
console.log("Approver creation in progress..");

var done = 0;
for (var i=0; i < approver.length; i++) {
	console.log("record nro. ",i);
	approver[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( "Dentro de Save:",done, err );
		done++;
		if (done === approver.length) {
			exit();
		}
	});
}

//console.trace("Approver created..");
console.log("Approver created..");

function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");		
}
