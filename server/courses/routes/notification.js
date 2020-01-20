'use strict';
const express = require('express');
const router = express.Router();
const notificationController = require('./../controllers/notification');

router.post('/createNotification', notificationController.createNotification);
router.post('/signatureNotification', notificationController.signatureNotification);
router.get('/listMobileNotification', notificationController.listMobileNotification);
router.get('/getNotification', notificationController.getNotification);
router.get('/getNotificationFile', notificationController.getNotificationFile);
router.get('/getScheduleExpireList', notificationController.getScheduleExpireList);
router.get('/getDashboardCount', notificationController.getDashboardCount);
router.put('/updateNotification/:notificationFileId', notificationController.updateNotification);
router.put('/completedNotification',notificationController.completedNotification);
module.exports = router;