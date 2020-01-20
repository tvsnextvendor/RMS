var express = require('express');
var router = express.Router();
var subscriptionController = require('./../controllers/subscription');

/* GET subscription listing. */

router.post('/Add', subscriptionController.add);
router.get('/List', subscriptionController.list);
router.put('/Update/:departmentId',subscriptionController.update);
router.delete('/Delete/:departmentId',subscriptionController.delete);

module.exports = router;
