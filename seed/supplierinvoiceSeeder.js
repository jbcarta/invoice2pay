
var Supplierinvoicescheme = require('../models/supplierinvoice');

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/shopping');
mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');

var db = mongoose.connection;

//var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.error.bind(console, 'connected...')
});

var supplierinvoicescheme = [
	new Supplierinvoicescheme({
		supplier: 'Compañia Telefonica (1001)',
		fecha: '01.07.2016',
		accountcode: '7931993',	
		costcenter: 'XV3001',
		invoice:'001-000012312',
		concepto: 'Servicio de Telefonico',
		amountinvoice:22350.15,
		currency:'ARS',
		servicesmonth:'Junio-2016',
		aplevel: 'L3',
		approver1: 'SI',
		approver2: 'GI',			
		approver3: 'DI'}), 
	new Supplierinvoicescheme({
		supplier: 'Pasteleria Sol (1002)',
		fecha: '01.06.2016',
		accountcode: '7931992',	
		costcenter: 'XV3001',
		invoice:'001-000032312',
		concepto: 'Facturas aniversario',
		amountinvoice:550,
		currency:'ARS',
		servicesmonth:'Junio-2016',
		aplevel: 'L1',
		approver1: 'SI'}), 
	new Supplierinvoicescheme({
		supplier: 'Tecnologia Integral (1005)',
		fecha: '15.07.2016',
		accountcode: '7931993',	
		costcenter: 'XV3001',
		invoice:'001-000012312',
		concepto: 'Mantenimiento Antenas',
		amountinvoice:3500.00,
		currency:'ARS',
		servicesmonth:'Julio-2016',
		aplevel: 'L2',
		approver1: 'SI',
		approver2: 'GI'}), 

];

console.trace("Supplier Invoice scheme created..");


var done = 0;
for (var i=0; i < supplierinvoicescheme.length; i++) {
	supplierinvoicescheme[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( done, err );
		done++;
		if (done === supplierinvoicescheme.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}
