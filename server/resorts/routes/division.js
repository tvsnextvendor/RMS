const express = require('express');
const router = express.Router();
const divisionController = require('./../controllers/division');



router.post('/Add', divisionController.add);
router.get('/List', divisionController.list);
router.put('/Update/:divisionId',divisionController.update);
router.delete('/Delete/:divisionId',divisionController.delete);
router.put('/userHierarchyUpdate/:divisionId',divisionController.userHierarchyUpdate);
router.post('/checkDivision', divisionController.checkDivision);

module.exports = router;
