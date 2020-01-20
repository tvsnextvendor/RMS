let express = require('express');
let router = express.Router();
let userPermissionController = require('./../controllers/userPermission');


router.post('/Add', userPermissionController.add);
router.get('/List',userPermissionController.list);
router.post('/Update',userPermissionController.update);
router.get('/getRolePermissions',userPermissionController.getRolePermissions);
module.exports = router;
