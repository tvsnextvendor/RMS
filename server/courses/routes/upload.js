let express = require('express');
let router = express.Router();
let uploadController = require('./../controllers/upload');
let fs = require('fs');
let path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const config = require('./../config/configuration');
const S3 = new AWS.S3({
	accessKeyId: config.AWS.accessKeyId,
	secretAccessKey: config.AWS.secretAccessKey
});
var multerStorage = multerS3({
	s3: S3,
	bucket: config.AWS.videoBucket,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: file.fieldname });
	},
	key: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	}
});
AWS.config.update({
	accessKeyId: config.AWS.accessKeyId,
	secretAccessKey: config.AWS.secretAccessKey,
	region: config.AWS.region
});

var storage = multer.diskStorage({
	destination: (req, file, callback) => {
		var file_path;
		file_path = path.resolve(__dirname, '../' + 'uploads');
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
router.post('/uploadDocuments', upload.array('file', 10), uploadController.uploadDocuments);
router.delete('/removeDocuments', uploadController.removeDocuments);
module.exports = router;
