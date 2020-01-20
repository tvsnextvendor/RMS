'use strict';
const express            = require('express');
const router             = express.Router();
const feedbackController = require('./../controllers/feedback');

router.post('/courseFeedback',feedbackController.courseFeedback);
router.post('/applicationFeedback',feedbackController.applicationFeedback);
router.get('/feedbackList',feedbackController.feedbackList);

module.exports = router;