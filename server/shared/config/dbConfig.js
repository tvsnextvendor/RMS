module.exports 		=   {
	'local'	: 	{
		host 		: 	'127.0.0.1',
		database 	: 	'rms',
		dialect 	: 	'postgres',
		username	: 	'me',
		password	: 	'123456',
		port 		: 	'5432',
		query 		: 	{max: 20, min:0,idle:10000},
		logging     :   true
	},
	'development' :{
		host 		: 	'rms.greatinnovus.com',
		database 	: 	'rmsdb',
		dialect 	: 	'postgres',
		username	: 	'ctrlshiftuser',
		password	: 	'wR+xwT#yCV4^',
		port 		: 	'5432',
		query 		: 	{max: 20, min:0,idle:10000},
		logging     :   false
	},
	'production' :{
		host 		: 	'',
		database 	: 	'rmsdb',
		dialect 	: 	'postgres',
		username	: 	'rmsuser',
		password	: 	'',
		port 		: 	'5432',
		query 		: 	{max: 20, min:0,idle:10000},
		logging     :   false
	}
};
