module.exports = {
	SERVER_PORT: "8101",
	SOCKET_PORT: "3005",
	CLIENT_PORT: "4200",
	ENVIRONMENT:(process.env.ENV)?process.env.ENV:"staging",
	SECRET_KEY: "623964168",
	//TOKEN_LIFE  :  1000 , // 10 mins or 600000 ms
	//TOKEN_LIFE: '240000' ,
	TOKEN_LIFE: '2d',
	OTP_VALIDITY: "1",
	//SITE_URL :'http://demo.greatinnovus.com',
	//CLIENT_URL:'http://demo.greatinnovus.com/LMS',
	//CLIENT_URL: 'http://ec2-34-227-100-123.compute-1.amazonaws.com/LMS',
	CLIENT_URL:(process.env.CLIENT_URL)?process.env.CLIENT_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com/LMS',
	SITE_URL:(process.env.SITE_URL)?process.env.SITE_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com',

	//CLIENT_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com/LMS',
	//SITE_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com',
	//SITE_URL: 'http://ec2-34-227-100-123.compute-1.amazonaws.com',
	//adminEmail: 'lmstvsnext@gmail.com',
	adminEmail: 'lms1risk2019@gmail.com',
	adminPassword: 'LMStvsnext#8'
};


//export CLIENT_URL='http://ec2-34-227-100-123.compute-1.amazonaws.com/LMS'
//export SITE_URL='http://ec2-34-227-100-123.compute-1.amazonaws.com'