const createError    = require('http-errors');
const express        = require('express');
const path           = require('path');
const cookieParser   = require('cookie-parser');
const logger         = require('morgan');
const jwt            = require('jsonwebtoken');
const compression    = require('compression');
const cors           = require('cors');

const models 		 =	require('./models');
const indexRouter    =  require('./routes/index');

const config         =  require('./config/configuration');

const app            = express();
const cron           = require("node-cron");
// const models         = require('./models');
const apiRoutes    = express.Router();

// LDAP Authentication / AD Directory Auth Set up

// const passport     = require('passport');
// const LdapStrategy = require('passport-ldapauth');

// var OPTS = {
//   server: {
//     url: 'ldap://localhost:389',
//     bindDN: 'cn=root',
//     bindCredentials: 'secret',
//     searchBase: 'ou=passport-ldapauth',
//     searchFilter: '(uid={{username}})'
//   }
// };
// passport.use(new LdapStrategy(OPTS));
// LDAP Authentication / AD Directory Auth Set up

cron.schedule("0 0 0 * * *", function() {
	console.log("running a task every day");
	forumInactive();
});
function forumInactive(){
	let conditions = {};
	let currentDate = new Date();
	console.log("currentDate",currentDate)
	conditions['endDate'] = currentDate;
	conditions['isActive'] = true;
     models.Forum.update({isActive:false},{where :conditions}).then(function(resp){
		 console.log("resp",resp)
	 })
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cross-origin
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(passport.initialize());

//Authentication service
apiRoutes.use(function(req, res, next) 
{  
	var token = req.headers['authorization'] || req.headers['Authorization'];
	if(token)
	{
		token = token.replace(/ar4Jq1V/g, ".");
		jwt.verify(token, config.SECRET_KEY, function(err, decoded)
		{
			if (err)
			{
				if(err && err.name == 'TokenExpiredError') {
					return res.status(403).json({status: 'error', message: 'Session expired, Please Sign out and Continue.' });
				} else {
					return res.status(401).json({ status: 'error', message: 'Failed to authenticate token.' });
				}
			} else {
				req.decoded = decoded; 
				next();
			}
		});

	}else{
		res.json({ status: 'error', message: 'Authorization token is mandatory' });
	}
});

app.get('/', function (req, res, next) {
	res.render('index', { title: 'Forum Microservices Running ' + config.SERVER_PORT });
});
app.use('/', apiRoutes);
app.use('/', indexRouter);

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
