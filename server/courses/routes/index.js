const express = require('express');
const router = express.Router();

const courseRouter = require('./courses');
const classesRouter = require('./trainingClass');
const scheduleController = require('../controllers/trainingSchedule');
const resortController = require('./resort');
const userController = require('./user');
const scheduleRouter = require('./scheduleTraining');
const feedbackRouter = require('./feedback');
const notificationRouter = require('./notification');
const dashboardRouter = require('./dashboard');
const archievedRouter = require('./archieved');
const approvalSettingsRouter = require('./approvalSettings');
const uploadRouter = require('./upload');

router.post('/scheduleTraining', scheduleController.scheduleTraining);
router.put('/updateScheduleTraining/:trainingScheduleId', scheduleController.updateScheduleTraining);
router.put('/updateUserTrainingStatus', scheduleController.updateUserTrainingStatus);
router.put('/updateFileTrainingStatus', scheduleController.updateFileTrainingStatus);
router.put('/updateTrainingClassCompletedStatus', scheduleController.updateTrainingClassCompletedStatus);
router.put('/checkTrainingFilesCompleted', scheduleController.checkTrainingFilesCompleted);
router.get('/updateTrainingStatus', scheduleController.updateTrainingStatus);
router.get('/courseEmployeestatusList', scheduleController.courseEmployeestatusList);
router.get('/employeesExpireList',scheduleController.employeesExpireList);
router.get('/checkFeedbackRated', scheduleController.checkFeedbackRated);
router.get('/employeeFilestatusList', scheduleController.employeeFilestatusList);
router.put('/fileUpdate/:fileId', scheduleController.fileUpdate);

router.use('/trainingClass', classesRouter);
router.use('/course', courseRouter);
router.use('/resort', resortController);
router.use('/user', userController);
router.use('/schedule', scheduleRouter);
router.use('/', feedbackRouter);
router.use('/', notificationRouter);
router.use('/', dashboardRouter);
router.use('/', archievedRouter);
router.use('/', approvalSettingsRouter);
router.use('/', uploadRouter);



module.exports = router;
