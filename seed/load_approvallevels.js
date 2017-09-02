
var Approvallevels = require('../models/approvallevels');

var mongoose = require('mongoose');

// Local
mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://localhost:27017/shopping');
//mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');

var db = mongoose.connection;

mongoose.connection.on('open', function() {
	console.log("Connected to Mongoose...");
});


db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
  // we're connected!
//  console.error.bind(console, 'connected...')
//});

var approvallevels = [
	new Approvallevels({
			aplevel: 'L1',
			valmin: 0,
			valmax:	1000}),
	new Approvallevels({
			aplevel: 'L2',
			valmin: 1001,
			valmax:	10000}),
	new Approvallevels({
			aplevel: 'L3',
			valmin: 10001,
			valmax:	50000}),
	new Approvallevels({
			aplevel: 'L4',
			valmin: 50001,
			valmax:	100000}),
	new Approvallevels({
			aplevel: 'L5',
			valmin: 100001,
			valmax:	9999999})
];

//console.trace("Approver Levels created..");
console.log("Approver Levels creation in progress..");

var done = 0;
for (var i=0; i < approvallevels.length; i++) {
	approvallevels[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log(  "Dentro de Save:",done, err );
		done++;
		if (done === approvallevels.length) {
			exit();
		}
	});
}
console.log("Approver Levels created..");


function exit() {
	console.log("exit.");	
	mongoose.disconnect();
	console.log("exit - despues de mongoose.");
}
