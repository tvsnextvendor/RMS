var express = require('express');
var router = express.Router();
var roleController = require('./../controllers/role');

/* GET users listing. */

router.post('/Add', roleController.add);
router.get('/List', roleController.list);
router.put('/Update/:roleId',roleController.update);
router.delete('/Delete/:roleId',roleController.delete);
router.post('/defaultRoles', roleController.defaultRoles);

module.exports = router;
