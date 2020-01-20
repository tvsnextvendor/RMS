
'use strict';
const express = require('express');
const router = express.Router();
const scheduleController = require('./../controllers/trainingSchedule');
router.put('/updateUserTrainingStatus', scheduleController.updateUserTrainingStatus);
router.get('/',scheduleController.getTrainingSchedule);
router.get('/getDetailsById',scheduleController.getSpecificTrainingSchedule);
router.get('/getAllSchedules',scheduleController.getAllSchedules);
router.get('/getSpecificSchedule',scheduleController.getSpecificSchedule);
router.delete('/deleteSchedule/:trainingScheduleId',scheduleController.deleteSchedule);
router.get('/failedList',scheduleController.failedList);
router.put('/expireReschedule',scheduleController.expireReschedule);
module.exports = router;

