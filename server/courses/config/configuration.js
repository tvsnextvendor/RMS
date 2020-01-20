module.exports = {
	SERVER_PORT: "8103",
	SOCKET_PORT: "8181",
	CLIENT_PORT: "5000",
	ENVIRONMENT:(process.env.ENV)?process.env.ENV:"staging",
	SECRET_KEY: "623964168",
	//TOKEN_LIFE  :  1000 , // 10 mins or 600000 ms
	TOKEN_LIFE: '2d',
	OTP_VALIDITY: "1",
	LIMIT: 20,
	OFFSET: 0,
	//SITE_URL: 'http://192.168.1.7',
	//SITE_URL:'http://demo.greatinnovus.com',
	//SITE_URL: 'http://ec2-34-227-100-123.compute-1.amazonaws.com',
	SITE_URL:(process.env.SITE_URL)?process.env.SITE_URL:'http://ec2-18-207-186-212.compute-1.amazonaws.com',
	//adminEmail: 'lmstvsnext@gmail.com',
	adminEmail: 'lms1risk2019@gmail.com',
	adminPassword: 'LMStvsnext#8',
	COLORCODE: {
		class: '#0491BD',
		course: '#F1C400',
		notification: '#8B62CC'
	},
	// Staging Login Set 
	AWS: {
		accessKeyId: 'AKIAILXLL53OMBVCLRXQ', 
		secretAccessKey: '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',
		region: 'us-east-1',
		videoBucket: 'lms-test.1linklms.net',
		transcode: {
			video: {
				pipelineId: '1568923370232-7moygj',
				//outputKeyPrefix: 'transcoded_files/', // put the video into the transcoded folder
				presets: [ // Comes from AWS console
					{ presetId: '1351620000001-000001', suffix: '_1080' },
					{ presetId: '1351620000001-000040', suffix: '_360' },
					{ presetId: '1351620000001-000020', suffix: '_480' },
					{ presetId: '1351620000001-100141', suffix: '_audioAAC_64k' },
					{ presetId: '1351620000001-100090', suffix: '_amazonkindle_fireHD_8' },
					{ presetId: '1351620000001-100080', suffix: '_amazonkindle_fireHD' },
					{ presetId: '1351620000001-100080', suffix: '_amazonkindle_fire' },
					{ presetId: '1351620000001-100060', suffix: '_appleTV3G' },
					{ presetId: '1351620000001-100050', suffix: '_appleTV2G' },
					{ presetId: '1351620000001-000010', suffix: '_720' },
					{ presetId: '1351620000001-000030', suffix: '_480_4_3' },
					{ presetId: '1351620000001-000050', suffix: '_360_4_3' },
					{ presetId: '1351620000001-000061', suffix: '_320*240' },
					{ presetId: '1351620000001-100020', suffix: '_iphone' },
					{ presetId: '1351620000001-100040', suffix: '_ipadtouch' },
					{ presetId: '1351620000001-100070', suffix: '_web' }

				]
			}
		}
	}

	// Sample Login Set //Account Closed //Booshna login
	// AWS: {
	// 	accessKeyId: 'false', // Wrongly indicated to unfunctioing cost issue
	// 	//accessKeyId: 'AKIAJ2G7O75AFILGKQWA',
	// 	secretAccessKey: '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',
	// 	region: 'ap-south-1',
	// 	videoBucket: 'inputbucket-lms',
	// 	transcode: {
	// 		video: {
	// 			pipelineId: '1567063120734-3g4g17',
	// 			outputKeyPrefix: 'transcoded_files/', // put the video into the transcoded folder
	// 			presets: [ // Comes from AWS console
	// 				{ presetId: '1351620000001-000001', suffix: '_1080' },
	// 				{ presetId: '1351620000001-000040', suffix: '_360' },
	// 				{ presetId: '1351620000001-000020', suffix: '_480' },
	// 				{ presetId: '1351620000001-100141', suffix: '_audioAAC_64k' },
	// 				{ presetId: '1351620000001-100090', suffix: '_amazonkindle_fireHD_8' },
	// 				{ presetId: '1351620000001-100080', suffix: '_amazonkindle_fireHD' },
	// 				{ presetId: '1351620000001-100080', suffix: '_amazonkindle_fire' },
	// 				{ presetId: '1351620000001-100060', suffix: '_appleTV3G' },
	// 				{ presetId: '1351620000001-100050', suffix: '_appleTV2G' },
	// 				{ presetId: '1351620000001-000010', suffix: '_720' },
	// 				{ presetId: '1351620000001-000030', suffix: '_480_4_3' },
	// 				{ presetId: '1351620000001-000050', suffix: '_360_4_3' },
	// 				{ presetId: '1351620000001-000061', suffix: '_320*240' },
	// 				{ presetId: '1351620000001-100020', suffix: '_iphone' },
	// 				{ presetId: '1351620000001-100040', suffix: '_ipadtouch' },
	// 				{ presetId: '1351620000001-100070', suffix: '_web' }

	// 			]
	// 		}
	// 	}
	// }
};
