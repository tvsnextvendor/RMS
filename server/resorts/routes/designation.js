const express = require('express');
const router = express.Router();
const designationController = require('./../controllers/designation');



router.post('/Add', designationController.add);
router.get('/List', designationController.list);
router.put('/Update/:designationId', designationController.update);
router.delete('/Delete/:designationId', designationController.delete);
router.post('/checkDesignation', designationController.checkDesignation);

module.exports = router;
