const express = require('express');
const router = express.Router();
const certificateController = require('./../controllers/certificate');

router.post('/addCertificate', certificateController.addCertificate);
router.post('/courseCertificateAssign', certificateController.courseCertificateAssign);
router.get('/getCertificate',certificateController.getCertificate);
router.get('/courseAssign',certificateController.CourseAssign);
router.put('/certificate/:certificateId',certificateController.update);
router.delete('/deleteCertificate/:certificateId', certificateController.deleteCertificate);
router.get('/getUserCertificates',certificateController.getUserCertificates)
module.exports = router;