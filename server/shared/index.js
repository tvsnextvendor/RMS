const config 		=	require('./config/dbConfig');
const settings 	    =	require('./config/configuration');

const fs 			= 	require('fs');
const path 		    =	require("path");
const basename      =   path.basename(module.filename);
const Sequelize 	=	require('sequelize');
const db 			=	{};

let env             =  process.env.NODE_ENV || settings.ENVIRONMENT;
let databaseInfo    =  config[env];

//Sequelize connection
var sequelize = new Sequelize(databaseInfo.database,databaseInfo.username,databaseInfo.password,{
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

let rootFolder    = path.join(__dirname, '..');
let resortsFolder = rootFolder+'/resorts/models';
let usersFolder   = rootFolder+'/users/models';
let coursesFolder   = coursesFolder+'/users/models';

console.log('rootFolder',rootFolder);
console.log('resortsFolder',resortsFolder);
console.log('usersFolder',usersFolder);
console.log('coursesFolder',coursesFolder);

fs.readdirSync(usersFolder).filter(function(file){
	return ((file.indexOf('.') !== 0) && (file !== basename));
}).forEach(function(file){
	var model 	=	sequelize.import(path.join(usersFolder, file));
	db[model.name] = model;
});

fs.readdirSync(resortsFolder).filter(function(file){
	return ((file.indexOf('.') !== 0) && (file !== basename));
}).forEach(function(file){
	var model 	=	sequelize.import(path.join(resortsFolder, file));
	db[model.name] = model;
});

fs.readdirSync(coursesFolder).filter(function(file){
	return ((file.indexOf('.') !== 0) && (file !== basename));
}).forEach(function(file){
	var model 	=	sequelize.import(path.join(coursesFolder, file));
	db[model.name] = model;
});



Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
	  db[modelName].associate(db);
	}
});
console.log(db);
 //foreignkey settings
(function(m)
{	
	console.log(m);
	 m.UserRolePermission.belongsTo(m.DepartMent,{foreignKey:'departmentId',onDelete:'cascade'});
	 m.UserRolePermission.belongsTo(m.Resort,{foreignKey:'resortId',onDelete:'cascade'});
	 m.UserRolePermission.belongsTo(m.Division,{foreignKey:'divisionId',onDelete:'cascade'});
	 m.UserRolePermission.belongsTo(m.Role,{foreignKey:'roleId', onDelete: 'cascade'});
	 m.UserRolePermission.belongsTo(m.User,{foreignKey:'userId', onDelete: 'cascade'});





	 m.User.belongsTo(m.DepartMent,{foreignKey:'departmentId',onDelete: 'cascade'});
	 m.User.belongsTo(m.Division,{foreignKey:'divisionId',onDelete: 'cascade'});
	 m.User.belongsTo(m.Designation,{foreignKey:'designationId',onDelete: 'cascade'});

})(db);
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
