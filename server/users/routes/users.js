let express = require('express');
let router = express.Router();
let userController = require('./../controllers/user');

router.post('/Add', userController.add);
router.get('/List',userController.list);
router.put('/Update/:userId',userController.update);
router.delete('/Delete/:userId',userController.delete);
router.put('/settings',userController.settings);
router.post('/contentEmail',userController.contentEmail);
router.get('/createExcelTemplate',userController.createExcelTemplate);
router.get('/createXLS',userController.createXLS);
router.get('/getResortMappings',userController.getResortMappings);
module.exports = router;
