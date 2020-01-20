

const config 		=	require('../config/dbConfig');
const settings 	    =	require('../config/configuration');
const models 		=	require('../models');

const fs 			= 	require('fs');
const path 		    =	require("path");
const basename      =   path.basename(module.filename);
const Sequelize 	=	require('sequelize');
const db 			=	{};

let env          =  process.env.NODE_ENV || settings.ENVIRONMENT;
let databaseInfo =  config[env];
const Op 			= Sequelize.Op;
const operatorsAliases = {
    $or: Op.or,
	$and:Op.and,
	$eq:Op.eq,
	$iLike:Op.iLike,
	$in:Op.in,
	$ne : Op.ne,
	$contains:Op.contains,
	$overlap:Op.overlap,
	$any:Op.any
}

//Sequelize connection
var sequelize = new Sequelize(databaseInfo.database,databaseInfo.username,databaseInfo.password,{
	operatorsAliases,
	host 			: 	databaseInfo.host,
	dialect 		: 	databaseInfo.dialect,
	pool 			: 	databaseInfo.pool,
	logging         :   databaseInfo.logging,
	define 			: 	{
		charset: 'utf8',
		dialectOptions: {
			collate: 'utf8_general_ci'
		},
		timestamps : true,
		createdAt  : 'created',
		updatedAt  : 'updated'
	},
	dialectOptions : {}
//,
//operatorsAliases: false // To Skip Deprecation Warning For String Opertors -> Symbol Operators
});

//Connection authentication
sequelize.authenticate().then(function(err){
	if(err){
		console.log('There is Error in Connection');
	}else{
		console.log('Database Connected ...');
	}
});

let modelsFolder = __dirname;
fs.readdirSync(modelsFolder).filter(function(file){
	return ((file.indexOf('.') !== 0) && (file !== basename));
}).forEach(function(file){
	var model 	=	sequelize.import(path.join(modelsFolder, file));
	db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
	  db[modelName].associate(db);
	}
});


//sync process validation
sequelize.sync({
//force: true
}).then(function(success){
	console.log("Service Running At PORT "+settings.SERVER_PORT);
//console.log(db);
var lengthKey = parseInt(Object.keys(db).length) - parseInt(2);
console.log("Tables Created " + lengthKey);
},function(err){
	console.log(err);
	console.log("error");
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

module.exports = db;
