var mongo = require('mongodb');


var express = require('express');
var path = require('path');
var router = express.Router();

var numeral = require('numeral');
var csv = require('ya-csv');
var formidable = require('formidable');
var fs = require('fs');
//var request = require("request");


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
	var Supplierinvoiceimagen = require('../models/supplierinvoiceimagen');	
	var Suppliers = require('../models/suppliers');
	var Concepts = require('../models/concepts');

	var Cecos = require('../models/cecos');
	var Accounts = require('../models/accounts');
	var Fiorders = require('../models/fiorders');
	var ServiceMonth = require('../models/servicemonth');

	var jsonfile = require('jsonfile');

// -----------------------------------
//     
// -----------------------------------
// var loaddata = require('../ownfunction/load_referencedata');




////////////////////////////////////////////////////////






/* **********************************

/*         GET home page. */


router.get('/ldap_login', function(req, res, next) 
{

	//return 
		//res.render('shop/index', { title: 'CASUPO'});

	// using jQuery & 'headers' property

	res.render('process/testing_login', { title: 'TESTING LOGIN'});

});


router.get('/sendmail', function(req, res, next) 
{

	console.log("Entro a sendmail");

	var sendmail = require('../sendmail')({silent: true});

	sendmail({
	  from: 'test@yourdomain.com',
	  to: 'jbcarta@hotmail.com',
	  subject: 'Rechazo de Fatura',
	  html: 'La factura tiene incongruencias'
	}, function (err, reply) {
	  console.log(err && err.stack)
	  console.dir(reply)
	});
});


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
		res.render('shop/index', { title: 'INVOICE2PAY'});
//	});
});



	// ----------------------------------------------
	//      get /supplierinvoice_writefilejson
	// ----------------------------------------------
	router.get('/supplierinvoice_writefilejson', function(req, res, next) 
	{

//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)
	   	Supplierinvoice.find({ supplier: { $exists: true } } , function(err, alldata)
		{
			if (err)
			{
				console.log('api-error:',err);
				res.send(err);

			}


			var t_invoice = [];
		
			for (var i = 0; i < alldata.length; i++) 
			{
				var t_detail = [];
				var t_taxes = [];		

				for (var j = 0; j < alldata[i].detail.length; j++) 
				{
					t_detail[j] =
					{
						costcenter : alldata[i].detail[j].costcenter.split(":")[0],
						accountcode: alldata[i].detail[j].accountcode.split(":")[0],
						order: alldata[i].detail[j].order.split(":")[0],
						concept: alldata[i].detail[j].concept,
						servicemonth: alldata[i].detail[j].servicemonth,
						description: alldata[i].detail[j].description
					}

				}

				for (var k = 0; k < alldata[i].detailtax.length; k++) {
					t_taxes[k] =
					{
						taxcode : alldata[i].detailtax[k].taxcode,
						taxamount: alldata[i].detailtax[k].taxamount,
					}

				}
				
				t_invoice[i] = 
						{
							id_invoice2pay : alldata[i]._id,
							sap_id : "",
							supplier : alldata[i].supplier.split(":")[0],
							company :  alldata[i].company.split(":")[0],
							accountingdate: alldata[i].accountingdate,
							documentdate: alldata[i].documentdate,
							documenttype: alldata[i].documenttype.split(":")[0],
							documentnumber: alldata[i].documentnumber,
							currency: alldata[i].currency,
							netamountinvoice: alldata[i].netamountinvoice.split("$")[0],
							totaltax: alldata[i].totaltax.split("$")[0],
							totalinvoice: alldata[i].totalinvoice.split("$")[0],
							detail : [],
							taxes : []
						}

				//t_invoice[i].detail .push(t_detail)
				t_invoice[i].detail = t_detail;
				t_invoice[i].taxes = t_taxes;

			};

	//		res.json(output);

			var file = '/temp/testjson1.json'
			var obj = {name: 'JP'}
			 
			//jsonfile.writeFile(file, alldata, function (err) {
			jsonfile.writeFile(file, t_invoice, {spaces: 2}, function (err) {
			  console.error(err)
			})

			// Return all clients
			//console.log(output);
			res.json(t_invoice);
		});


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


				res.redirect('/userscecos');	 


	//			return res.redirect('/supplierinvoice');


			}
			else
			{
				console.log('Entro por Modificar..........')
				var tmp_id = req.body.id;
				console.log("---------------------------------: ");

				console.log("tmp_id: "+tmp_id);
				console.log("req.body.approver: "+req.body.approver);

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
	//                  get.userdm 
	//  ------------------------------------------------
		router.get('/userdm', function(req, res, next) 
		{
			//	Supplierinvoice.find( function(err, supplierinvoice) {
			//		console.log(supplierinvoice);		
			//		res.render('headers', { title: 'Facturas'});

			//        res.locals.typemenu = "TRUE";

			//		res.optionmenu = true;

				res.render('datamaster/userdm', { title: 'Usuarios Cuentas/Cecos'});
			//	});
		});	

	// -------------------------------------
	//      Get /userdm_insert
	// -------------------------------------	
		router.get('/userdm_insert', function(req, res, next) 
		{

			//var tmp_id = req.params.id;

			console.log("------------------------------: ");

			console.log("/userdm_insert/get 1: ");		

			res.render('datamaster/userdm_create', { title: 'Crear Usuario'});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});		

	// -------------------------------------
	//      post /userdm_insert
	// -------------------------------------	
		router.post('/userdm_insert', function(req, res, next) 
		{


	  		console.log('-----------------------------------------------');
	  		console.log('userdm_insert Post			   ---------------------');
	  		console.log('-----------------------------------------------');

	  		//console.log('post_query.cotcenter.length:',req.body.costcenter.length);

			var arecord = [];

			//  ----------------------------------------------------
			//  ---------------- inicio grabar resto del proceso

			arecord.push( 
					new User(
							{
								email: req.body.email,
								name: req.body.name,
								approver: req.body.approver,
								administrator : req.body.administrator,
								invoiceloader : req.body.invoiceloader								
							}));

			// ++++++++++++++++++++++
			// 		Agregar Cuentas
			var tdetail = [];
			if (Object.prototype.toString.call(req.body.accountcode) === '[object Array]')
			{
				console.log('Account - como array:');
				console.log('Account - req.body.req.body.accountcode.length:', req.body.accountcode.length);

				for (var i=0; i < req.body.accountcode.length; i++)
				{
	  				console.log('post_query.req.body.accountcode[i]:',req.body.accountcode[i]);
		 			tdetail = 
		  					{	
		  						account: req.body.accountcode[i]
		  					};
		  			arecord[0].accounts.push(tdetail);	    
				}  			
			}
			else
			{
				console.log('Account - plano:');			
	  			console.log('post_query.account:',req.body.accountcode);

	  			tdetail = 
	  					{	
	  						account: req.body.accountcode
	  					};
	  			arecord[0].accounts.push(tdetail);
			};				

			// +++++++++++++++++++++++++++
			// 		Agregar CostCenter
			var tdetail = [];
			if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
			{
				console.log('CostCenter - como array:');
				console.log('CostCenter - req.body.costcenter.length:', req.body.costcenter.length);

				for (var i=0; i < req.body.costcenter.length; i++)
				{
	  				console.log('post_query.req.body.costcenter[i]:',req.body.costcenter[i]);
		 			tdetail = 
		  					{	
		  						ceco: req.body.costcenter[i]
		  					};
		  			arecord[0].cecos.push(tdetail);			    
				}  			
			}
			else
			{
				console.log('CostCenter - plano:');			
	  			console.log('post_query.costcenter:',req.body.costcenter);

	  			tdetail = 
	  					{	
	  						ceco: req.body.costcenter
	  					};
	  			arecord[0].cecos.push(tdetail);
			};	

			// +++++++++++++++++++++++++++
			// 		Agregar FI orders
			var tdetail = [];
			if (Object.prototype.toString.call(req.body.fiorder) === '[object Array]')
			{
				console.log('fiorder - como array:');
				console.log('fiorder - req.body.fiorder.length:', req.body.fiorder.length);

				for (var i=0; i < req.body.fiorder.length; i++)
				{
	  				console.log('post_query.req.body.costcenter[i]:',req.body.fiorder[i]);
		 			tdetail = 
		  					{	
		  						fiorder: req.body.fiorder[i]
		  					};
		  			arecord[0].fi_orders.push(tdetail);			    
				}  			
			}
			else
			{
				if (req.body.fiorder)
				{
				console.log('fiorder - plano:');	
	  			console.log('post_query.fiorder:',req.body.fiorder);									
	  			console.log('post_query.fiorder.length:',req.body.fiorder.length);

	  			tdetail = 
	  					{	
	  						fiorder: req.body.fiorder
	  					};
	  			arecord[0].fi_orders.push(tdetail);
	  			}
			};	


			// +++++++++++++++++++++++++++
			// 		Grabar				
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


    	return res.render('datamaster/userdm', { title: 'Usuarios Cuentas/Cecos'});
	});



	//  ------------------------------------------------
	//            post.userdm_edit
	//  ------------------------------------------------
		router.post('/userdm_edit', function(req, res, next) 
		{
			var tmp_id = req.body.post_id;

			console.log('post /userdm_edit/tmp_id  ---------> ', tmp_id);

			User.findById(tmp_id, function(err, docs) 
			{
				console.log("post /userdm_edit/paso 1 en find");		
				console.log('Docs:', docs);
				console.log('docs.email:', docs.email);

				var results_mongodb = [];
				results_mongodb.push(docs);
				console.log('results_mongodb:', results_mongodb);
				console.log('results_mongodb[0].email:', results_mongodb[0].email);

				res.render(	'datamaster/userdm_edit', 
							{ title: 'Modificar Usuarios', 
							recdata: results_mongodb});

				//console.log("post /userdm_edit/paso 2 en despues del render");		
			});
		});



// -----------------------------------
//
//    POST userdm_editsave
//			* Grabar Modificaciones
//          * Eliminar Documento
//
// -----------------------------------

router.post('/userdm_editsave', function(req, res, next) 

{
	console.log('En entro en /userdm_editsave ..........');

	var action_returned = req.body.returnaction;
	console.log('action_returned....... :'+action_returned);

	if (action_returned == "Borrar")
	{
		//   -----------------------------------------------------
		//
		//            Borrar SupplierInvoice
		//
		//   -----------------------------------------------------
		console.log('/userdm_editsave Entro por borrar. usuario .........');
		console.log("----------------------------------------------------: ");
 		
		var temp_id = req.body.id;
		console.log("get /supplierInvoiceDelete/req.body.id : "+req.body.id);		

		console.log("get /supplierInvoiceDelete/temp_id : "+temp_id);



		// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
		// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

		console.log("Delete  --------------------------------: ");

		//User.findOneAndDelete({_id: temp_id}, function (err, todo) 
		console.log("antes de FindByIdAndRemove --------------------------------: ");		
		//User.findByIdAndRemove({temp_id}, function (err, todo) 
		User.findOneAndRemove({_id: temp_id}, function (err, todo)
		{  
		    var response = {
		        message: "user successfully deleted",
		        User: temp_id
		    };
			console.log("dentro de FindByIdAndRemove todo : "+todo);	
			console.log("dentro de FindByIdAndRemove error: "+err);		

		    //res.send(response);
		});

		console.log("after Delete  --------------------------------: ");

		 // /supplierInvoiceInsertreq.method = 'GET'			
		// res.redirect('/');
		console.log("after redirect --------------------------------: ");		 
		 //res.send({redirect: '/userdm'});
		//res.render('process/supplierinvoice_new', { title: 'Facturas'});


	}
	else
	{

  		console.log('-----------------------------------------------');
  		console.log('userdm_editsave - Modificar          ----------');
  		console.log('-----------------------------------------------');
		console.log('req.body.administrator:'+req.body.administrator);
		//		var tmp_id = req.params.id;
		var tmp_id = req.body.id;
		var tmp_linenumber = req.body.linenumber;

		console.log("tmp_id: "+tmp_id);
		var condition = {"_id": tmp_id}
		console.log("req.body.approver: ", req.body.approver);


		// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
		User.update(condition, 
					{ $set: { accounts: [], cecos : [], fi_orders : [] }}, 
					function(err, affected)
		{

			User.find(condition, function (err, doc) 
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

						doc[0].email = req.body.email;
						doc[0].name = req.body.name;
						doc[0].approver = req.body.approver;
						doc[0].administrator = req.body.administrator;
						doc[0].invoiceloader = req.body.invoiceloader;

						// ++++++++++++++++++++++
						// 		Agregar Cuentas
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.accountcode) === '[object Array]')
						{
							console.log('Account - como array:');
							console.log('Account - req.body.req.body.accountcode.length:', req.body.accountcode.length);

							for (var i=0; i < req.body.accountcode.length; i++)
							{
				  				console.log('post_query.req.body.accountcode[i]:',req.body.accountcode[i]);
					 			tdetail = 
					  					{	
					  						account: req.body.accountcode[i]
					  					};
					  			doc[0].accounts.push(tdetail);	    
							}  			
						}
						else
						{
							console.log('Account - plano:',req.body);			
				  			console.log('post_query.account:',req.body.accountcode);

				  			tdetail = 
				  					{	
				  						account: req.body.accountcode
				  					};
				  			doc[0].accounts.push(tdetail);
						};				

						// +++++++++++++++++++++++++++
						// 		Agregar CostCenter
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.costcenter) === '[object Array]')
						{
							console.log('CostCenter - como array:');
							console.log('CostCenter - req.body.costcenter.length:', req.body.costcenter.length);

							for (var i=0; i < req.body.costcenter.length; i++)
							{
				  				console.log('post_query.req.body.costcenter[i]:',req.body.costcenter[i]);
					 			tdetail = 
					  					{	
					  						ceco: req.body.costcenter[i]
					  					};
					  			doc[0].cecos.push(tdetail);			    
							}  			
						}
						else
						{
							if (req.body.costcenter)
							{
							console.log('CostCenter - plano:');	
				  			console.log('post_query.costcenter:',req.body.costcenter);									
				  			console.log('post_query.costcenter.length:',req.body.costcenter.length);

				  			tdetail = 
				  					{	
				  						ceco: req.body.costcenter
				  					};
				  			doc[0].cecos.push(tdetail);
				  			}
						};	

						// +++++++++++++++++++++++++++
						// 		Agregar FI orders
						var tdetail = [];
						if (Object.prototype.toString.call(req.body.fiorder) === '[object Array]')
						{
							console.log('fiorder - como array:');
							console.log('fiorder - req.body.fiorder.length:', req.body.fiorder.length);

							for (var i=0; i < req.body.fiorder.length; i++)
							{
				  				console.log('post_query.req.body.costcenter[i]:',req.body.fiorder[i]);
					 			tdetail = 
					  					{	
					  						fiorder: req.body.fiorder[i]
					  					};
					  			doc[0].fi_orders.push(tdetail);			    
							}  			
						}
						else
						{
							if (req.body.fiorder)
							{
							console.log('fiorder - plano:');	
				  			console.log('post_query.fiorder:',req.body.fiorder);									
				  			console.log('post_query.fiorder.length:',req.body.fiorder.length);

				  			tdetail = 
				  					{	
				  						fiorder: req.body.fiorder
				  					};
				  			doc[0].fi_orders.push(tdetail);
				  			}
						};	

						//++++++++++++++++++++++++++++
						//   Grabar modificaciones
						doc[0].save(function(err, result) 
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
			    	} // if (doc.length > 0)											
			    } //else if (err) 
			}); // User.find(condition, function (err, doc) 
		}); //User.update(condition, 
			//		{ $set: { detail: [], detailtax : [] }}, 
			//		function(err, affected)

	} 
    return res.render('datamaster/userdm', { title: 'Usuarios Cuentas/Cecos'}); 
});


	//  ***********************************************
	//      				CONCEPTS 
	//  ***********************************************
		//  ------------------------------------------------
		//                  get.Concepts
		//              llamado desde el menu
		//  ------------------------------------------------
			router.get('/concept', function(req, res, next) 
			{
				//	Supplierinvoice.find( function(err, supplierinvoice) {
				//		console.log(supplierinvoice);		
				//		res.render('headers', { title: 'Facturas'});

				//        res.locals.typemenu = "TRUE";

				//		res.optionmenu = true;

					res.render('datamaster/concepts', { title: 'Conceptos'});
				//	});
			});	



		// -------------------------------------
		//      	get /api/concepts
		//        llamado desde el datatable
		// -------------------------------------	
			router.get('/api/concepts', function(req, res, next) 
			{
				console.log('Entro en /api/concepts.........');
			   	Concepts.find({ concept: { $exists: true } } , function(err, alldata)
				{
					console.log('Entro en /api/concept .. dentro de find');

					if (err)
					{
						console.log('api-error:',err);
						res.send(err);

					}

					console.log('alldata.size:',alldata.length);
					var totrec = alldata.length;
				    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
				    output["data"] = alldata;

					res.json(output);
				});

			});

		// -------------------------------------
		//      Get /concept_insert
		//    llamado desde concepts.hbs
		// -------------------------------------	
			router.get('/concept_insert', function(req, res, next) 
			{

				res.render('datamaster/concept_create', { title: 'Crear Concepto'});

			});

		// -------------------------------------
		//      post /concept_insert
		//    llamado desde concept_create.hbs		
		// -------------------------------------	
			router.post('/concept_insert', function(req, res, next) 
			{
				// var post_data = req.body;
		  		// console.log('post_data:',post_data);

				var arecord = [];

				arecord.push( 
					new Concepts(
						{
							concept: req.body.concept
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
				return res.redirect('/concept');

			});

		//  ------------------------------------------------
		//            post.concept_detail 
		//  ------------------------------------------------
			router.post('/concept_detail', function(req, res, next) 
			{
				var tmp_id = req.body.post_id;

				console.log('post /approver_detail/tmp_id  ---------> ', tmp_id);

				Concepts.findById(tmp_id, function(err, docs) 
				{
					console.log("post /concept_detail/paso 1 en Concept.find");		
					console.log('Docs:', docs);

					var results_mongodb = [];
					results_mongodb.push(docs);
					console.log('results_mongodb:', results_mongodb);
					console.log('results_mongodb[0].approver_code:', results_mongodb[0].concept);

					res.render(	'datamaster/concept_edit', 
								{ title: 'Modificar Conceptos', 
								recdata: docs});
				});
			});

		//  -----------------------------------
		//
		//    POST concept_edit_post
		//			* Grabar Modificaciones
		//          * Eliminar Documento
		//
		//  -----------------------------------
			router.post('/concept_edit_post', function(req, res, next) 

			{

				var action_returned = req.body.returnaction;
				console.log('action_returned....... :'+action_returned);		
				if (action_returned == "Borrar")
				{
					//   -----------------------------------------------------
					//
					//            Borrar Concepts
					//
					//   -----------------------------------------------------
					console.log('Entro por borrar..........');
					console.log("---------------------------------: ");
			 		
					var temp_id = req.body.id;
					console.log("get /ConceptDelete/req.body.id : "+req.body.id);		

					console.log("get /ConceptDelete/temp_id : "+temp_id);



					// collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
					// Supplierinvoice.remove({_id: temp_id},{justOne: true,});

					console.log("Delete  --------------------------------: ");

			        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
					Concepts.findOneAndRemove({_id: temp_id}, function(err, result) 
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

					res.redirect('/concept');

				}
				else
				{
					console.log('Entro por Modificar..........')
					var tmp_id = req.body.id;
					console.log("---------------------------------: ");

					console.log("tmp_id: "+tmp_id);

					console.log('Antes -> findByIdAndUpdate  _id:',tmp_id);			

					Concepts.findById(tmp_id, function (err, doc) {  
					    // Handle any possible database errors
					    if (err) {
					        res.status(500).send(err);
					    } else {
					        // Update each attribute with any possible attribute that may have been submitted in the body of the request
					        // If that attribute isn't in the request body, default back to whatever it was before.
					        doc.concept = req.body.concept || doc.concept;

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
					res.redirect('/concept');	 
				}    

			});







	//  ***********************************************
	//      				APPROVERS 
	//  ***********************************************


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

		        //Approver.remove({_id: temp_id}, {justOne: true, safe: true}, 
				Approver.findOneAndRemove({_id: temp_id}, function(err, result) 
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

				res.redirect('/approver');	 

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

		        Approvallevels.findOneAndRemove({_id: temp_id},
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

				res.redirect('/approvallevels');	 

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

		        Approvalscheme.findOneAndRemove({_id: temp_id},
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
			}    
			res.redirect('/approvalscheme');

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
// 		       Api UserAccounts
//  -----------------------------------
router.get('/api/restUserAccount', function(req, res)
{
	console.log('/api/restUserAccount--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, accounts:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_accounts', docs.accounts);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.accounts.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.accounts;
		res.json(output);

	});
});

//  -----------------------------------
// 		       Api restUserCecos
//  -----------------------------------
router.get('/api/restUserCecos', function(req, res)
{
	console.log('/api/restUserCecos--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, cecos:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_cecos', docs.cecos);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.cecos.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.cecos;
		res.json(output);

	});
});


//  -----------------------------------
// 		       Api UserFiorders
//  -----------------------------------
router.get('/api/restUserFiorders', function(req, res)
{
	console.log('/api/restUserFiorders--------------');
	console.log('user_id', req.session.passport.user);
	User.findById(req.session.passport.user, {email:1, fi_orders:1}, function(err, docs) 
	{
		if (err)
		{
			res.send(err);
		}
		console.log('docuser_fi_orders', docs.fi_orders);				
		// console.log('alldata.size:',alldata.length);
		var totrec = docs.fi_orders.length;
		// console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = docs.fi_orders;
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

// Conceptos

router.get('/api/restGetConcepts', function(req, res)
{

   	Concepts.find( { concept: { $exists: true } }, function(err, alldata) 
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
		var totrec = alldata ? alldata.length:0;
		//console.log('totrec :',totrec);
	    var output = { "iTotalRecords" : totrec, "iTotalDisplayRecords" : 10 };
	    output["data"] = alldata ? alldata: 0;
		// console.log('totrec :',totrec);
		// console.log('output :',output);

		res.json(output);
	});


});


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
// ---------------------------------------------------------------------------------------- //
//
//                                     SupplierInvoice
//
// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //




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
		//console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


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

			res.render('process/supplierinvoice_detail_edit', { title: 'Modificar Factura', 
																recdata: results_mongodb, 
																xsup: results_mongodb.supplier});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});




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

		Supplierinvoice.findOneAndRemove({_id: temp_id}, function (err, result)

        //Supplierinvoice.remove({_id: temp_id}, {justOne: true, safe: true}, 
        //						function(err, result) 
        {
            if (err) 
            {
				console.log("Error  --------------------------------: ");
                console.log(err);
                // throw err;
            }
            if (result) 
            {
				console.log("Result   --------------------------------: ");
	            console.log(result);
        	}
        });

		console.log("after Delete  --------------------------------: ");


	}
	else
	{

  		console.log('-----------------------------------------------');
  		console.log('supplierInvoicePostEdit - Modificar  ----------');
  		console.log('-----------------------------------------------');


		console.log('req.body.costcenterice ....... :'+req.body.costcenter);	
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
  		console.log('req.body.inputimage........... : '+ req.body.inputimage);
 		console.log('req.body.imagenbit............ : '+ req.body.imagenbit);

 		var t_release1 = ((req.body.approver1.length > 0) ? "N" : "#");
 		var t_release2 = ((req.body.approver2.length > 0) ? "N" : "#");
 		var t_release3 = ((req.body.approver3.length > 0) ? "N" : "#");
 		var t_release4 = ((req.body.approver4.length > 0) ? "N" : "#");
 		var t_release5 = ((req.body.approver5.length > 0) ? "N" : "#");



		var t_aplevel = "";
		var t_approver1 = "";
		var t_approver2 = "";
		var t_approver3 = "";
		var t_approver4 = "";
		var t_approver5 = "";


		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso


			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}


			// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
			Supplierinvoice.update(condition, 
									{ $set: { detail: [], detailtax : [] }}, 
									function(err, affected)
			{

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

							doc[0].supplier = req.body.supplier;
							doc[0].company = req.body.company;
							doc[0].accountingdate = req.body.accountingdate;
							doc[0].documentdate = req.body.documentdate;
							doc[0].documenttype = req.body.tpdoc;
							doc[0].documentnumber = req.body.numdoc;
							doc[0].currency = req.body.currency;
							doc[0].netamountinvoice = req.body.amountinvoice;
							doc[0].totaltax = req.body.totaltax;
							doc[0].totalinvoice = req.body.totalinvoice;
							doc[0].aplevel = req.body.aplevel;
							doc[0].approver1 = req.body.approver1;
							doc[0].approver1 = t_release1;
							doc[0].approver2 = req.body.approver2;	
							doc[0].approver2 = t_release2;
							doc[0].approver3 = req.body.approver3;
							doc[0].approver3 = t_release3;
							doc[0].approver4 = req.body.approver4;
							doc[0].approver4 = t_release4;
							doc[0].approver5 = req.body.approver5;
							doc[0].approver5 = t_release5;
							doc[0].exchangerate = req.body.exchangerate;
							doc[0].approver_total = "N";
/*							
							if (req.body.inputimage.length > 0)
							{
								//doc[0].imgfact.data = fs.readFileSync(req.body.inputimage);
								doc[0].imgfact.data = req.body.imagenbit
								doc[0].img.contentType = 'image/png';
							}
*/							
							var adetail = [];
							// ++++++++++++++++++++++
							// 		Agregar detalle
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
					  			doc[0].detail.push(adetail);
							};

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
						  			doc[0].detailtax.push(tdetail);			    
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
					  			doc[0].detailtax.push(tdetail);
							};				

							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									invoicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
							//  ----------------fin grabar resto del proceso
							//  ----------------------------------------------------
				    	} // if (doc.length > 0)											
				    } //else if (err) 
				}); // Supplierinvoice.find(condition, function (err, doc) 
			}); // Supplierinvoice.update(condition, 
				//					{ $set: { detail: [], detailtax : [] }}, 
				//					function(err, affected)

		}

		console.log("antes de return  --------------------------------: ");
		return res.render('process/supplierinvoice', { title: 'Facturas'});
		console.log("despues de return --------------------------------: ");
		

	});



router.post('/supplierInvoicePostEdit_admin', function(req, res, next) 

{
	var action_returned = req.body.returnaction;
	console.log('/supplierInvoicePostEdit_admin -- action_returned....... :'+action_returned);		

	{

  		console.log('-----------------------------------------------');
  		console.log('supplierInvoicePostEdit - Modificar  ----------');
  		console.log('-----------------------------------------------');


		console.log('req.body.costcenterice ....... :'+req.body.costcenter);	
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
  		console.log('req.body.inputimage........... : '+ req.body.inputimage);
 		console.log('req.body.imagenbit............ : '+ req.body.imagenbit);

 		var t_release1 = ((req.body.approver1.length > 0) ? "N" : "#");
 		var t_release2 = ((req.body.approver2.length > 0) ? "N" : "#");
 		var t_release3 = ((req.body.approver3.length > 0) ? "N" : "#");
 		var t_release4 = ((req.body.approver4.length > 0) ? "N" : "#");
 		var t_release5 = ((req.body.approver5.length > 0) ? "N" : "#");



		var t_aplevel = "";
		var t_approver1 = "";
		var t_approver2 = "";
		var t_approver3 = "";
		var t_approver4 = "";
		var t_approver5 = "";


		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso


			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}


			// Blanquea todos los subdocumentos para evitar actualizar 1 a 1
			Supplierinvoice.update(condition, 
									{ $set: { detail: [], detailtax : [] }}, 
									function(err, affected)
			{

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

							doc[0].supplier = req.body.supplier;
							doc[0].company = req.body.company;
							doc[0].accountingdate = req.body.accountingdate;
							doc[0].documentdate = req.body.documentdate;
							doc[0].documenttype = req.body.tpdoc;
							doc[0].documentnumber = req.body.numdoc;
							doc[0].currency = req.body.currency;
							doc[0].netamountinvoice = req.body.amountinvoice;
							doc[0].totaltax = req.body.totaltax;
							doc[0].totalinvoice = req.body.totalinvoice;
							doc[0].aplevel = req.body.aplevel;
							doc[0].approver1 = req.body.approver1;
							doc[0].approver1 = t_release1;
							doc[0].approver2 = req.body.approver2;	
							doc[0].approver2 = t_release2;
							doc[0].approver3 = req.body.approver3;
							doc[0].approver3 = t_release3;
							doc[0].approver4 = req.body.approver4;
							doc[0].approver4 = t_release4;
							doc[0].approver5 = req.body.approver5;
							doc[0].approver5 = t_release5;
							doc[0].exchangerate = req.body.exchangerate;
							doc[0].approver_total = "N";
							doc[0].createdby = req.body.createdby;
/*							
							if (req.body.inputimage.length > 0)
							{
								//doc[0].imgfact.data = fs.readFileSync(req.body.inputimage);
								doc[0].imgfact.data = req.body.imagenbit
								doc[0].img.contentType = 'image/png';
							}
*/							
							var adetail = [];
							// ++++++++++++++++++++++
							// 		Agregar detalle
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
					  			doc[0].detail.push(adetail);
							};

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
						  			doc[0].detailtax.push(tdetail);			    
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
					  			doc[0].detailtax.push(tdetail);
							};				

							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									invoicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
							//  ----------------fin grabar resto del proceso
							//  ----------------------------------------------------
				    	} // if (doc.length > 0)											
				    } //else if (err) 
				}); // Supplierinvoice.find(condition, function (err, doc) 
			}); // Supplierinvoice.update(condition, 
				//					{ $set: { detail: [], detailtax : [] }}, 
				//					function(err, affected)

		}

		console.log("antes de return  --------------------------------: ");
		return res.render('process/supplierinvoice_admin', { title: 'Facturas'});
		console.log("despues de return --------------------------------: ");
		

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

			res.render('process/supplierinvoice', { title: 'Facturas'});

	//	});
	});



	// -------------------------------------
	//      Get supplierInvoice_all
	// -------------------------------------	
	router.get('/supplierInvoice_all', function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice_all', { title: 'Facturas'});

	//	});
	});

	// -------------------------------------
	//      Get supplierInvoice_edit_admin
	// -------------------------------------	
	router.get('/supplierInvoice_edit_admin', function(req, res, next) 
	{
	//	Supplierinvoice.find( function(err, supplierinvoice) {
	//		console.log(supplierinvoice);		
	//		res.render('headers', { title: 'Facturas'});

	//        res.locals.typemenu = "TRUE";

	//		res.optionmenu = true;

			res.render('process/supplierinvoice_admin', { title: 'Facturas Superusuario'});

	//	});
	});


	// -------------------------------------
	//      Get supplierInvoice2release
	// -------------------------------------	
	router.get('/supplierInvoice2release', function(req, res, next) 
	{
		console.log('dentro de get process/supplierinvoice2release')
		res.render('process/invoice2release', { title: 'Facturas'});
	});



	// -------------------------------------------
	//      Post /supplierInvoice2release_view
	// -------------------------------------------	
		router.post('/supplierInvoice2release_view', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierInvoice2release_view/post_id : "+temp_id);
		console.log("post /supplierInvoice2release_view -req.user.username : "+req.user.username);
		console.log("post /supplierInvoice2release_view - req.session: "+req.session);
		console.log("post /supplierInvoice2release_view - req.session.passport.user: "+req.session.passport);


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

			res.render('process/invoice2release_detail', { title: 'Liberar Factura', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});



// -------------------------------------------------------------------------
//
//     Post /supplierInvoice2release_approval
//			* Grabar Modificaciones description
//
// -------------------------------------------------------------------------
router.post('/supplierInvoice2release_approval', function(req, res, next) 

{

	console.log('-----------------------------------------------');
	console.log('supplierInvoice2release_approval     ----------');
	console.log('-----------------------------------------------');	

	var action_returned = req.body.returnaction;
	console.log('action_returned....... :'+action_returned);		
	if (action_returned == "Liberar")
	{


  		console.log('-----------------------------------------------');
  		console.log('ApprobarInvoice2release_approval     ----------');
  		console.log('-----------------------------------------------');


		console.log('req.body.costcenterice ....... :'+req.body.costcenter);	
		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
		//dateFormat(new Date(), 'm-d-Y h:i:s');
		var t_releasedate = new Date();
		console.log('releasedate............ :'+t_releasedate);



		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso

		console.log('/api/restUserAccount--------------');
		console.log('user_id', req.session.passport.user);
		User.findById(req.session.passport.user, {email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}



			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			Supplierinvoice.find(condition, function (err, doc) 
			{  
				console.log("err....",err);
				//console.log("doc...."+doc);
			    // Handle any possible database errors
			    if (err) 
			    {
			    	console.log("No existe el Registro");
			        res.status(500).send(err);
			    } else 
			    {
			    	if (doc.length > 0) /// existe el doc y lo actualiza
			    	{

			    		if (doc[0].release1 == "N")
			    		{
			    			doc[0].approver1date = t_releasedate;
							doc[0].approver1user = docs.email;
							doc[0].release1 = "Y";
			    		}
			    		else
			    		{
				    		if (doc[0].release2 == "N")
				    		{
				    			doc[0].approver2date = t_releasedate;
								doc[0].approver2user = docs.email;
								doc[0].release2 = "Y";
				    		}
				    		else
				    		{
					    		if (doc[0].release3 == "N")
					    		{
					    			doc[0].approver3date = t_releasedate;
									doc[0].approver3user = docs.email;
									doc[0].release3 = "Y";
					    		}
					    		else
					    		{
						    		if (doc[0].release4 == "N")
						    		{
						    			doc[0].approver4date = t_releasedate;
										doc[0].approver4user = docs.email;
										doc[0].release4 = "Y";
						    		}
						    		else
						    		{
							    		if (doc[0].release5 == "N")
							    		{
							    			doc[0].approver5date = t_releasedate;
											doc[0].approver5user = docs.email;
											doc[0].release5 = "Y";
							    		}
						    		}
					    		}
				    		}
			    		}
			    		if ((doc[0].release1 == "Y" || doc[0].release1 =="#") && 
			    			(doc[0].release2 == "Y" || doc[0].release2 =="#") && 
			    			(doc[0].release3 == "Y" || doc[0].release3 =="#") && 
			    			(doc[0].release4 == "Y" || doc[0].release4 =="#") && 
			    			(doc[0].release5 == "Y" || doc[0].release5 =="#"))
			    		{
			    			doc[0].approver_total = "Y";
			    		}


						//++++++++++++++++++++++++++++
						//   Grabar modificaciones
						doc[0].save(function(err, result) 
						{
							console.log( "Grabando:", result, err );
							if(err) {
							    console.log("Error .." + err);
							}
							else								
							{
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
						 	}
						}); 
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
			    	} // if (doc.length > 0)											
			    } //else if (err) 
			}); // Supplierinvoice.find(condition, function (err, doc) 
		}); // User.find(condition, function (err, doc) 
	}
	/*
	else
	{
		console.log('/api/restUserAccount--------------');
		console.log('user_id', req.session.passport.user);
		User.findById(req.session.passport.user, {email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}

			//		var tmp_id = req.params.id;
			var tmp_id = req.body.id;
			var tmp_linenumber = req.body.linenumber;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

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
		    			doc[0].approver1date = '';
						doc[0].approver1user = '';
						doc[0].release1 = "N";
		    			doc[0].approver2date = '';
						doc[0].approver2user = '';
						doc[0].release2 = "N";
		    			doc[0].approver3date = '';
						doc[0].approver3user = '';
						doc[0].release3 = "N";
		    			doc[0].approver4date = '';
						doc[0].approver4user = '';
						doc[0].release4 = "N";
		    			doc[0].approver5date = '';
						doc[0].approver5user = '';
						doc[0].release5 = "N";

						//++++++++++++++++++++++++++++
						//   Grabar modificaciones
						doc[0].save(function(err, result) 
						{
							console.log( "Grabando:", result, err );
							if(err) {
							    console.log("Error .." + err);
							}
							else
							{
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
						 	}
						}); 
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
			    	} // if (doc.length > 0)											
			    } //else if (err) 
			}); // Supplierinvoice.find(condition, function (err, doc) 
		});			
		
	} // if action
		*/
	
	return res.render('process/invoice2release', { title: 'Facturas'});
		
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
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


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

			res.render('process/supplierinvoice_detail_edit', { title: 'Modificar Factura', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});


	// -------------------------------------
	//      Post /supplierinvoice_view
	// -------------------------------------	
		router.post('/supplierinvoice_view_adm', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


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

			res.render('process/supplierinvoice_detail_edit_especial_adm', { title: 'Modificar Factura (Superusuario', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

			//  	return res.redirect('/process/supplierinvoice_edit');

		});


	});

	// -------------------------------------
	//      Post /supplierinvoice_view_all
	// -------------------------------------	
		router.post('/supplierinvoice_view_all', function(req, res, next) 
		{

		var temp_id = req.body.post_id;

		//		tmp_id = temp_id.split(":")[0];
		console.log("---------------------------------: ");

		// aquiestoy
		console.log("post /supplierinvoice_view/post_id : "+temp_id);
		console.log("post /supplierinvoice_view -req.user.username : "+req.user.username);
		console.log("post /supplierinvoice_view - req.session: "+req.session);
		console.log("post /supplierinvoice_view - req.session.passport.user: "+req.session.passport);


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

			res.render('process/supplierinvoice_detail_view', { title: 'Visualizar Factura', 
																recdata: results_mongodb
																//, 
																//xsup: results_mongodb.supplier,
																//user_id: req.user.username
																});

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

		console.log('req.body.currency .... ....... :'+req.body.currency);
		console.log('req.body.exchangerate. ....... :'+req.body.exchangerate);		
		console.log('req.body.amountinvoice ....... :'+req.body.amountinvoice);
		console.log('req.body.aplevel.............. :'+req.body.aplevel);
		console.log('req.body.approver1............ :'+req.body.approver1);
		console.log('req.body.approver2............ :'+req.body.approver2);
		console.log('req.body.approver3............ :'+req.body.approver3);		
		console.log('req.body.approver4............ :'+req.body.approver4);
		console.log('req.body.approver5............ :'+req.body.approver5);
  		console.log('req.body.inputimage........... : '+ req.body.inputimage);
 		console.log('req.body.imagenbit............ : '+ req.body.imagenbit);

 		var t_release1 = ((req.body.approver1.length > 0) ? "N" : "#");
 		var t_release2 = ((req.body.approver2.length > 0) ? "N" : "#");
 		var t_release3 = ((req.body.approver3.length > 0) ? "N" : "#");
 		var t_release4 = ((req.body.approver4.length > 0) ? "N" : "#");
 		var t_release5 = ((req.body.approver5.length > 0) ? "N" : "#");

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

		//  ----------------------------------------------------
		//  ---------------- Buscar email usuario
		var t_email = "SIN EMAIL"
		User.findById(req.session.passport.user, {id:1, email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}
			console.log("docs.id:",docs.id);
			console.log("docs.email:",docs.email);			
			t_email = docs.email;
			//console.log("docs.approver",current_approver);
			//console.log("docs.approver",docs[0].approver);

		//  ----------------------------------------------------
		//  ---------------- inicio grabar resto del proceso

		arecord.push( 
			new Supplierinvoice(
				{
					supplier: req.body.supplier,
					company: req.body.company,
					accountingdate: req.body.accountingdate,
					documentdate: req.body.documentdate,
					documenttype: req.body.tpdoc,
					documentnumber: req.body.numdoc,
					currency: req.body.currency,
					netamountinvoice: req.body.amountinvoice,
					totaltax: req.body.totaltax,
					totalinvoice: req.body.totalinvoice,
					approver_total: "N",
					aplevel: req.body.aplevel,
					approver1: req.body.approver1,
					approver1date: "",
					approver1user: "",
					release1 : t_release1,	
					approver2: req.body.approver2,
					approver2date: "",
					approver2user: "",
					release2 : t_release2,
					approver3: req.body.approver3,
					approver3date: "",
					approver3user: "",
					release3 : t_release3,
					approver4: req.body.approver4,
					approver4date: "",
					approver4user: "",
					release4 : t_release4,
					approver5: req.body.approver5,
					approver5date: "",
					approver5user: "",
					release5 : t_release5,
					createdby: t_email,
					exchangerate: req.body.exchangerate,
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

		}); // user.find()

		//  ----------------fin grabar resto del proceso
		//  ----------------------------------------------------

    
		res.redirect('/supplierInvoice_Pending');

	});





	// -------------------------------------
	//      post /Supplier Invoice Insertbackup
	// -------------------------------------	
	router.post('/supplierInvoiceInsertbackup', function(req, res, next) 
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
										company: req.body.company,
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
										approver1date: "",
										approver1user: "",
										approver2: t_approver2,
										approver2date: "",
										approver2user: "",										
										approver3: t_approver3,
										approver3date: "",
										approver3user: "",										
										approver4: t_approver4,
										approver4date: "",
										approver4user: "",
										approver5: t_approver5,
										approver5date: "",
										approver5user: "",
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

    
		res.redirect('/supplierInvoice_Pending');

	});

	// ******************************************************
	//
	//      	API's Datamaestra
	//
	// ******************************************************


	// -----------------------------------
	//
	//    API exist_approvalschema
	//
	// -----------------------------------
		router.get('/api/exist_approvalschema', function(req, res, next) 

		{
			var action_returned = req.body.returnaction;
			console.log('invpice....... :'+action_returned);	

			var output = { "error" : true};



	  		console.log('-----------------------------------------------');
	  		console.log('/api/exist_approvalschema            ----------');
	  		console.log('-----------------------------------------------');

			console.log('req.query.............. ....... :'+req.query);
			console.log('req.query.costcenterice ....... :'+req.query.costcenter);	
			console.log('req.query.currency .... ....... :'+req.query.currency);
			console.log('req.query.amountinvoice ....... :'+req.query.amountinvoice);

			

			// +++++++++++++++++++++++++++++++++
			//    Buscar nivel de aprobación

			var t_aplevel = "";
			var t_approver1 = "";
			var t_approver2 = "";
			var t_approver3 = "";
			var t_approver4 = "";
			var t_approver5 = "";
			exist_approvalscheme = false;

	        console.log('Antes Approvallevels - req.body.amountinvoice:', req.query.amountinvoice);
	        console.log('Antes Approvallevels - typeof req.body.amountinvoice:', typeof req.query.amountinvoice);
	        var amountinvoice_number = Number(req.query.amountinvoice);
	        console.log('Antes Approvallevels - amountinvoice_number:', amountinvoice_number);
	        console.log('Antes Approvallevels - typeof amountinvoice_number:', typeof amountinvoice_number);


	        console.log('Antes Approvallevels - req.body.currency:', req.query.currency);

	        /*  logica en MongoShell

				db.approvallevels.aggregate([
						{ $match: {
							$and: [	{valmin : {$lte: 500 }},
								{valmax : {$gte: 500 }}, 
								{currency : {$eq: "ARS"}}]
						}},
						{ $lookup: {
								from : "approvalschemes",
								localField: "aplevel",
								foreignField: "aplevel",
								as: "approvationfound"
							 }
						},
						{ $project: { "approvationfound": 
								{$filter: 
									{ input: "$approvationfound",
								          as: "approvalscheme",
									  cond: { $eq: [ "$$approvalscheme.costcenter", "BLOO9000:ACCOUNTING" ] }
									}
								}
							     }
						}
				])

				*/


          	console.log('Approvallevels - req.query.costcenter  :',req.query.costcenter);
		    var t_pos = req.query.costcenter.indexOf(':');
		    console.log('Approvallevels - t_pos :', t_pos);
            var t_costcenter = req.query.costcenter.slice(0,t_pos).trim();

            console.log('Approvallevels - req.query.costcenter.slice(0,t_pos).trim() :', t_costcenter );

			/*	
			Approvallevels.find({$and: [ 	{valmin : {$lte: req.query.amountinvoice }}, 
											{valmax : {$gte: req.query.amountinvoice }}, 
											{currency : {$eq: req.query.currency}} 
										]} 
			*/
/*
			Approvallevels.aggregate(
					[
						{ "$match" : 
							{
								"$and": [	
										{"valmin" : {"$lte": req.query.amountinvoice }},
										{"valmax" : {"$gte": req.query.amountinvoice }}, 
										{"currency" : {"$eq": req.query.currency}}
									  ]
							}
						},
						{ "$lookup": 
							{
								from : 'approvalschemes',
								localField: 'aplevel',
								foreignField: 'aplevel',
								as: 'approvationfound'
							}
						},
						//{ $project: { "approvationfound": 
						{ "$project": 
							{  
								"aplevel" : "$aplevel ",
								"approvationfound" : 
								{
									"$filter": 
										{ 
											"input": "$approvationfound",
								        	"as": "approvalscheme",
									  		"cond": 
									  			{ 
									  				"$eq": [ "$$approvalscheme.costcenter", req.query.costcenter ] 
									  				//"$eq": [ "$$approvalscheme.costcenter", new RegExp(t_costcenter) ] 
									  				//"$in": ["$$approvalscheme.costcenter", t_costcenter]
									  			}
										}									
								}
							}
						}
				],

*/

			Approvallevels.aggregate(
					[
						{ "$match" : 
							{
								$and: [	
										{"valmin" : {$lte: amountinvoice_number }},
										{"valmax" : {$gt: amountinvoice_number }}, 
										{"currency" : {$eq: req.query.currency}}
										//,
										//{"costcenter" :{$eq: new RegExp(t_costcenter) }}
									  ]
							}
						},
						
						{ "$lookup": 
							{
								from : 'approvalschemes',
								localField: 'aplevel',
								foreignField: 'aplevel',
								as: 'approvationfound'
							}
						},
//						{
//						    "$unwind": "$approvalscheme1"
//						},						
						//{ $project: { "approvationfound": 
						{ $project: 
							{  
								aplevel : 1,
								currency: 1,
								approver1 : "$approvationfound.approver1",
								approver2 : "$approvationfound.approver2",
								approver3 : "$approvationfound.approver3",
								approver4 : "$approvationfound.approver4",
								approver5 : "$approvationfound.approver5",
								costcenter : "$approvationfound.costcenter",
/*
								approvationfound : 
								{
									$filter: 
										{ 
											input: "$approvationfound",
								        	as: "approvalscheme1",
									  		cond: 
									  			{ 
									  				//"$eq": [ "$$approvalscheme1.costcenter", req.query.costcenter ] 
									  				//$in: [ new RegExp(t_costcenter), "$$approvalscheme1.costcenter" ] 
									  				//"$in": [ "$$approvalscheme1.costcenter", new RegExp() ] 
									  				//"$in": ["$$approvalscheme.costcenter", t_costcenter]
									  			}
										},

								},
								*/
								
							},

						}
				],
				function(err, docs)
			{

	            console.log("err:", err);
	            if (err)
	            {
					console.log('------------------> Error');
					console.log(err);
					var output = 
					{ 	"error" : true, "message" : err };
			    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
			    	res.json(output)
	            }
	            else
	            {

		            if (docs.length > 0)
		            //if (docs)
		            {
	//            		if (docs1.length > 0)
		            	console.log('Aggregation - docs :',docs);
	        			console.log('Approvalscheme - docs.length :',docs.length);
						console.log('Approvalscheme - docs[0].aplevel :', docs[0].aplevel);
						console.log('Approvalscheme - docs[0].aplevel :', docs[0].aplevel);
						console.log('Approvalscheme - docs[0].costcenter :', docs[0].costcenter);
						console.log('Approvalscheme - docs[0].costcenter.length :', docs[0].costcenter.length);
						if (docs[0].costcenter.length > 0)
						{
							for(var i = 0; i < docs[0].costcenter.length; i++) 
							{
								console.log("docs[0].costcenter["+i+"]: ",docs[0].costcenter[i], new RegExp(t_costcenter) );
								console.log(docs[0].costcenter[i].indexOf(t_costcenter));
							    if (docs[0].costcenter[i].indexOf(t_costcenter)>=0) 
							    {
							          console.log("se encuentra objeto!.", i);
					        			t_aplevel = docs[0].aplevel;
					        			t_approver1 = docs[0].approver1[i];
										t_approver2 = docs[0].approver2[i];
										t_approver3 = docs[0].approver3[i];
										t_approver4 = docs[0].approver4[i];
										t_approver5 = docs[0].approver5[i];

							        i=1000;
							    }
							}



							console.log('Approvalscheme - docs[0].costcenter.indexOf(t_costcenter) :', docs[0].costcenter.indexOf(t_costcenter));
							console.log('Approvalscheme - docs[0].costcenter.indexOf(new RegExp(t_costcenter)) :', docs[0].costcenter[0].indexOf(new RegExp(t_costcenter)));
							//console.log('Approvalscheme - docs[0].costcenter.indexOf(new RegExp(t_costcenter)) :', docs[1].costcenter[1].indexOf(new RegExp(t_costcenter)));

							console.log('Approvalscheme - docs[0].costcenter.indexOf(req.body.costcenter) :', docs[0].costcenter.indexOf(req.body.costcenter));




							//console.log('approvationfound :',approvationfound);

				            console.log('Approvallevels - err:', err);
				            /*
		        			t_aplevel = docs[0].aplevel;
		        			t_approver1 = docs[0].approver1;
							t_approver2 = docs[0].approver2;
							t_approver3 = docs[0].approver3;
							t_approver4 = docs[0].approver4;
							t_approver5 = docs[0].approver5;
							*/

							//  ----------------------------------------------------
							//  ---------------- inicio grabar resto del proceso

							console.log('Approvalscheme - t_aplevel :',t_aplevel);
							console.log('Approvalscheme - t_approver1  :',t_approver1 );
							console.log('Approvalscheme - t_approver2  :',t_approver2 );
							console.log('Approvalscheme - t_approver3  :',t_approver3 );
							console.log('Approvalscheme - t_approver4  :',t_approver4 );
							console.log('Approvalscheme - t_approver5  :',t_approver5 );

							console.log('------------------> Aprobó la validación')
							var output = 
							{ 	"error" : false, "message" : "Encontré esquema", "aplevel" : t_aplevel, 
								"approver1" : t_approver1, "approver2" : t_approver2, "approver3" : t_approver3,
								"approver4" : t_approver4, "approver5" : t_approver5 };
					    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
					    	res.json(output)
						}
						else
						{
							console.log('----------Index------> 2 Esquema sin Centro de Costo')
							var output = { "error" : true, "message" : "No puede grabar la factura. Esquema no tiene centro de costo" };
							console.log('-----Index Output------> :', output);
							res.json(output)
						}						
					}
					else
					{							
						console.log('----------Index------> 1 No existe esquema')
						var output = { "error" : true, "message" : "No puede grabar la factura. No tiene esquema definido" };
						console.log('-----Index Output------> :', output);
						res.json(output)
					}
				} 
			}); // Aggregation
		});


	// --------------------------------------------------
	//
	//    API exist_supplierinvoicenumber
	//
	// --------------------------------------------------
		router.get('/api/exist_supplierinvoicenumber', function(req, res, next) 

		{
			var action_returned = req.body.returnaction;
			console.log('invpice....... :'+action_returned);	

			var output = { "error" : true};



	  		console.log('---------------------------------------------------');
	  		console.log('/api/exist_supplierinvoicenumber         ----------');
	  		console.log('---------------------------------------------------');

			console.log('req.query.............. ....... :'+req.query);
			console.log('req.query.id........... ....... :'+req.query.id);			
			console.log('req.query.supplier..... ....... :'+req.query.supplier);	
			console.log('req.query.numdoc....... ....... :'+req.query.numdoc);
			console.log('req.query.crud_type.... ....... :'+req.query.crud_type);



			//Supplierinvoice.find({$and: [ 	{supplier : {$eq: req.query.supplier }}, 
			//								{documentnumber : {$eq: req.query.numdoc}} 
			//							]}
			Supplierinvoice.find({supplier : req.query.supplier, documentnumber : req.query.numdoc},
				function(err, docs)
				{

	            console.log("err:", err);
	            if (err)
	            {
					console.log('------------------> Error');
					console.log(err);
					var output = 
					{ 	"error" : true, "message" : err };
			    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
			    	res.json(output)
	            }
	            //else
	            //{
	            if (req.query.crud_type == "NEW" )
	            {
		        	if (docs.length > 0)
		        	{
						console.log('---NEW--------> Rechazada validación');		            	
		            	console.log('Factura Repetid ID Distintos - docs :',docs);
	        			console.log(' 						 docs.length :',docs.length);
						console.log('					docs[0].supplier :', docs[0].supplier);
						var output = { 	"error" : true, "message" : "Factura Repetida", 
										"documentdate" : docs[0].documentdate,
										"documenttype" : docs[0].documenttype,
										"documentnumber" : docs[0].documentnumber,
										"netamount" : docs[0].netamountinvoice
									 };
				    	res.json(output)

		        	}
		        	else
		        	{
						console.log('---NEW--------> Aprobada validación');		            	
		            	console.log('No Existe Facturas');
						var output = { 	"error" : false, "message" : "Factura No esta Repetida"};
			    		res.json(output)
		        	}

	            }
	            else
	            {
			        if (docs.length > 0)
			        {
			            if (docs[0]._id == req.query.id)
			            {
							console.log('-MODIFICACION-> Aprobada validación');		            	
			            	console.log('No Existe Facturas');
							var output = { 	"error" : false, "message" : "Factura No esta repetida (ID=)"};
				    		res.json(output);	
			            }
				        else
				        {
							console.log('-MODIFICACIÓN-> Rechazada validación');		            	
			            	console.log('Factura Repetid ID Distintos - docs :',docs);
		        			console.log('docs.length :',docs.length);
							console.log('docs[0].supplier :', docs[0].supplier);
			            	console.log('docs[0]._id:',docs[0]._id);
			            	console.log('req.query.id:',req.query.id);							
							var output = { 	"error" : true, "message" : "Factura Repetida", 
											"documentdate" : docs[0].documentdate,
											"documenttype" : docs[0].documenttype,
											"documentnumber" : docs[0].documentnumber,											
											"netamount" : docs[0].netamountinvoice
										 };			            	
						    	res.json(output);
						}
					}
					else
					{							
						console.log('-MODIFICACION-> Aprobada validación');		            	
		            	console.log('No Existe Facturas');
						var output = { 	"error" : false, "message" : "Factura No esta repetida (Length=0)"};
			    		res.json(output);	
					}
				}					
				//} 
			}); // Aggregation
		});





// -----------------------------------
	//
	//    API exist_approvalschema bakup
	//      antes de unificar el find para multiple tablas
	// -----------------------------------
		router.get('/api/exist_approvalschema_backup', function(req, res, next) 

		{
			var action_returned = req.body.returnaction;
			console.log('invpice....... :'+action_returned);	

			var output = { "error" : true};



	  		console.log('-----------------------------------------------');
	  		console.log('/api/exist_approvalschema            ----------');
	  		console.log('-----------------------------------------------');

			console.log('req.query.............. ....... :'+req.query);
			console.log('req.query.costcenterice ....... :'+req.query.costcenter);	
			console.log('req.query.currency .... ....... :'+req.query.currency);
			console.log('req.query.amountinvoice ....... :'+req.query.amountinvoice);

			

			// +++++++++++++++++++++++++++++++++
			//    Buscar nivel de aprobación

			var t_aplevel = "";
			var t_approver1 = "";
			var t_approver2 = "";
			var t_approver3 = "";
			var t_approver4 = "";
			var t_approver5 = "";
			exist_approvalscheme = false;

	        console.log('Antes Approvallevels - req.body.amountinvoice:', req.query.amountinvoice);
	        console.log('Antes Approvallevels - req.body.currency:', req.query.currency);
			Approvallevels.find({$and: [ 	{valmin : {$lte: req.query.amountinvoice }}, 
											{valmax : {$gte: req.query.amountinvoice }}, 
											{currency : {$eq: req.query.currency}} 
										]} , function(err, docs)
			{

	            console.log("err:", err);
	            if (err)
	            {
					console.log('------------------> Error');
					console.log(err);
					var output = 
					{ 	"error" : true, "message" : err };
			    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
			    	res.json(output)

	            }
	            if (docs)
	            {
		            console.log('Approvallevels - doc :',docs);
		            //console.log('Approvallevels - docs.length:', docs.length);
		            console.log('Approvallevels - err:', err);
		            console.log('Approvallevels - req.query.costcenter  :',req.query.costcenter);
		            var t_pos = req.query.costcenter.indexOf(':');
		            console.log('Approvallevels - t_pos :', t_pos);

		            var t_costcenter = req.query.costcenter.slice(0,t_pos).trim();

		            console.log('Approvallevels - req.query.costcenter.slice(0,t_pos).trim() :', t_costcenter );
		            var repite = true;
		            var output = { "error" : "vacio"}
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

								i=1000;

								console.log('Approvalscheme: break',t_aplevel);

								//  ----------------------------------------------------
								//  ---------------- inicio grabar resto del proceso

								console.log('Approvalscheme - t_aplevel :',t_aplevel);
								console.log('Approvalscheme - t_approver1  :',t_approver1 );
								console.log('Approvalscheme - t_approver2  :',t_approver2 );
								console.log('Approvalscheme - t_approver3  :',t_approver3 );
								console.log('Approvalscheme - t_approver4  :',t_approver4 );
								console.log('Approvalscheme - t_approver5  :',t_approver5 );
								exist_approvalscheme = true;

								console.log('------------------> Aprobó la validación')
								var output = 
								{ 	"error" : false, "message" : "Encontré esquema", "aplevel" : t_aplevel, 
									"approver1" : t_approver1, "approver2" : t_approver2, "approver3" : t_approver3,
									"approver4" : t_approver4, "approver5" : t_approver5 };
						    	//output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
						    	res.json(output)
								
							}
							else
							{							
								console.log('----------Index------> 1 No existe esquema')
								var output = { "error" : true, "message" : "No tiene esquema definido" };
								console.log('-----Index Output------> :', output);
								res.json(output)
							} // if (docs1.length > 0)
						}); // Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
							//	  				aplevel : docs[i].aplevel}, function(err, docs1)

					} // for (var i=0; i < docs.length; i++)

					if (i == docs.length && output["error"] == "vacio")
					{
						console.log('----------Index------> 2 No existe esquema')
						console.log("(i = docs.length:",i, docs.length);
						console.log('output["error"]:',output["error"]);
						var output = { "error" : true, "message" : "No tiene esquema definido" };
				    	res.json(output)
			    	}

				} // (docs)

				//res.json(output);

			}); // Approvallevels.find({$and: [ 	{valmin : {$lte: req.body.amountinvoice }}, 
					//						{valmax : {$gte: req.body.amountinvoice }}, 
					//						{currency : {$eq: req.body.currency}} 
					//					]} , function(err, docs)
			//res.json(output);					
		});



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
	//      get api /api/usersdm
	// -------------------------------------	
		router.get('/api/userdm', function(req, res, next) 
		{
			console.log('Entro en /api/userdm.........');
		   	User.find({ email: { $exists: true } } , function(err, alldata)
			{
				console.log('Entro en //api/userdm .. dentro de find');

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
	//      get api /api/supplierinvoice_createby
	// -------------------------------------	
	router.get('/api/supplierinvoice_createby', function(req, res, next) 
	{

		console.log('/api/restUserAccount--------------');
		console.log('user_id', req.session.passport.user);
		var xn = 1;
	   	//var cond = "{ approver"+xn+": tmp) }";
		//console.log('cond:', cond);


		User.findById(req.session.passport.user, {id:1, email:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}
			console.log("docs.id:",docs.id);
			var t_email = docs.email;
			//console.log("docs.approver",current_approver);
			//console.log("docs.approver",docs[0].approver);
			//var id_string = docs.id.toString();
			console.log("t_email:",t_email);

		   	//Supplierinvoice.find({ approver4: new RegExp(tmp) } , function(err, alldata);
		   	Supplierinvoice.find({createdby : t_email}, function(err, alldata)
			{
				console.log('alldata:'+alldata);

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}
				console.log()

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

	});


	// -------------------------------------------------
	//      get api /api/supplierinvoice2approvers
	// -------------------------------------------------
	router.get('/api/supplierinvoice2approvers', function(req, res, next) 
	{

		console.log('/api/supplierinvoice2approvers--------------');
		console.log('user_id', req.session.passport.user);
		var xn = 1;
	   	var cond = "{ approver"+xn+": tmp }";
		console.log('cond:', cond);


		User.findById(req.session.passport.user, {email:1, accounts:1, approver:1}, function(err, docs) 
		{
			if (err)
			{
				res.send(err);
			}
			console.log("docs.approver: ",docs.approver);
			var current_approver = docs.approver.split(":")[0]+":";
			console.log("docs.approver",current_approver);
			//console.log("docs.approver",docs[0].approver);

		   	//Supplierinvoice.find({ approver4: new RegExp(tmp) } , function(err, alldata);
		   	Supplierinvoice.find({ $or: [
		   							{ $and: [{approver1 : docs.approver}, {release1 : "N"}] },
		   							{ $and: [{approver2 : docs.approver}, {release1 : "Y"}, {release2 : "N"}] }
		   		]}, function(err, alldata)
			{
				console.log('alldata:'+alldata);

				if (err)
				{
					console.log('api-error:',err);
					res.send(err);

				}
				console.log()

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

//	   	Supplierinvoice.find({ supplier: { $exists: true }, accountingdate: { $exists: true } } , function(err, alldata)

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





	// -----------------------------------
	//
	//    API exist_approvalschema
	//
	// -----------------------------------
	function exist_approvalschema(costcenter, currency, amountinvoice)
	{

	  		console.log('-----------------------------------------------');
	  		console.log('function exist_approvalschema            ----------');
	  		console.log('-----------------------------------------------');

			console.log('costcenter ....... :'+costcenter);	
			console.log('currency .... ....... :'+currency);
			console.log('amountinvoice ....... :'+amountinvoice);

			// +++++++++++++++++++++++++++++++++
			//    Buscar nivel de aprobación

			var t_aplevel = "";
			var t_approver1 = "";
			var t_approver2 = "";
			var t_approver3 = "";
			var t_approver4 = "";
			var t_approver5 = "";
			exist_approvalscheme = false;

	        console.log('Antes Approvallevels - req.body.amountinvoice:', amountinvoice);
	        console.log('Antes Approvallevels - req.body.currency:', currency);
			Approvallevels.find({$and: [ 	{valmin : {$lte: amountinvoice }}, 
											{valmax : {$gte: amountinvoice }}, 
											{currency : {$eq: currency}} 
										]} , function(err, docs)
			{

	            console.log('Approvallevels - doc :',docs);
	            //console.log('Approvallevels - docs.length:', docs.length);
	            console.log('Approvallevels - err:', err);
	            console.log('Approvallevels - req.query.costcenter  :',costcenter);
	            var t_pos = costcenter.indexOf(':');
	            console.log('Approvallevels - t_pos :', t_pos);

	            var t_costcenter = costcenter.slice(0,t_pos).trim();

	            console.log('Approvallevels - costcenter.slice(0,t_pos).trim() :', t_costcenter );
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
							exist_approvalscheme = true;

							console.log('------------------> Aprobó la validación')
							var output = { "error" : false, "message" : "Encontré esquema" };
					    	output["data"] = { "aplevel" : t_aplevel, "approver1" : t_approver1 };
							return output
						}
						else
						{							
							console.log('----------Index------> No existe esquema')
							var output = { "error" : false, "message" : "No tiene esquema definido" };
							console.log('-----Index Output------> :', output);
							return output
						} // if (docs1.length > 0)
					}); // Approvalscheme.find({ 	costcenter: new RegExp(t_costcenter), 
						//	  				aplevel : docs[i].aplevel}, function(err, docs1)
				} // for (var i=0; i < docs.length; i++)

				console.log('----------Index------> No existe esquema')
				var output = { "error" : false, "message" : "No tiene esquema definido" };
				console.log('-----Index Output------> :', output);

				return output;

			}); // Approvallevels.find({$and: [ 	{valmin : {$lte: req.body.amountinvoice }}, 
					//						{valmax : {$gte: req.body.amountinvoice }}, 
					//						{currency : {$eq: req.body.currency}} 
					//					]} , function(err, docs)

		};



	//---------------------------------------------------------
	//
	// Subir imagenes al servidor
	//
	//---------------------------------------------------------
	
	router.post('/upload', function(req, res)
	{

		console.log("/upload...");
		// creamos un objeto IncomingForm de formidable
		var form = new formidable.IncomingForm();

		console.log("1 form  :", form);
	 
		  // especificamos que queremos permitir al usuario subir varios archivos en un único request
		  form.multiples = true;
		 
		  // guardamos todos los archivos entrantes en la carpeta /uploads


		  //form.uploadDir = path.join(__dirname, '/uploads');
		  form.uploadDir = path.join(__dirname, '/../public/uploads');




		   console.log("2 form  :"+form.uploadDir);

		  //var tmp_id = form.get('id_doc');
		  //console.log("tmp_id :"+ tmp_id);
		  //});


		// cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		var tmp_id = 0;

		form.on('field', function(field, value) {
			console.log("a. field :", field);
			console.log("a. value :", value);
			tmp_id = value;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			var schemaimg = [];

			form.on('file', function(field, file) 
			{
				//console.log("b. field :", field);
				//console.log("b. file :", file);
				
				// mueve el archivo al server
				console.log("1. Antes del rename");
				console.log("file.path:"+file.path);
				console.log("path.join(form.uploadDir, file.name):"+path.join(form.uploadDir, file.name));



				// Renombra al nombre original del archivo
				//fs.rename(file.path, path.join(form.uploadDir, file.name));

				// Renombra al ID del doc en mongodb
				//var new_filename = tmp_id+"."+file.name.split(".")[1];
				var new_filename = tmp_id+".jpg"; //+file.name.split(".")[1];
				var newfile = path.join(form.uploadDir, new_filename);
				console.log("2. newfile:"+newfile);


				fs.stat(newfile, function(err, stat) {
				    if(err == null) 
				    {
				        console.log('fs.stat -> File exists');
				        fs.unlink(newfile);
   				        console.log('fs.stat -> File exists despues de borrado');
				        fs.rename(file.path, newfile);
				        console.log('fs.stat -> File exists despues de renombrado');
				        //fs.rename(path.join(form.uploadDir, file.name), newfile);
				    } else if(err.code == 'ENOENT') 
				    {
				        // file does not exist
				        console.log('fs.stat -> File NO exists - err'+err);
	
				        //fs.rename(path.join(form.uploadDir, file.name), path.join(form.uploadDir, new_filename), function(err, stat) 
 						fs.rename(file.path, newfile, function(err, stat) 
				        {
					        console.log('------------------------------------');

						    if(err == null) 
						    {
						        console.log('Renombre Exitoso!');
						    } else 
						    {
						        // file does not exist
						        console.log('Renombre Error:', err);
						    }
				        });
				    } else 
				    {
				        console.log('Some other error - fs.stat: ', err.code);
				    }
				});




				/*

				var t_data = fs.readFileSync(path.join(form.uploadDir, new_filename));
				var t_contentType = 'image/png';

				console.log("Despues del readFileSync");
				
				schemaimg = {
								data: t_data,
								contentType : t_contentType
							};		

				console.log("Antes del find");	
				Supplierinvoice.find(condition, function (err, doc) 
				{  

					console.log("dentro del find");
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
				    		console.log("dentro de doc.length");
							//doc[0].imgfact.data = fs.readFileSync(req.body.inputimage);
							doc[0].imgfact = [];
							doc[0].imgfact.push(schemaimg);
							//doc[0].imgfact.contentType = 'image/jpeg';
							console.log("Antes de Grabar...");
							//++++++++++++++++++++++++++++
							//   Grabar modificaciones
							doc[0].save(function(err, result) 
							{
								console.log( "Grabando:", result, err );
								if(err) {
								    console.log("Error .." + err);
								}
								else
								{
									invoicesaved = true;
								    console.log("Actualización existosa " + result + "document!");		
							 	}
							}); 
						}
						//  ----------------fin grabar resto del proceso
						//  ----------------------------------------------------
					} // if (doc.length > 0)											
				}); // Supplierinvoice.find(condition, function (err, doc) 
				*/
			  });


		});

		  // Copia el archivo localmente en el servidor 		 
		  // cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		  /*
		  form.on('file', function(field, file) {
			console.log("b. field :", field);
			console.log("b. file :", file);

		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		  */

	  	// Grabar el archivo en nodejs
	  	// cada vez que un archivo haya sido cargado con éxito, l
	  	//o renombramos con su nombre original




			console.log("3 form  :");
		 
		  // logueamos todos los errores que puedan ocurrir
		  form.on('error', function(err) {
		    console.log('Se ha producido un error: \n' + err);
		  });

			console.log("4 form  :");
		 
		  // una vez que todos los archivos hayan sido subidos, se envía una respuesta al usuario
		  form.on('end', function() {
		    res.end('success');
		  });
			console.log("5 form  :");

		 
		  // parseamos la petición entrante que contiene los datos del formulario
		  form.parse(req);
			console.log("6 form  :");

	});


	router.post('/upload1', function(req, res, next) {
		console.log("/upload1...");

	    var form = new formidable.IncomingForm();
		console.log("/upload1...2");

	    form.parse(req, function(err, fields, files) {
	        if (err) next(err);

			console.log("/upload1...3 files:"+files);
	        // TODO: make sure my_file and project_id exist    
	        fs.rename(files.name.path, fields.project_id, function(err) {
	            if (err) next(err);
	            res.end();
	        });
	    });
	});

	// Manejo de Imagenes
//	router.get("/images/:image", function(req,res) {




    //https://stackoverflow.com/questions/25091761/retrieving-posting-images-from-mongodb-mongoose

    // javascript how to know if jpg was saved correctly en mongodb

/*    
//	var testChamp = new Champion ({
//	    name: "aatrox.jpg",
//	    img: fs.readFileSync("D:/CounterMe/Aatrox_0.jpg"),
	    contentType: "image/jpg"
	});

*/

	// Mostrar Imagen

	router.get("/images", function(req,res) 
	{
		//var t_id = req.param.image;

		console.log("*******    -------/images---------------------");

		console.log('req.query.id........... ....... :'+req.query.id);			

		var t_id = req.query.id;

		console.log('mostrar imagen -> t_id :'+t_id );
	    //Supplierinvoiceimagen.findById(t_id, function(err,doc) 
	    Supplierinvoiceimagen.findById(t_id, function(err,doc) 

	    {
	    	if (err)
	    	{
	   			console.log("-------------------------");
	   			console.log("Error:",err);

	    		res.send("");
	    	}

   			console.log("doc imagen._id:",doc);
	    	/*

   			console.log("doc imagen:",doc.length);

			*/
	    	if (doc)
	    	{
	   			console.log("-------------------------");
	   			console.log("/images: Encontro Archivo",doc._id);
	   			console.log(" doc.contentType: ", doc.img_contentType);

		    	res.set("Content-Type", doc.img_contentType);
		    	res.send( doc.img_file );
	       	}
	       	else
	       	{
	   			console.log("-------------------------");
	   			console.log("/images: NO ENCONTRO Archivo");
		    	//res.set("Content-Type", doc.contentType);
	       	 	res.send("");
	       	}
	       



	    });
	});


	// Mostrar PDF

	router.get("/pdf", function(req,res) 
	{
		//var t_id = req.param.image;

		console.log("*******    -------/images---------------------");

		console.log('req.query.id........... ....... :'+req.query.id);			

		var t_id = req.query.id;

		console.log('mostrar imagen -> t_id :'+t_id );
	    //Supplierinvoiceimagen.findById(t_id, function(err,doc) 
	    Supplierinvoiceimagen.findById(t_id, function(err,doc) 

	    {
	    	if (err)
	    	{
	   			console.log("-------------------------");
	   			console.log("Error:",err);

	    		res.send("");
	    	}

   			console.log("doc imagen._id:",doc);
	    	/*

   			console.log("doc imagen:",doc.length);

			*/
	    	if (doc)
	    	{
	   			console.log("-------------------------");
	   			console.log("/pdf: Encontro Archivo",doc._id);
	   			console.log(" doc.contentType: ", doc.pdf_contentType);

		    	res.set("Content-Type", doc.pdf_contentType);
		    	res.send( doc.pdf_file );
	       	}
	       	else
	       	{
	   			console.log("-------------------------");
	   			console.log("/pdf: NO ENCONTRO Archivo");
		    	//res.set("Content-Type", doc.contentType);
	       	 	res.send("");
	       	}
	    });
	});


	//---------------------------------------------------------
	//
	// Subir imagenes al servidor
	//
	//---------------------------------------------------------
	
	router.post('/uploadimages', function(req, res)
	{

		console.log("/uploadimages...");
		// creamos un objeto IncomingForm de formidable
		var form = new formidable.IncomingForm();

		console.log("1 form  :", form);
	 
		// especificamos que queremos permitir al usuario subir varios archivos en un único request
		form.multiples = true;
		 
		// guardamos todos los archivos entrantes en la carpeta /uploads


		//form.uploadDir = path.join(__dirname, '/uploads');
		form.uploadDir = path.join(__dirname, '/../public/uploads');




		console.log("2 form  :"+form.uploadDir);

		//var tmp_id = form.get('id_doc');
		//console.log("tmp_id :"+ tmp_id);
		//});


		// cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		var tmp_id = 0;

		form.on('field', function(field, value) {
			console.log("a. field :", field);
			console.log("a. value :", value);
			tmp_id = value;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			var schemaimg = [];

			form.on('file', function(field, file) 
			{
				//console.log("b. field :", field);
				//console.log("b. file :", file);
				
				// mueve el archivo al server
				console.log("1. Antes del rename");
				console.log("file.path:"+file.path);
				console.log("path.join(form.uploadDir, file.name):"+path.join(form.uploadDir, file.name));



				// Renombra al nombre original del archivo
				//fs.rename(file.path, path.join(form.uploadDir, file.name));

				// Renombra al ID del doc en mongodb
				//var new_filename = tmp_id+"."+file.name.split(".")[1];
				var new_filename = tmp_id+".jpg"; //+file.name.split(".")[1];
				var newfile = path.join(form.uploadDir, new_filename);
				console.log("2. newfile:"+newfile);

				//var t_data = fs.readFileSync(path.join(form.uploadDir, new_filename));
				//var t_data = fs.readFileSync(path.join(form.uploadDir, file.name));
				var t_data = fs.readFileSync(file.path);
				

				var t_contentType = 'image/png';

				console.log("Despues del readFileSync");

				var schemaimg = [];
				
				schemaimg = {
								_id : tmp_id,
								//"_id" : ObjectId("54bc1287c582714e9f062591")
							    img_name: "new_filename",
	    						//img: fs.readFileSync("D:/CounterMe/Aatrox_0.jpg"),
								img_file: t_data, 
								img_contentType: "image/jpg"
							};		


				console.log("Antes del find");	
				Supplierinvoiceimagen.update(condition, schemaimg,  {upsert: true}, function (err, result) 
				{  

					console.log("dentro del find");
					console.log("err...."+err);
					console.log("result...."+result);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
								console.log( "Grabando:");
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
					} // if (doc.length > 0)											
				}); // Supplierinvoice.find(condition, function (err, doc) 
			  });


		});

		  // Copia el archivo localmente en el servidor 		 
		  // cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		  /*
		  form.on('file', function(field, file) {
			console.log("b. field :", field);
			console.log("b. file :", file);

		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		  */

	  	// Grabar el archivo en nodejs
	  	// cada vez que un archivo haya sido cargado con éxito, l
	  	//o renombramos con su nombre original




			console.log("3 form  :");
		 
		  // logueamos todos los errores que puedan ocurrir
		  form.on('error', function(err) {
		    console.log('Se ha producido un error: \n' + err);
		  });

			console.log("4 form  :");
		 
		  // una vez que todos los archivos hayan sido subidos, se envía una respuesta al usuario
		  form.on('end', function() {
		    res.end('success');
		  });
			console.log("5 form  :");

		 
		  // parseamos la petición entrante que contiene los datos del formulario
		  form.parse(req);
			console.log("6 form  :");

	});


	//---------------------------------------------------------
	//
	// show /PDF al servidor
	//
	//---------------------------------------------------------

	router.get("/pdf", function(req,res) 
	{
		//var t_id = req.param.image;

		console.log("*******    -------/images---------------------");

		console.log('req.query.id........... ....... :'+req.query.id);			

		var t_id = req.query.id;

		console.log('mostrar imagen -> t_id :'+t_id );
	    //Supplierinvoiceimagen.findById(t_id, function(err,doc) 
	    Supplierinvoiceimagen.findById(t_id, function(err,doc) 

	    {
	    	if (err)
	    	{
	   			console.log("-------------------------");
	   			console.log("Error:",err);

	    		res.send("");
	    	}

   			console.log("doc imagen._id:",doc);
	    	/*

   			console.log("doc imagen:",doc.length);

			*/
	    	if (doc)
	    	{
	   			console.log("-------------------------");
	   			console.log("/images: Encontro Archivo",doc._id);
	   			console.log(" doc.contentType: ", doc.img_contentType);

		    	res.set("Content-Type", doc.img_contentType);
		    	res.send( doc.img_file );
	       	}
	       	else
	       	{
	   			console.log("-------------------------");
	   			console.log("/images: NO ENCONTRO Archivo");
		    	//res.set("Content-Type", doc.contentType);
	       	 	res.send("");
	       	}
	       



	    });
	});


	//---------------------------------------------------------
	//
	// Subir PDF al servidor
	//
	//---------------------------------------------------------
	
	router.post('/uploadPdf', function(req, res)
	{

		console.log("*** ----------------------------------------- ***");
		console.log("***            /uploadPdf...");
		console.log("*** ----------------------------------------- ***");

		// creamos un objeto IncomingForm de formidable
		var form = new formidable.IncomingForm();

		console.log("1 form  :", form);
	 
		// especificamos que queremos permitir al usuario subir varios archivos en un único request
		form.multiples = true;
		 
		// guardamos todos los archivos entrantes en la carpeta /uploads


		//form.uploadDir = path.join(__dirname, '/uploads');
		form.uploadDir = path.join(__dirname, '/../public/uploads');




		console.log("2 form  :"+form.uploadDir);

		//var tmp_id = form.get('id_doc');
		//console.log("tmp_id :"+ tmp_id);
		//});


		// cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		var tmp_id = 0;

		form.on('field', function(field, value) {
			console.log("a. field :", field);
			console.log("a. value :", value);
			tmp_id = value;

			console.log("tmp_id: "+tmp_id);
			var condition = {"_id": tmp_id}

			var schemaimg = [];

			form.on('file', function(field, file) 
			{
				//console.log("b. field :", field);
				//console.log("b. file :", file);
				
				// mueve el archivo al server
				console.log("1. Antes del rename");
				console.log("file.path:"+file.path);
				console.log("path.join(form.uploadDir, file.name):"+path.join(form.uploadDir, file.name));



				// Renombra al nombre original del archivo
				//fs.rename(file.path, path.join(form.uploadDir, file.name));

				// Renombra al ID del doc en mongodb
				//var new_filename = tmp_id+"."+file.name.split(".")[1];
				var new_filename = tmp_id+".pdf"; //+file.name.split(".")[1];
				var newfile = path.join(form.uploadDir, new_filename);
				console.log("2. newfile:"+newfile);

				//var t_data = fs.readFileSync(path.join(form.uploadDir, new_filename));
				//var t_data = fs.readFileSync(path.join(form.uploadDir, file.name));
				var t_data = fs.readFileSync(file.path);
				

				var t_contentType = 'image/png';

				console.log("Despues del readFileSync");

				var schemaimg = [];
				
				schemaimg = {
								_id : tmp_id,
								//"_id" : ObjectId("54bc1287c582714e9f062591")
							    pdf_name: "new_filename",
	    						//img: fs.readFileSync("D:/CounterMe/Aatrox_0.jpg"),
								pdf_file: t_data, 
								pdf_contentType: "application/pdf"
							};		


				console.log("Antes del find");	
				Supplierinvoiceimagen.update(condition, schemaimg,  {upsert: true}, function (err, result) 
				{  

					console.log("dentro del find");
					console.log("err...."+err);
					console.log("result...."+result);
				    // Handle any possible database errors
				    if (err) 
				    {
				    	console.log("No existe el Registro");
				        res.status(500).send(err);
				    } else 
				    {
								console.log( "Grabando:");
								invoicesaved = true;
							    console.log("Actualización existosa " + result + "document!");		
					} // if (doc.length > 0)											
				}); // Supplierinvoice.find(condition, function (err, doc) 
			  });


		});

		  // Copia el archivo localmente en el servidor 		 
		  // cada vez que un archivo haya sido cargado con éxito, lo renombramos con su nombre original
		  /*
		  form.on('file', function(field, file) {
			console.log("b. field :", field);
			console.log("b. file :", file);

		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		  */

	  	// Grabar el archivo en nodejs
	  	// cada vez que un archivo haya sido cargado con éxito, l
	  	//o renombramos con su nombre original




			console.log("3 form  :");
		 
		  // logueamos todos los errores que puedan ocurrir
		  form.on('error', function(err) {
		    console.log('Se ha producido un error: \n' + err);
		  });

			console.log("4 form  :");
		 
		  // una vez que todos los archivos hayan sido subidos, se envía una respuesta al usuario
		  form.on('end', function() {
		    res.end('success');
		  });
			console.log("5 form  :");

		 
		  // parseamos la petición entrante que contiene los datos del formulario
		  form.parse(req);
			console.log("6 form  :");

	});




//  como llamar al restfull desde arriba
//  
//    	http://localhost:3000/api/restGetAllSupplier
//    	http://localhost:3000/api/restGetOneSupplierInvoice/5794e0cfe3dbbb2011c04bb2
// 		5794e0cfe3dbbb2011c04bb2

module.exports = router;



