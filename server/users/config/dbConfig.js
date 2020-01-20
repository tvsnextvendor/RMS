module.exports = {
	'local': {
		host: 'localhost',
		database: 'rms_db',
		dialect: 'postgres',
		username: 'me',
		password: '123456',
		port: '5432',
		query: { max: 20, min: 0, idle: 10000 },
		logging: true
	},
	'development': {
		host: 'rms.greatinnovus.com',
		database: '',
		dialect: 'postgres',
		username: 'rms_admin',
		password: '123456',
		port: '5432',
		query: { max: 20, min: 0, idle: 10000 },
		logging: false
	},
	'staging': {
		host: 'lms-staging.cfuyd8hzvixn.us-east-1.rds.amazonaws.com',
		database: 'lms-staging',
		dialect: 'postgres',
		username: 'rms_staginguser',
		password: 'G4mXLSn7A4',
		port: '5432',
		query: { max: 20, min: 0, idle: 10000 },
		logging: true
	},
	'production': {
		host: 'lms-production.cfuyd8hzvixn.us-east-1.rds.amazonaws.com',
		database: 'lms-production',
		dialect: 'postgres',
		username: 'postgres',
		password: 'Y3uwfhgZcG',
		port: '5432',
		query: { max: 20, min: 0, idle: 10000 },
		logging: true
	}
};
