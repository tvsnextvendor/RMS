const createError    = require('http-errors');
const express        = require('express');
const path           = require('path');
const cookieParser   = require('cookie-parser');
const logger         = require('morgan');
const jwt            = require('jsonwebtoken');
const compression    = require('compression');
const cors           = require('cors');

const models 		     =	require('./index');

const config         =  require('./config/configuration');

const app            =  express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cross-origin
app.use(cors());
app.use(cookieParser());
app.use(compression());

app.get('/', function(req, res, next) {
	res.render('index', { title: 'Shared Microservices Running '+ config.SERVER_PORT });
  });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req,res,next){
	var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Content-MD5', 'Content-Length',
	'Response-Time', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization'];
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", allowHeaders.join(', '));
	res.header("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header("Accept", "application/x-www-form-urlencoded,text/html,application/json,text/plain");
	next();
});
module.exports = app;
