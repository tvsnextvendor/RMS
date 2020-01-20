module.exports = {
	SERVER_PORT : "8104",
	SOCKET_PORT : "3005",
	CLIENT_PORT : "5000",
	ENVIRONMENT :(process.env.ENV)?process.env.ENV:"staging",
	SECRET_KEY  : "623964168",
	//TOKEN_LIFE  :  600000 , // 10 mins or 600000 ms
	TOKEN_LIFE:  '2d' ,
	OTP_VALIDITY: "1",
	//SITE_URL:'http://demo.greatinnovus.com'
	//SITE_URL: 'http://ec2-34-227-100-123.compute-1.amazonaws.com',
	SITE_URL:(process.env.SITE_URL)?process.env.SITE_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com',
};
