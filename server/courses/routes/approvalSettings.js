const express = require('express');
const router = express.Router();
const approvalSettigsController = require('./../controllers/approvalSettings');

router.post('/createApproval', approvalSettigsController.createApproval);
router.put('/statusApproval/:approvalId', approvalSettigsController.statusApproval);
router.get('/approvallist', approvalSettigsController.approvallist);

module.exports = router;