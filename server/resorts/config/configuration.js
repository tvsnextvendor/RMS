module.exports = {
	SERVER_PORT: "8102",
	SOCKET_PORT: "3005",
	CLIENT_PORT: "5000",
	ENVIRONMENT: (process.env.ENV)?process.env.ENV:"staging",
	SECRET_KEY: "623964168",
	TOKEN_LIFE: '2d', // 10 mins or 600000 ms
	//TOKEN_LIFE: 1000 ,
	OTP_VALIDITY: "1",
	//adminEmail: 'lmstvsnext@gmail.com',
	adminEmail: 'lms1risk2019@gmail.com',
	adminPassword: 'LMStvsnext#8',
	//CLIENT_URL:'http://demo.greatinnovus.com/LMS',
	//CLIENT_URL: 'http://ec2-34-227-100-123.compute-1.amazonaws.com/LMS',
	//CLIENT_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com/LMS'
	CLIENT_URL:(process.env.CLIENT_URL)?process.env.CLIENT_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com/LMS'
};
