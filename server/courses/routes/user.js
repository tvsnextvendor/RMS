let express = require('express');
let router = express.Router();
let userController = require('./../controllers/user');

let fs = require('fs');
let path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, callback) => {
		let file_path;
		
		file_path = path.resolve(__dirname, 'uploads');
		filepath = path.resolve('/uploads');

		if (!fs.existsSync(file_path)) {
			fs.mkdirSync(file_path);
		}
		callback(null, file_path);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	},
});
const upload = multer({ storage: storage });
router.post('/getEmployeeDetails', userController.getEmployeeDetails);
router.put('/readNotification/:notificationId',userController.readNotification);
router.put('/readAllNotifications/:userId',userController.readAllNotifications);
router.post('/sendExpireNotification',userController.sendExpireNotification);
router.post('/getReportingManagers',userController.getReportingManagers);
router.post('/checkCourse',userController.checkCourse);
router.post('/sendReportEmail',upload.any(),userController.sendReportEmail);
module.exports = router;
