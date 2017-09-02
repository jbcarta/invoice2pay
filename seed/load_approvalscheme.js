
var Approvalscheme = require('../models/approvalscheme');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://localhost:27017/shopping');
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


var approvalscheme = [
	new Approvalscheme({
			costcenter:	['XV3001','XV3002'],		
			aplevel: 'L1',
			approver1: 'SI',
			approver2: '',
			approver3: ''}), 
	new Approvalscheme({
			costcenter:	['XV3001','XV3002'],		
			aplevel: 'L2',
			approver1: 'SI',
			approver2: 'GI',
			approver3: ''}),
	new Approvalscheme({
			costcenter:	['XV3001','XV3002'],		
			aplevel: 'L3',
			approver1: 'SI',
			approver2: 'GI',			
			approver3: 'DI'}),
	new Approvalscheme({
			costcenter:	['XV3001','XV3002'],		
			aplevel: 'L4',
			approver1: 'GI',			
			approver2: 'DI',
			approver3: ''}),
	new Approvalscheme({
			costcenter:	['XV3001','XV3002'],		
			aplevel: 'L5',
			approver1: 'DI',
			approver2: '',
			approver3: ''})	
];

//console.trace("Approval scheme created..");
console.log("Approval Scheme creation in progress..");

var done = 0;
for (var i=0; i < approvalscheme.length; i++) {
	approvalscheme[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( done, err );
		done++;
		if (done === approvalscheme.length) {
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

