const express = require('express');
const router = express.Router();
const departmentController = require('./../controllers/department');

router.post('/Add', departmentController.add);
router.post('/List', departmentController.list);
router.put('/Update/:departmentId', departmentController.update);
router.delete('/Delete/:departmentId', departmentController.delete);
router.post('/checkDepartment', departmentController.checkDepartment);

module.exports = router;
