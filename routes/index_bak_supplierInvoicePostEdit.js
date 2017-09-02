var mongo = require('mongodb');


var express = require('express');
var router = express.Router();
var numeral = require('numeral');
var csv = require('ya-csv');

// Mensajes espaciales de errores
	var flash = require('connect-flash');

// filtrar parametros desde html
const querystring = require('querystring');

var url = require("url");

// -----------------------------------
// 			Modelos
// -----------------------------------
	var Cart = require('../models/cart');
	var Product = require('../models/product');
	var User = require('../models/user');


// Evitar el robo de sesiones de browser
// el servidor valida cada solicitud del
// cliente se del mismo browser
	var csrf = require('csurf');
	var csrfProtection = csrf();



// -----------------------------------
//         Models    
// -----------------------------------
	var Approver = require('../models/approver');
	var Approvallevels = require('../models/approvallevels');
	var Approvalscheme = require('../models/approvalscheme');
	var Supplierinvoice = require('../models/supplierinvoice');
	var Suppliers = require('../models/suppliers');
	var Cecos = require('../models/cecos');
	var Accounts = require('../models/accounts');
	var Fiorders = require('../models/fiorders');
	var ServiceMonth = require('../models/servicemonth');


// -----------------------------------
//     
// -----------------------------------
// var loaddata = require('../ownfunction/load_referencedata');





////////////////////////////////////////////////////////






/* **********************************

/*         GET home page. */


router.get('/', function(req, res, next) {

//	loadCecos();
//	loadSupplier();

//	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

//	req.session.cart = cart;

//	Product.find(function(err, docs) {
///		var productChunks = [];
//		var chunkSize = 3;
//		for (var i = 0; i < docs.length; i += chunkSize) {
//			productChunks.push(docs.slice(i, i + chunkSize));
//		}	
//		res.render('shop/index', { title: 'CASUPO', products: productChunks, shopcart: req.session.cart});
		res.render('shop/index', { title: 'CASUPO'});
//	});
});

router.get('/add-to-cart/:id', function(req, res, next) {
	console.log('Entro a  ---------> /add-to-cart/:id');

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	console.log('productId  ---------> ', productId);

	Product.findById(productId, function(err, product) {


		if (err) {
			console.log('Entro a  ---------> /add-to-cart.productId.err');
			console.log('Error    ---------> ', err);
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
			console.log(req.session.cart);
			console.log("----------------------");
			for (key in req.session.cart.items) {
				console.log(req.session.cart.items[key].item.id);				
				console.log(req.session.cart.items[key].item.title);
   			}
		
		res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

	});

});


router.get('/remove-one-from-cart/:id', function(req, res, next) {
	console.log('Entro a  ---------> /remove_one-from-cart/:id');

	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	console.log('productId  ---------> ', productId);

	Product.findById(productId, function(err, product) {


		if (err) {
			console.log('Entro a  ---------> /add-to-cart.productId.err');
			console.log('Error    ---------> ', err);
			return res.redirect('/');
		}
		cart.less1(product, product.id);
		req.session.cart = cart;
			console.log(req.session.cart);
			console.log("----------------------");
			for (key in req.session.cart.items) {
				console.log(req.session.cart.items[key].item.id);				
				console.log(req.session.cart.items[key].item.title);
   			}
		
		res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

	});

});


router.get('/smartfind/:id', function(req, res, next) {
	console.log("paso 1 entre en get.smartfind");
	console.log(req.params);

	var findText = "/"+req.params.id+"/";

	var findText = "/"+req.params.id+"/";

	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	req.session.cart = cart;
	console.log("paso 2 entre en get.smartfind");

	Product.find({$or:[{description: {$regex:findText}}, {title: {$regex:findText,i}}]}, function(err, product) {
		console.log("paso 3 entre en get.smartfind.Product.find");		

		var productChunks = [];
		var chunkSize = 3;
		console.log("paso 4 entre en get.smartfind.Product.find");		
		console.log(product);		

		console.log("paso 5 entre en get.smartfind.Product.find");		

		for (var i = 0; i < product.length; i += chunkSize) {
			productChunks.push(product.slice(i, i + chunkSize));
		}	
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks, shopcart: req.session.cart});
	});
});



// ==========================================
//
//     			Datos Maestros
//
// ==========================================

	//  ------------------------------------------------
	//                  get.usercecos
	//  ------------------------------------------------
		router.get('/userscecos', function(req, res, next) 
		{

			res.render('datamaster/userscecos', { title: 'Asignar Centros de Costos a Usuarios'});
		});	

	//  ------------------------------------------------
	//            post.userscecos_detail 
	//  ------------------------------------------------
		router.post('/userscecos_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /userscecos_detail/tmp_id  ---------> ', tmp_id);

			User.findById(tmp_id, function(err, docs) 
			{
				console.log("post /userscecos_detail/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.approver_code:', docs.email);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].email:', results_mongodb[0].email);

				res.render(	'datamaster/userscecos_edit', 
							{ title: 'Modificar Usuarios/Cecos', 
							recdata: docs});

				console.log("post /userscecos_detail/paso 2 en despues del render");		
			});
		});	

	//  -----------------------------------
	//
	//    POST userscecos_edit_post
	//
	//  -----------------------------------
		router.post('/userscecos_edit_post', function(req, res, next) 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        User.remove({_id: temp_id}, {justOne: true, safe: true}, 
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


				 // /supplierInvoiceInsertreq.method = 'GET'			
				 // res.redirect('/supplierInvoice_Pending');
				 // res.send({redirect: '/supplierInvoice_Pending'});
				 // res.render('process/supplierinvoice_new', { title: 'Facturas'});
				res.redirect('/userscecos');	 


	//			return res.redirect('/supplierinvoice');
				//	res.render('/supplierInvoice_Pending', { title: 'Modificar Factura', recdata: results_mongodb, xsup: results_mongodb.supplier});


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				User.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.email = req.body.email || doc.email;
				        doc.name = req.body.name || doc.name;
				        doc.approver = req.body.approver || doc.approver;


				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/userscecos');
			}    

		});




	//  ------------------------------------------------
	//                  get.Approver 
	//  ------------------------------------------------
		router.get('/approver', function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/approvers', { title: 'Aprobadores'});
			//	});
		});	

	// -------------------------------------
	//      Get /approver_insert
	// -------------------------------------	
		router.get('/approver_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approver_add/get 1: ");		

			res.render('datamaster/approver_create', { title: 'Crear Aprobador'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});

	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approver_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approver(
					{
						approver_code: req.body.approver_code,
						description: req.body.description
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approver');

		});



	//  ------------------------------------------------
	//            post.approver_detail 
	//  ------------------------------------------------
		router.post('/approver_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approver_detail/tmp_id  ---------> ', tmp_id);

			Approver.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approver_detail/paso 1 en Approver.find");		
				console.log('Docs:', docs);
				console.log('docs.approver_code:', docs.approver_code);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].approver_code);

				res.render(	'datamaster/approver_edit', 
							{ title: 'Modificar Aprobadores', 
							recdata: docs});

				console.log("post /approver_detail/paso 2 en despues del render");		
			});
		});

	//  -----------------------------------
	//
	//    POST approver_edit_post
	//			* Grabar Modificaciones
	//          * Eliminar Documento
	//
	//  -----------------------------------
		router.post('/approver_edit_post', function(req, res, next) 

		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, 
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


				 // /supplierInvoiceInsertreq.method = 'GET'			
				 // res.redirect('/supplierInvoice_Pending');
				 // res.send({redirect: '/supplierInvoice_Pending'});
				 // res.render('process/supplierinvoice_new', { title: 'Facturas'});
				res.redirect('/approver');	 


	//			return res.redirect('/supplierinvoice');
				//	res.render('/supplierInvoice_Pending', { title: 'Modificar Factura', recdata: results_mongodb, xsup: results_mongodb.supplier});


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approver.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.title = req.body.approver_code || doc.approver_code;
				        doc.description = req.body.description || doc.description;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/approver');	 
			}    

		});


	//  ------------------------------------------------
	//            post.approvallevels_detail 
	//  ------------------------------------------------
		router.post('/approvallevels_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvallevels_detail/tmp_id  ---------> ', tmp_id);

			Approvallevels.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvallevels_detail/paso 1 en Approvallevels.find");		
				console.log('Docs:', docs);
				console.log('docs.aplevel:', docs.aplevel);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].aplevel);

				res.render(	'datamaster/approvallevels_edit', 
							{ title: 'Modificar Niveles de Aprobación', 
							recdata: docs});

				console.log("post /approvallevel_detail/paso 2 en despues del render");		
			});
		});


	//  -----------------------------------
	//
	//    POST approvallevels_edit_post
	//
	//  -----------------------------------
		router.post('/approvallevels_edit_post', function(req, res, next) 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        Approvallevels.remove({_id: temp_id}, {justOne: true, safe: true}, 
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


				 // /supplierInvoiceInsertreq.method = 'GET'			
				 // res.redirect('/supplierInvoice_Pending');
				 // res.send({redirect: '/supplierInvoice_Pending'});
				 // res.render('process/supplierinvoice_new', { title: 'Facturas'});
				res.redirect('/approvallevels');	 


	//			return res.redirect('/supplierinvoice');
				//	res.render('/supplierInvoice_Pending', { title: 'Modificar Factura', recdata: results_mongodb, xsup: results_mongodb.supplier});


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approvallevels.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.aplevel = req.body.aplevel || doc.aplevel;
				        doc.currency = req.body.currency || doc.currency;
				        doc.valmin = req.body.valmin || doc.valmin;
				        doc.valmax = req.body.valmax || doc.valmax;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/approvallevels');
			}    

		});

	// -------------------------------------
	//      Get /approval_levels_insert
	// -------------------------------------	
		router.get('/approvallevels_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approver_add/get 1: ");		

			res.render('datamaster/approvallevels_create', { title: 'Crear Nivel de Aprobación'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approvallevels_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approvallevels(
					{
						aplevel: req.body.aplevel,
						currency: req.body.currency,
						valmin: req.body.valmin,
						valmax: req.body.valmax
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approvallevels');

		});


	//  ------------------------------------------------
	//            post.approvalscheme_detail 
	//  ------------------------------------------------
		router.post('/approvalscheme_detail', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /approvalscheme_detail/tmp_id  ---------> ', tmp_id);

			Approvalscheme.findById(tmp_id, function(err, docs) 
			{
				console.log("post /approvalscheme_detail/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.aplevel:', docs.aplevel);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].approver_code:', results_mongodb[0].aplevel);

				res.render(	'datamaster/approvalscheme_edit', 
							{ title: 'Modificar Esquemas de Aprobación', 
							recdata: docs});

				console.log("post /approvalscheme_detail/paso 2 en despues del render");		
			});
		});

	//  -----------------------------------
	//
	//    POST approvalschemes_edit_post
	//
	//  -----------------------------------
		router.post('/approvalscheme_edit_post', function(req, res, next) 					 
		{

			var action_returned = req.body.returnaction;
			console.log('action_returned....... :'+action_returned);		
			if (action_returned == "Borrar")
			{
				//   -----------------------------------------------------
				//
				//            Borrar SupplierInvoice
				//
				//   -----------------------------------------------------
				console.log('Entro por borrar..........');
				console.log("---------------------------------: ");
		 		
				var temp_id = req.body.id;
				console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

				console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



				// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
				// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

				console.log("Delete  --------------------------------: ");

		        Approvalscheme.remove({_id: temp_id}, {justOne: true, safe: true}, 
		        						function(err, result) 
		        {
		            if (err) 
		            {
						console.log("Error  --------------------------------: ");
		                console.log(err);
		                // throw err;
		            }
					console.log("Result   --------------------------------: ");
		            console.log(result);
		        });

				console.log("after Delete  --------------------------------: ");


				 // /supplierInvoiceInsertreq.method = 'GET'			
				 // res.redirect('/supplierInvoice_Pending');
				 // res.send({redirect: '/supplierInvoice_Pending'});
				 // res.render('process/supplierinvoice_new', { title: 'Facturas'});
				res.redirect('/approvalscheme');	 


	//			return res.redirect('/supplierinvoice');
				//	res.render('/supplierInvoice_Pending', { title: 'Modificar Factura', recdata: results_mongodb, xsup: results_mongodb.supplier});


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);

				console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

				Approvalscheme.findById(tmp_id, function (err, doc) {  
				    // Handle any possible database errors
				    if (err) {
				        res.status(500).send(err);
				    } else {
				        // Update each attribute with any possible attribute that may have been submitted in the body of the request
				        // If that attribute isn't in the request body, default back to whatever it was before.
				        doc.aplevel = req.body.aplevel || doc.aplevel;
				        doc.costcenter = req.body.costcenter || doc.costcenter;
				        doc.approver1 = req.body.approver1 || doc.approver1;
				        doc.approver2 = req.body.approver2 || doc.approver2;
				        doc.approver3 = req.body.approver3 || doc.approver3;
				        doc.approver4 = req.body.approver4 || doc.approver4;
				        doc.approver5 = req.body.approver5 || doc.approver5;

				        // Save the updated document back to the database
				        doc.save(function (err, todo) {
				            if (err) {
				                res.status(500).send(err)
				            }
				            console.log('doc saved:',doc)
				            //res.send(todo);
				        });
				    }
				});			
				res.redirect('/approvalscheme');
			}    

		});


	// -------------------------------------
	//      Get /approvalschemes_insert
	// -------------------------------------	
		router.get('/approvalscheme_insert', function(req, res, next) 
		{

			var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/approvalschemes_add/get 1: ");		

			res.render('datamaster/approvalscheme_create', { title: 'Crear Esquemas de Aprobación'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	// -------------------------------------
	//      post /approver_insert
	// -------------------------------------	
		router.post('/approvalscheme_insert', function(req, res, next) 
		{
			var post_data = req.body;
	  		console.log('post_data:',post_data);

			//console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
			// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);
	  		// console.log('post_query.supplier:');
	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			arecord.push( 
				new Approvalscheme(
					{
				        aplevel : req.body.aplevel,
				        costcenter : req.body.costcenter,
				        approver1 : req.body.approver1,
				        approver2 : req.body.approver2,
				        approver3 : req.body.approver3,
				        approver4 : req.body.approver4,
				        approver5 : req.body.approver5						
					}));

			arecord[0].save(function(err, result) 
			{
				console.log( "Grabando:", result, err );
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + result + "document!");		
			 	}

			});        
			return res.redirect('/approvalscheme');

		});





router.post('/form_aprover_saved:id', function(req, res, next) {

	var tmp_id = req.params.id;

	var query = {"_id": tmp_id};
	var operator = {"set" : {"description" : req.body.f_description}}
    var xx = req.body._id;

	console.log("-------------------------------");
	console.log("f_approver: ", xx);

	console.log("Query: ", query._id);
	console.log("-------------------------------");

	Approver.update(query, function(err, updated) {
		if(err) {
		    console.log("Error .." + err);		

		}
		else
		{
		    console.log("Actualización existosa " + updated + "document!");		
	 	}
	});

  return res.redirect('/approver');
});



router.get('/approvallevels', function(req, res, next) {
	Approvallevels.find(function(err, approvallevels) {
		console.log("paso 2 en Approver.find");		

		var approvallevelsChunks = [];
		console.log("paso 4 entre en get.smartfind.Product.find");		
		console.log(approvallevels);		

		for (var i = 0; i < approvallevels.length; i++) {
			approvallevelsChunks.push(approvallevels.slice(i));
		}	
		console.log("paso 5 en Approver.for");		

		res.render('datamaster/approvallevels', { title: 'Niveles de Aprobación', recdata: approvallevels});

		console.log("paso 6 en despues del render");		
});

});



router.get('/approvalscheme', function(req, res, next) {
	Approvalscheme.find( function(err, approvalscheme) {
		console.log("paso 2 en Approver.find");		

		console.log("paso 4 entre en get.smartfind.Product.find");		
		console.log(approvalscheme);		

		console.log("paso 5 en Approver.for");		

		res.render('datamaster/approvalscheme', { title: 'Esquema de Aprobación', recdata: approvalscheme});

		console.log("paso 6 en despues del render");		
	});
});

router.get('/supplierinvoice', function(req, res, next) {
	Supplierinvoice.find( function(err, supplierinvoice) {
//		console.log(supplierinvoice);		
		res.render('process/supplierinvoice', { title: 'Facturas', recdata: supplierinvoice});
	});
});


	// -----------------------------------
	//
	//    POST supplierInvoice_Edit
	//
	// -----------------------------------
	router.post('/supplierinvoice_edit/:id', function(req, res, next) 
	{

		var tmp_id = req.params.id;
		// console.log("req.body.save_form :", req.body.save_form);
		if (req.body.save_form == "SI")
		{
			// console.log("/supplierinvoice_edit/post 1: "+tmp_id);		

		    // console.log("comments:", req.body.comments);
			var query = {"_id": tmp_id};
			var operator = {"supplier": req.body.supplier,
							"fecha" : req.body.fecha,
							"accountcode": req.body.accountcode,
							"costcenter": req.body.costcenter,
							"servicesmonth": req.body.servicesmonth,
							"amountinvoice": req.body.amountinvoice,
							"currency": req.body.currency,
							"comments": req.body.comments
							}
		    var xx = req.body.fecha;

			console.log("-------------------------------");
			console.log("field_to_update: ", xx);
			console.log("operator: ", operator);

			console.log("Query: ", query._id);
			console.log("-------------------------------");

			Supplierinvoice.update(query, operator, function(err, updated) {
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + updated + "document!");		
			 	}
			});
		}
		else
		{
			console.log("No Grabar");
		}

  	return res.redirect('/supplierinvoice');

});



	// -----------------------------------
	//
	//    POST supplierInvoice_save
	//
	// -----------------------------------
	router.post('/supplierinvoice_save/:id', function(req, res, next) 
	{



		var tmp_id = req.params.id;
		console.log("router.post('/supplierinvoice_save -------------------------");
		console.log("req.body.save_form :", req.body.save_form);
		if (req.body.save_form == "SI")
		{
			console.log("/supplierinvoice_edit/post 1: "+tmp_id);		

		    console.log("comments:", req.body.comments);
			var query = {"_id": tmp_id};
			var operator = {"supplier": req.body.supplier,
							"fecha" : req.body.fecha,
							"accountcode": req.body.accountcode,
							"costcenter": req.body.costcenter,
							"servicesmonth": req.body.servicesmonth,
							"amountinvoice": req.body.amountinvoice,
							"currency": req.body.currency,
							"comments": req.body.comments
							}
		    var xx = req.body.fecha;

			console.log("-------------------------------");
			console.log("field_to_update: ", xx);
			console.log("operator: ", operator);

			console.log("Query: ", query._id);
			console.log("-------------------------------");

			Supplierinvoice.update(query, operator, function(err, updated) {
				if(err) {
				    console.log("Error .." + err);
				}
				else
				{
				    console.log("Actualización existosa " + updated + "document!");		
			 	}
			});
		}
		else
		{
			console.log("No Grabar");
		}

  	return res.redirect('/supplierinvoice');

});



router.post('/supplierinvoice_edit/:id', function(req, res, next) {

	var tmp_id = req.params.id;

	console.log("/supplierinvoice_edit/post 1: "+tmp_id);		

//    console.log("comments:", req.body.comments);
	var query = {"_id": tmp_id};
	var operator = {"supplier": req.body.supplier,
					"fecha" : req.body.fecha,
					"accountcode": req.body.accountcode,
					"costcenter": req.body.costcenter,
					"servicesmonth": req.body.servicesmonth,
					"amountinvoice": req.body.amountinvoice,
					"currency": req.body.currency,
					"comments": req.body.comments
					}
    var xx = req.body.fecha;

	//console.log("-------------------------------");
	//  console.log("field_to_update: ", xx);
	// console.log("operator: ", operator);

	// console.log("Query: ", query._id);
	// console.log("-------------------------------");

	Supplierinvoice.update(query, operator, function(err, updated) {
		if(err) {
		    console.log("Error .." + err);
		}
		else
		{
		    console.log("Actualización existosa " + updated + "document!");		
	 	}
	});

  	return res.redirect('/supplierinvoice');

});




router.get('/showcart', function(req, res, next) {
//	if (!req.session.cart) {
//		return res.render('shop/shopcart', {shopcart: null});
//	}
//	var cart = new Cart(req.session.cart);
//	res.render('shop/shopcart', {shopcart: cart.generateArray(), totalPrice: cart.totalPrice});

//	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	var cart = new Cart(req.session.cart ? req.session.cart : null);
//	var cart = new Cart(req.session.cart);
 //	req.session.cart = cart;
//	console.log(req.session.cart);
//	console.log("----------------------");
//	for (key in req.session.cart.items) {
//			console.log(req.session.cart.items[key].item.title);				
//	}
    res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

});

router.post('/smartfind', function(req, res, next) {

	console.log("paso 1 entre en post.smartfind");
//	var txtNombre = document.getElementById('inputFindText').value;	
	console.log(req.body.inputFindText);

	var findText =  req.body.inputFindText || '';

	var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

	req.session.cart = cart;
	console.log("paso 2 entre en post.smartfind");

	Product.find({$or:[{description: {$regex:findText, $options: 'i'}}, {title: {$regex:findText, $options: 'i'}}]}, function(err, product) {
		console.log("paso 3 entre en post.smartfind.Product.find");		

		var productChunks = [];
		var chunkSize = 3;
	
		console.log("paso 4 entre en post.smartfind.Product.find");		
		console.log(product);		

		console.log("paso 5 entre en post.smartfind.Product.find");		

		for (var i = 0; i < product.length; i += chunkSize) {
			productChunks.push(product.slice(i, i + chunkSize));
		}	
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks, shopcart: req.session.cart});
	});
});


router.get('/delete-from-cart/:id', function(req,res){ 

    var id = req.params.id;
    console.log("ID: ", id);

    Product.remove({id:id}, function(err, result) { //undefined??
        if (err) return res.status(500).send({err: 'Error: Could not delete Product'});
        if(!result) return res.status(400).send({err: 'Product bot deleted from firebase database'});
        console.log('deleted!!!');
        res.send(result); 
    });
});




//	Product.remove({ id: productId }, function (err) {
//	  if (err) {
//	  		// removed
//	  		console.log("Registro:", productId);
//	  }
//	});

//	Product.find({ "id": productId }).remove().exec();
//     Product.deleteOne(
//      { "itemcode": productId },
//      function(err, results) {
//         console.log(results);
//         callback();
//      });
//	res.render('/', { title: 'Shopping Cart', shopcart: req.session.cart});
//});



router.get('/cleancart', function(req, res, next) 
{
		var cart = new Cart({items: {}});
		req.session.cart  = cart;	
		res.render('shop/shopcart', { title: 'Shopping Cart', shopcart: req.session.cart});

	});



	// ----------------------------------------------------
	//              loadCecos
	// ----------------------------------------------------
	function loadCecos(cecos_array)
	{

	    Cecos.find(function(err, docs) {

			// console.log("--------------------------------------");		
			// console.log("loadCecos  - despues de find");		

			// console.log("Err:",err);		

			// console.log("Console-docs --------------------------------------");		
			//	console.log(docs);

			results_cecos_mongodb = []
			results_cecos_mongodb.push(docs);

			//	console.log(results_from_mongodb);
		    var docChunks = [];
			var chunkSize = 1;
			//		for (var i = 0; i < docs.length; i += chunkSize) {
			//			docChunks.push(docs.slice(i, i + chunkSize));
			//		}			

			global.cecos_array = results_cecos_mongodb;
			// console.log("/Cecos/paso 2 en .find");		
			// console.log(cecos_array);		

			//		req.body.form_aprover = approver.aprover;

			// console.log("Callback - loadCecos saliendo");		
		});


	};



	// ************************************
	//
	//    GET   supplierInvoiceEdit
	//
	// ************************************

	router.get('/supplierInvoiceEdit/:id', function(req, res)  
	{


		// console.log('/supplierinvoice_edit/req.params.id  ---------> ', req.params.id);
		var temp_id = req.params.id;



		// console.log('/supplierinvoice_edit/tmp_id  ---------> ', temp_id);

    	Supplierinvoice.findById(temp_id, function(err, docs) 
    	{

//			console.log("/supplierinvoice_edit/Supplierinvoice.findById 1");

//			console.log("Err:"+err);		


//			console.log('Invoice docs------------------');
//			console.log(docs);

			results_supplier_mongodb = []
			results_supplier_mongodb.push(docs);

			// console.log('mongo result------------------');
			// console.log(results_supplier_mongodb);

//			global.supplier_array = results_supplier_mongodb;


//			doc1.push(docs);

//			console.log('req.session.invoice antes de enviar ------------------');


			res.render('process/supplierinvoice_edit', { title: 'Facturas',
											recdata: results_supplier_mongodb});

//			console.log("/supplierinvoice_edit/Supplierinvoice.findById 3");
		});
	});


	// ************************************
	//
	//    GET   supplierInvoiceEdit
	//
	// ************************************

	router.get('/tcecos', function(req, res)  
	{

		res.render('datamaster/AllCecos', { title: 'Centro de Costos'});
	});




   


// RestFul API

//ROUTE SEARCH ============================================
router.get('/api/restGetAllSupplier', function(req, res)
{
	// console.log('/api/restGetAllSupplier ---------------');

   	Suppliers.find({},{codsupplier: 1, name:1, country:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all data
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		// console.log('output :',output);

		res.json(output);	});
});


//router.get('/api/restGetCecos', function(req, res)
//{
//   	Cecos.find({}, function(err, alldata)
//	{
//		if (err)
//		{
//			res.send(err);
//		}
				
		// Return all clients
//		res.json(alldata);
//	});
//});


//router.post('/api/restPostCecos', function(req, res)
//{
//	console.log('/api/restPostCecos');
//   	Cecos.find({}, {_id:1, ceco:1, description:1, company:1}, function(err, alldata)
//	{
//		if (err)
//		{
//			res.send(err);
//		}
				
		// Return all clients
//		res.json(alldata);
//	});
//});


router.get('/api/restPostUsersField', function(req, res)
{
	// console.log('get -> /api/restPostUsersField --------');
   	User.find({}, {_id:1, email:1, name:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients

		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;

		res.json(output);
	});
});


router.get('/api/restPostCecosField', function(req, res)
{
	// console.log('get -> /api/restPostCecosField --------');
   	Cecos.find({}, {_id:0, ceco:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients

		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;

//var obj = JSON.parse(str);
//		var output = Array;
//		output.push({});
//		output.push({});		
//		output.data.push(alldata);

		


//https://datatables.net/forums/discussion/32031/pagination-with-server-side-processing

//https://datatables.net/examples/server_side/post.html


//https://datatables.net/forums/discussion/32031/pagination-with-server-side-processing#Comment_86438


//https://datatables.net/forums/discussion/13679/working-code-for-server-side-paging-filtering-sorting-for-python-flask-mongodb

//https://datatables.net/forums/discussion/34861/jquery-datatables-min-js-39-uncaught-typeerror-cannot-read-property-length-of-undefined

//https://datatables.net/reference/option/ajax.data



//http://www.civc.edu.vn/libs/DataTables-1.9.4/examples/data_sources/server_side.html


		res.json(output);
	});
});


//  -----------------------------------
// 		       Api Accounts
//  -----------------------------------
router.get('/api/restPostAccountField', function(req, res)
{
	// console.log('/api/restPostAccountField--------------');
   	Accounts.find({}, {_id:0, account:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});
});

//  -----------------------------------
// 		       Api Fi Orders
//  -----------------------------------
router.get('/api/restPostFiordersField', function(req, res)
{
	console.log('/api/restPostFiordersField--------------');
   	Fiorders.find({}, {_id:0, order:1, description:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});
});

//  -----------------------------------
// 		       Api Service Month
//  -----------------------------------
router.get('/api/restPostServiceMonth', function(req, res)
{
	// console.log('/api/restPostServiceMonth--------------');
   	ServiceMonth.find({}, {_id:0, servicemonth:1}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// console.log('alldata.size:',alldata.length);
		var totrec = alldata.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata;
		res.json(output);

	});

});


router.get('/api/restGetOneSupplierInvoice/:id', function(req, res)
{
	var temp_id = req.params.id;
   	Supplierinvoice.findById(temp_id, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
		res.json(docs);
	});
});


router.get('/api/restGetSupplierbyCodSupplier/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var temp_id =  req.params.id.trim() ;

	// console.log("temp_id :",temp_id)


//   	Suppliers.find(temp_id, function(err, docs) 
   	Suppliers.find({codsupplier :temp_id}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});
});


router.get('/api/restGetSupplierbyName/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var findText = "/"+req.params.id.trim()+"/";

	// console.log("findText :",findText);

   	Suppliers.find( {$or:[{codsupplier: {$regex:findText}}, 
   		                  {name:        {$regex:findText}}
   		                 ]}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});
});

// Supplier Conceptos

router.get('/api/restGetSupplierConcepts', function(req, res)
//router.get('/api/restGetSupplierConcepts', function(req, res)
{


//	console.log('cs: ',req.query.codsupplier);

	var findText = req.query.codsupplier;
    if (req.query.codsupplier)
    {
	   findText = req.query.codsupplier.split(":")[0];
    }
	else
	{
//	    var output = { "iTotalRecords" : 0, "iTotalDisplayRecords" : 10 };
//		res.json(output)
	   findText = '24';
	}



//    var findText = "";
	// console.log("/api/restGetSupplierConcepts/------------------");
	// console.log("------------------");
	// console.log("findText :",findText);
//	console.log("#supplier :",$("#supplier").val());

	// console.log("------------------");


   	Suppliers.find( {codsupplier: findText},{codsupplier:1,concepts:1}, function(err, alldata) 
//   	Suppliers.find( {codsupplier: findText}, function(err, docs) 

	{
		if (err)
		{
			console.log("Errors------------------");
			console.log(alldata);

			res.send(alldata);
		}
		else

		// Return all clients
		console.log("concepts------------------");
		// console.log(alldata[0].codsupplier);
		// console.log(alldata[0].concepts[0]);
		var totrec = alldata[0] ? alldata[0].concepts.length:0;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata[0] ? alldata[0].concepts: 0;
		// console.log('totrec :',totrec);
		// console.log('output :',output);

		res.json(output);
	});


});




router.get('/api/OLDrestGetAprovallevels', function(req, res)
{
   	Approvallevels.find({}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients
		res.json(alldata);
	});
});




router.get('/api/restInsertUserSupplier/:id', function(req, res)
{

	var temp_id = req.params.id;
	 var marray = temp_id.split("&")

	// console.log("----------------------------");	

	// console.log("email:",marray[0]);
	// console.log("codsupplier:",marray[1]);
	// console.log("namesupplier:",marray[2]);
	// console.log("----------------------------");	




//db.users.update({ email: "1@1.com" }, {$set:{ supplier: [{ codsupplier: "NUEVO01", name: "NOMBRENUEVO01"} ]}})

//db.users.update({ email: "1@1.com" }, {$addToSet:{ supplier: { codsupplier: "NUEVO05", name: "NOMBRENUEVO05"} }})

 	User.update({ email: marray[0] }, 
 				{$push:{ supplier: { codsupplier: marray[1], namesupplier: marray[2]} }}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
			console.log('Error en grabación:', err);
		}
				
		// Return all clients
		res.json(docs);
		console.log('Grabó bien');

	});



});

// ---------------------------------------------------------------------------------------- //
//                                     SupplierInvoice
// ---------------------------------------------------------------------------------------- //


	// -----------------------------------
	//
	//    POST supplierinvoicePostEdit
	//			* Grabar Modificaciones
	//          * Eliminar Documento
	//
	// -----------------------------------				  
	router.post('/supplierInvoicePostEdit', function(req, res, next) 

	{
		var action_returned = req.body.returnaction;
		console.log('action_returned....... :'+action_returned);		
		if (action_returned == "Borrar")
		{
			//   -----------------------------------------------------
			//
			//            Borrar SupplierInvoice
			//
			//   -----------------------------------------------------
			console.log('Entro por borrar..........');
			console.log("---------------------------------: ");
	 		
			var temp_id = req.body.id;
			console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

			console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



			// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
			// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

			console.log("Delete  --------------------------------: ");

	        Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, 
	        						function(err, result) 
	        {
	            if (err) 
	            {
					console.log("Error  --------------------------------: ");
	                console.log(err);
	                // throw err;
	            }
				console.log("Result   --------------------------------: ");
	            console.log(result);
	        });

			console.log("after Delete  --------------------------------: ");


			 // /supplierInvoiceInsertreq.method = 'GET'			
			 // res.redirect('/supplierInvoice_Pending');
			 res.send({redirect: '/supplierInvoice_Pending'});
			//res.render('process/supplierinvoice_new', { title: 'Facturas'});

//			return res.redirect('/supplierinvoice');
			//	res.render('/supplierInvoice_Pending', { title: 'Modificar Factura', recdata: results_mongodb, xsup: results_mongodb.supplier});


		}
		else
		{
	  		console.log('-----------------------------------------------');
	  		console.log('supplierInvoicePostEdit - Modificar  ----------');
	  		console.log('-----------------------------------------------');

			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("---------------------------------: ");

			console.log("tmp_id: "+tmp_id);



				Supplierinvoice.find(condition, function (err, doc) 
				{  
					console.log("err...."+err);
					console.log("doc...."+doc);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
				    	if (doc.length > 0) /// existe el doc y lo actualiza
				    	{
					        // Update each attribute with any possible attribute that may have been submitted in the body of the request
					        // If that attribute isn't in the request body, default back to whatever it was before.
					        doc.taxcode = req.body.taxcode || doc.taxcode;
					        doc.taxamount = req.body.taxamount || doc.taxamount;

					        // Save the updated document back to the database
					        doc.save(function (err, todo) 
					        {
					            if (err) 
					            {
					                res.status(500).send(err)
					            }
					            console.log('doc saved:',doc)
					            //res.send(todo);
					        });
				        }
				        else
				        {
				        	// crear tax
				        	console.log( "Entró por crear tax...............");

							Supplierinvoice.update(condition, update, { upsert: true }, function(err, doc)
							{				        	
								// { $set: update}
								console.log( "tax dentro del update...............");
								console.log( "Grabando..doc:", doc );
								console.log( "Grabando..err:", err );

								if(err) 
								{
				    					console.log("Error .." + err);
								}
								else
								{
				    				console.log("Actualización existosa ", result, "document!");		
			 					}

							});        				        	
				        }

				    }
				});			

				//	Supplierinvoice.update(condition, update, function(err, doc);
				//Supplierinvoice.update(
				//		{ "_id": tmp_id, 
				//		  "detailtax": { $elemMatch: {"linenumber" : tmp_linenumber }}
				//		}, 
				//		{ $set: update
				//		},
				//		function(err, doc)
				//		{
				//Supplierinvoice.find(
				//					{ "_id": tmp_id, 
				//					  "detailtax": { $elemMatch: {"taxcode" : taxcode }}
				//					}, 
				//					{ $set: update
				//					},
				//					function(err, doc)
				//{
				//			console.log('dentro -> tmp_id :', tmp_id);
				//	
				//			console.log( "Actualizado head....:", doc, err );
				//			if(err) 
				//			{
				//    			console.log("Head Error .." + err);
				//			}
				//			else
				//			{
				//    			console.log("Actualización Head existosa " + doc + "document!");
								/*
										order: {type: String, required: false},	
										concept:{type: String, required: false},
										servicemonth:{type: String, required: false},
										description:{type: String, required: false},
								*/
				//};			

			};  
		    

			res.redirect('/supplierInvoice_Pending');	 
		}    

	 
//			res.render('process/supplierinvoice_new', { title: 'Facturas'});			

//		return res.redirect('/supplierInvoice_Pending');


//		res.redirect( { title: 'Facturas'}, 'process/supplierinvoice_new');
		


	});


	// -------------------------------------
	//      Get supplierInvoice_Pending
	// -------------------------------------	
	router.get('/supplierInvoice_Pending', function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice_new', { title: 'Facturas'});
	//	});
	});


	// -------------------------------------
	//      Get /supplierinvoice_add
	// -------------------------------------	
	router.get('/supplierinvoice_add', function(req, res, next) 
	{

		var tmp_id = req.params.id;

		console.log("------------------------------: ");

		console.log("/supplierinvoice_add/get 1: ");		

		//		var operator = {"supplier": req.body.supplier,
		//						"fecha" : req.body.fecha,
		//						"accountcode": req.body.accountcode,
		//						"costcenter": req.body.costcenter,
		//						"servicesmonth": req.body.servicesmonth,
		//						"amountinvoice": req.body.amountinvoice,
		//						"currency": req.body.currency,
		//						"comments": req.body.comments
		//						}
		//	    var xx = req.body.fecha;
		//		res.render('process/supplierinvoice_edit', { title: 'Crear Factura', recdata: supplierinvoice});

		res.render('process/supplierinvoice_detail_create', { title: 'Crear Factura'});

		//  	return res.redirect('/process/supplierinvoice_edit');

	});


	// -------------------------------------
	//      Post /supplierinvoice_view
	// -------------------------------------	
		router.post('/supplierinvoice_view', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);

	   	Supplierinvoice.findById(temp_id, function(err, docs) 
		{
			if (err)
			{
			       console.log("Error docs : "+docs);
			}
					
			var results_mongodb = [];

			results_mongodb.push(docs);


			console.log("---------------------------------: ");

			console.log("docs : "+docs);
			console.log("---------------------------------: ");

			console.log("results_mongodb : "+results_mongodb);

			res.render('process/supplierinvoice_detail_edit', { title: 'Modificar Factura', recdata: results_mongodb, xsup: results_mongodb.supplier});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});



	// -------------------------------------
	//      Get /supplierinvoiceDelete
	// -------------------------------------	
	//	router.get('/supplierInvoiceDelete/:id', function(req, res, next) 

	router.get('/supplierInvoiceDelete', function(req, res, next) 
	{



	});


	// -------------------------------------
	//      post /Supplier Invoice Insert
	// -------------------------------------	
	router.post('/supplierInvoiceInsert', function(req, res, next) 
	{

  		console.log('-----------------------------------------------');
  		console.log('SupplierInvoiceInsert     ---------------------');
  		console.log('-----------------------------------------------');

		// var post_data = req.body;
  		// console.log('post_data:',post_data);
		// var post_query = req.query;
  		// console.log('post_query:',post_query);

		// console.log("Post --> /supplierInvoiceInsert ---> req.body.supplier :", req.body.supplier);
		// console.log("Post --> /supplierInvoiceInsert ---> req.body.tdetail.size :", req.body.detail[0]);

  		// console.log('post_query.supplier:');

  		console.log('post_query.cotcenter.length:',req.body.costcenter.length);

		var arecord = [];
		var adetail = [];


		if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
		{
  			console.log('post_query.cotcenter[0]:',req.body.costcenter[0]);
  			console.log('post_query.cotcenter[1]:',req.body.costcenter[1]);
		}
		else
		{
  			console.log('post_query.cotcenter:',req.body.costcenter);
  			console.log('post_query.accountcode:',req.body.accountcode);

  			adetail = {	
  						linenumber: req.body.linenumber,
  						costcenter: req.body.costcenter,
  						accountcode: req.body.accountcode,
  						order: req.body.order,
  						concept: req.body.concept,
  						servicemonth: req.body.servicemonth,
  						description: req.body.description
  						};
		};


		// +++++++++++++++++++++++++++++++++
		//    Buscar nivel de aprobación

		var t_aplevel = "";
		var t_approver1 = "";
		var t_approver2 = "";
		var t_approver3 = "";
		var t_approver4 = "";
		var t_approver5 = "";

        console.log('Antes Approvallevels - req.body.amountinvoice:', req.body.amountinvoice);
        console.log('Antes Approvallevels - req.body.currency:', req.body.currency);
		Approvallevels.find({$and: [ 	{valmin : {$lte: req.body.amountinvoice }}, 
										{valmax : {$gte: req.body.amountinvoice }}, 
										{currency : {$eq: req.body.currency}} 
									]} , function(err, docs)
		{
            console.log('Approvallevels - doc :',docs);
            console.log('Approvallevels - docs.length:', docs.length);
            console.log('Approvallevels - err:', err);
            console.log('Approvallevels - req.body.costcenter  :',req.body.costcenter);
            var t_pos = req.body.costcenter.indexOf(':');
            console.log('Approvallevels - t_pos :', t_pos);

            var t_costcenter = req.body.costcenter.slice(0,t_pos).trim();

            console.log('Approvallevels - req.body.costcenter.slice(0,t_pos).trim() :', t_costcenter );
            var repite = true;
			for (var i=0; i < docs.length; i++)
			{

            	console.log('Approvallevels - i :',i);
            	console.log('Approvallevels - doc[',i,'].aplevel :',docs[i].aplevel);

				Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
						  				aplevel : docs[i].aplevel}, function(err, docs1)
				{
            		console.log('Approvalscheme docs1:',docs1);
            		console.log('Approvalscheme - docs1.length :',docs1.length);            		
					// 	console.log('Approvalscheme - docs1[0].aplevel :',docs1[0].aplevel);  

            		if (docs1.length > 0)
            		{
            			t_aplevel = docs1[0].aplevel;
            			t_approver1 = docs1[0].approver1;
						t_approver2 = docs1[0].approver2;
						t_approver3 = docs1[0].approver3;
						t_approver4 = docs1[0].approver4;
						t_approver5 = docs1[0].approver5;

						i=100;

						console.log('Approvalscheme: break',t_aplevel);

						//  ----------------------------------------------------
						//  ---------------- inicio grabar resto del proceso

							console.log('Approvalscheme - t_aplevel :',t_aplevel);
							console.log('Approvalscheme - t_approver1  :',t_approver1 );
							console.log('Approvalscheme - t_approver2  :',t_approver2 );
							console.log('Approvalscheme - t_approver3  :',t_approver3 );
							console.log('Approvalscheme - t_approver4  :',t_approver4 );
							console.log('Approvalscheme - t_approver5  :',t_approver5 );

							arecord.push( 
								new Supplierinvoice(
									{
										supplier: req.body.supplier,
										accountingdate: req.body.accountingdate,
										documentdate: req.body.documentdate,
										documenttype: req.body.tpdoc,
										documentnumber: req.body.numdoc,
										currency: req.body.currency,
										netamountinvoice: req.body.amountinvoice,
										totaltax: req.body.totaltax,
										totalinvoice: req.body.totalinvoice,
										aplevel: t_aplevel,
										approver1: t_approver1,
										approver2: t_approver2,	
										approver3: t_approver3,
										approver4: t_approver4,
										approver5: t_approver5,
										detail: adetail,
									}));

							// ++++++++++++++++++++++
							// 		Agregar taxes
							var tdetail = [];
							if (Object.prototype.toString.call(req.body.taxcode) === '[object Array]')
							{
								console.log('Taxes - como array:');
								console.log('Taxes - req.body.taxcode.length:', req.body.taxcode.length);

								for (var i=0; i < req.body.taxcode.length; i++)
								{
					  				console.log('post_query.taxcode[i]:',req.body.taxcode[i]);
						 			tdetail = 
						  					{	
						  						taxcode: req.body.taxcode[i],
						  						taxamount: req.body.taxamount[i]
						  					};
						  			arecord[0].detailtax.push(tdetail);			    
								}  			
							}
							else
							{
								console.log('Taxes - plano:');			
					  			console.log('post_query.taxcode:',req.body.taxcode);
					  			console.log('post_query.taxamount:',req.body.taxamount);

					  			tdetail = 
					  					{	
					  						taxcode: req.body.taxcode,
					  						taxamount: req.body.taxamount
					  					};
					  			arecord[0].detailtax.push(tdetail);
							};				


							arecord[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
								    console.log("Actualización existosa " + result + "document!");		
							 	}

							});    


						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------





					}
					else
            		{
            			console.log("No Encontró esquema de aprobación. No se graba la factura")

					} //(docs1.length > 0)
            	}); //Approvalscheme.find
        	} // for (var i=0; i < docs.length; i++)
		}); // Approvallevels.find

    
		return res.redirect('/supplierInvoice_Pending');

	});


	// ******************************************************
	//
	//      	API's Datamaestra
	//
	// ******************************************************


	// -------------------------------------
	//      get api /api/approvers
	// -------------------------------------	
	router.get('/api/approvers', function(req, res, next) 
	{
		console.log('Entro en /api/approvers.........');
	   	Approver.find({ approver_code: { $exists: true } } , function(err, alldata)
		{
			console.log('Entro en /api/approvers .. dentro de find');

			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

			console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
	//		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});

	});



	// -------------------------------------
	//      get api /api/approvallevels
	// -------------------------------------	
		router.get('/api/approvallevels', function(req, res, next) 
		{
			console.log('Entro en /api/approvalevels.........');
		   	Approvallevels.find({ aplevel: { $exists: true } } , function(err, alldata)
			{
				console.log('Entro en /api/approvalevels .. dentro de find');

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}

				console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});

	// -------------------------------------
	//      get api /api/approvalscheme
	// -------------------------------------	
		router.get('/api/approvalscheme', function(req, res, next) 
		{
			console.log('Entro en /api/approvalscheme.........');
		   	Approvalscheme.find({ aplevel: { $exists: true } } , function(err, alldata)
			{
				console.log('Entro en /api/approvalevels .. dentro de find');

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}

				console.log('alldata.size:',alldata.length);
				var totrec = alldata.length;
		//		console.log('totrec :',totrec);
			    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
			    output["data"] = alldata;

		//		res.json(output);

						
				// Return all clients
		//		console.log(output);
				res.json(output);
			});

		});


	// ******************************************************
	//
	//      				API's Procesos
	//
	// ******************************************************


	// -------------------------------------
	//      get api /api/supplierinvoice
	// -------------------------------------	
	router.get('/api/supplierinvoice', function(req, res, next) 
	{

//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)
	   	Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
		{
			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}

	//		console.log('alldata.size:',alldata.length);
			var totrec = alldata.length;
	//		console.log('totrec :',totrec);
		    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
		    output["data"] = alldata;

	//		res.json(output);

					
			// Return all clients
	//		console.log(output);
			res.json(output);
		});

	});





// -------------------------------------

//       RestDelUserSupplier

// -------------------------------------
router.get('/api/restDelUserSupplier/:id', function(req, res)
{

	var temp_id = req.params.id;
	 var marray = temp_id.split("&")

//	console.log("----------------------------");	

//	console.log("email:",marray[0]);
//	console.log("codsupplier:",marray[1]);
//	console.log("----------------------------");	




	//db.users.update({ email: "1@1.com" }, {$set:{ supplier: [{ codsupplier: "NUEVO01", name: "NOMBRENUEVO01"} ]}})

	//db.users.update({ email: "1@1.com" }, {$addToSet:{ supplier: { codsupplier: "NUEVO05", name: "NOMBRENUEVO05"} }})
	//db.users.update({email: "1@1.com"}, { $pull: {supplier: { codsupplier:"2018"}}})


 	User.update({ email: marray[0] }, 
 				{$pull:{ supplier: { codsupplier: marray[1]} }}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
			console.log('Error en Eliminación:', err);
		}
				
		// Return all clients
		res.json(docs);
		console.log('Eliminación correcta');

	});
});



router.get('/api/restUpdateUser/:id', function(req, res)
{
	var temp_id = req.params.id;
	console.log("temp_id:", temp_id);

//db.users.update({ email: "1@1.com" }, {$set:{ supplier: [{ codsupplier: "NUEVO01", name: "NOMBRENUEVO01"} ]}})

   	User.update(temp_id, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
			console.log('Error en grabación:', err);
		}
				
		// Return all clients
		res.json(docs);
		console.log('Grabó bien');

	});
});


// ************************************************************************************


// -------------------------------------

//       RestGetCecobyCeco

// -------------------------------------
router.get('/api/restGetCecobyCeco/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var temp_id =  req.params.id.trim() ;

//	console.log("temp_id :",temp_id)


//   	Suppliers.find(temp_id, function(err, docs) 
   	Cecos.find({ceco :temp_id}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});
});


router.get('/api/restGetAllCecos', function(req, res)
{
   	Cecos.find({}, function(err, alldata)
	{
		if (err)
		{
			res.send(err);
		}
				
		// Return all clients
		res.json(alldata);
	});
});




// -------------------------------------

//       RestDelSupplierInvoice

// -------------------------------------
router.get('/api/restDelSupplierInvoice/:id', function(req, res)
{

//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
	var temp_id =  req.params.id.trim() ;

//	console.log("temp_id :",temp_id)


//   	Suppliers.find(temp_id, function(err, docs) 
   	Cecos.find({ceco :temp_id}, function(err, docs) 
	{
		if (err)
		{
			res.send(docs);
		}
				
		// Return all clients
//		console.log(docs);
		res.json(docs);
	});

		var temp_id = req.params.id;

		console.log("---------------------------------: ");

		// aquiestoydelete
		console.log("post /supplierInvoiceDelete/post_id : "+temp_id);

		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");
        // Supplierinvoice.remove({_id: ObjectID("52b2f757b8116e1df2eb46ac")}, {safe: true}, function(err, result) {

        Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, function(err, result) 
        {
            if (err) 
            {
				console.log("Error  --------------------------------: ");
                console.log(err);
                // throw err;
            }
			console.log("Result   --------------------------------: ");
            console.log(result);
        });

		console.log("after Delete  --------------------------------: ");




});


	// -------------------------------------

	//       Rest API Delete SupplierInvoice

	// -------------------------------------
	router.get('/api/deleteSupplierInvoice/:id', function(req, res)

	{

		//	var temp_id =  '{codsupplier : ' + req.params.id + '}';
		var temp_id =  req.params.id.trim() ;

		//	console.log("temp_id :",temp_id)

		var temp_id = req.params.id;

		console.log("---------------------------------: ");

		// aquiestoydelete
		console.log("get API /supplierInvoiceDelete/post_id : "+temp_id);

		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");
        // Supplierinvoice.remove({_id: ObjectID("52b2f757b8116e1df2eb46ac")}, {safe: true}, function(err, result) {

        Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, function(err, result) 
        {
            if (err) 
            {
				console.log("Error  --------------------------------: ");
                console.log(err);
       			res.send(err);


                // throw err;
            }
			console.log("Result   --------------------------------: ");
            console.log(result);
            res.send(result);

        });

		console.log("after Delete  --------------------------------: ");
	});








//  como llamar al restfull desde arriba
//  
//    	http://localhost:3000/api/restGetAllSupplier
//    	http://localhost:3000/api/restGetOneSupplierInvoice/5794e0cfe3dbbb2011c04bb2
// 		5794e0cfe3dbbb2011c04bb2

module.exports = router;



