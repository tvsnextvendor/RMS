const express = require('express');
const router = express.Router();
const badgeController = require('./../controllers/badge');

router.post('/', badgeController.createBadge);
router.get('/',badgeController.getBadge);
router.put('/:badgeId', badgeController.updateBadge);
router.delete('/:badgeId', badgeController.deleteBadge);

module.exports = router;
