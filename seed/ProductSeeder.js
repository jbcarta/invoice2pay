var Product = require('../models/product');

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

var products = [
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/39d44794433d8ef6a78f8d151dc381a919782f33/medium_39d44794433d8ef6a78f8d151dc381a919782f33.jpg',
		itemcode: "1000000",
		brand: 'Tang',
		title: 'Jugo En Polvo',
		description: 'Manzana-Sobre de 18Gr',
		price: 4}),
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/4899b96a94ada8a7bd9f68b5e91c766dccf7916f/medium_4899b96a94ada8a7bd9f68b5e91c766dccf7916f.jpg',
		itemcode: "1000001",
		brand: 'Ades',
		title: 'Alimento De Soja Regular',
		description: 'Tetrabrick Manzana 1Lt',
		price: 26}),
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/04d48fc8b0704e0348ea7723bdd5c1783a37485f/medium_04d48fc8b0704e0348ea7723bdd5c1783a37485f.jpg',
		itemcode: "1000002",
		brand: 'Casacream',
		title: 'Queso Untable',
		description: 'Pot-Gr.-300',
		price: 48}),
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/34b9e9abbc753fc642e8c2ed55d323e1c56013e4/medium_34b9e9abbc753fc642e8c2ed55d323e1c56013e4.jpg',
		itemcode: "1000003",
		brand: 'La Serenisima',		
		title: 'Manteca',
		description: 'Paquete 200Gr',
		price: 21.12}),
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/f8989cc0c971fd9a21774d756e3ec0ab4fe7bda8/medium_f8989cc0c971fd9a21774d756e3ec0ab4fe7bda8.jpg',
		itemcode: "1000004",
		brand: 'Finlandia',
		title: 'Queso Untable',
		description: 'Fuente De Vitaminas-Con Vitamina A Y D-Clasico-Pot-Gr.-200',
		price: 30}),
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/undefined/medium_tomate-redondo1-4c72446e1fb80dce5b74c48b762812f3-480-0.jpg',
		itemcode: "1000005",
		brand: 'Bandeja',		
		title: 'Tomate Redondo',
		description: 'x 250g',
		price: 31}),
	new Product({
		imagePath: 'https://s3-us-west-2.amazonaws.com/mercadoni/live/8dcca7710ce2eca6387bde1496b6ebb0d1eccc88/medium_8dcca7710ce2eca6387bde1496b6ebb0d1eccc88.jpg',
		itemcode: "1000006",
		brand: 'Novillito De Gondola',
		title: 'Colita De Cuadril',
		description: 'Bandeja X Kg',
		price: 108}),

	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/133245.jpg',
		itemcode: "1000007",
		brand: 'Robinson Crusoe',		
		title: 'Mejillones en Aceite',
		description: 'Lata 190 G',
		price: 83.65}),
	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/46282.jpg',
		itemcode: "1000008",
		brand: 'La Campagnola',		
		title: 'Atún En Aceite',
		description: 'Lata de 120 G',
		price: 49.39}),
	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/112370.jpg',
		itemcode: "1000009",
		brand: 'Cocinero',		
		title: 'Aceite De Oliva',
		description: 'Pvc 500 Cc',
		price: 91.49}),
	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/56155.jpg',
		itemcode: "1000010",
		brand: 'Cocinero',		
		title: 'Aceite Girasol Mezcla',
		description: '1.5 Lt',
		price: 34.99}),
	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/121567.jpg',
		itemcode: "1000011",
		brand: 'WD',		
		title: 'Aceite Lubricante Wd-40 ',
		description: '5.5 Oz St.01 Aer 155 Gr.',
		price: 57.59}),
	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/175468.jpg',
		itemcode: "1000012",
		brand: 'Johnson & Johnson',		
		title: 'Aceite Con Aloe Y Vitaminas Johnson´S Baby',
		description: '200 Ml',
		price: 56.25}),
	new Product({
		imagePath: 'https://www.jumbo.com.ar/JumboComprasArchivos/Archivos/326094.jpg',
		itemcode: "1000013",
		brand: 'Daysal',		
		title: 'Aceitera Vinagrera',
		description: ' ',
		price: 99.99})	

];

console.trace("hola");


var done = 0;
for (var i=0; i < products.length; i++) {
	products[i].save(function(err, result) {
//		var stack = new Error().stack
		console.log( done, err );
		done++;
		if (done === products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}
