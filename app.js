// Apps Claxson  
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var userRoutes = require('./routes/user');


var app = express();

//app.locals.optionmenu = false;
// Paara evitar e log un mensaje 4304 de volver a carga la pagina
//app.disable('etag'); no hizo nada se mantuvo igual

// para usar con internet servidor de claxson
  mongoose.connect('mongodb://invoice:Inv.1984@admapps01:27017/invoice2pay');

//--- Para usar con internet servidor mlab
//  mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');


//--- Para usar local sin internet esta es la instrucción
//    mongoose.connect('127.0.0.1:27017/casupo');

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysupersecret', 
    resave : false, 
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(validator());
app.use(flash());


app.use(function(req, res, next)
{
  res.locals.login = req.isAuthenticated();  
  res.locals.session = req.session;
  res.locals.optionmenu = app.locals.optionmenu;

  next();  
});

app.use('/user', userRoutes);
app.use('/', routes);


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
    });
});


module.exports = app;
