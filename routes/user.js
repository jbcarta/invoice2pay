var express = require('express');
var router = express.Router();

// Evitar el robo de sesiones de browser
// el servidor valida cada solicitud del
// cliente se del mismo browser
var csrf = require('csurf');

// user managment

var passport = require('passport');

// Mensajes espaciales de errores
var flash = require('connect-flash');

var csrfProtection = csrf();
router.use(csrfProtection);

// -----------------------------------
//         Models    
// -----------------------------------
var User = require('../models/user');



//   **********************************************
//                  profile
//   **********************************************
	 router.get('/profile', isLoggedIn, function(req, res, next) 
	 {
		console.log('------------------------------------');
		
		console.log('user', req.session);
		console.log('user_id', req.session.passport.user);
    	User.findById(req.session.passport.user, function(err, docs) 
    	{


			results_supplier_mongodb = [];
			results_supplier_mongodb.push(docs);

			console.log('mongo result------------------');
			console.log(results_supplier_mongodb);
//			console(results_supplier_mongodb);

			res.render('user/profile', { title: 'Datos de Usuarios', recdata: results_supplier_mongodb});

//			console.log("/supplierinvoice_edit/Supplierinvoice.findById 3");
		});

	 });


router.get('/logout', isLoggedIn, function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.use('/', NotLoggedIn, function(req, res, next){
	next();
});

router.get('/signup', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

router.post('/signup', passport.authenticate('local.signup', 
{
	successRedirect: '/user/profile' ,	
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function(req, res, next) 
{
	var messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', 
{
	//successRedirect: '/user/profile' ,	
	successRedirect: '/' ,	
	failureRedirect: '/user/signin',
	failureFlash: true

}));

router.get('/signin_claxson', function(req, res, next) 
{
	var messages = req.flash('error');
	res.render('user/signin_claxson', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin_claxson', passport.authenticate('local.signin', 
{
	//successRedirect: '/user/profile' ,	
	successRedirect: '/' ,	
	failureRedirect: '/user/signin_claxson',
	failureFlash: true

}));




router.get('/api/restGetOneUser/:id', function(req, res)
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


module.exports = router;


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function NotLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}