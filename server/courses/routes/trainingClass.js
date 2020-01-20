
'use strict';
const express = require('express');
const router = express.Router();
const trainingClassController = require('./../controllers/trainingClass');

router.post('/Add', trainingClassController.add);
router.get('/List', trainingClassController.list);
router.get('/QuizList', trainingClassController.quizlist);
router.get('/fileList', trainingClassController.fileList);
router.get('/trainingClasses', trainingClassController.trainingClasses);
router.get('/TrainingFileList', trainingClassController.TrainingFileList);
router.get('/classFilesList', trainingClassController.classFilesList);
router.put('/Update/:trainingClassId', trainingClassController.updateTrainingClass);
router.put('/questionUpdate/:questionId', trainingClassController.questionUpdate);
router.get('/trainingList', trainingClassController.trainingList);
router.delete('/fileDelete/:fileId', trainingClassController.fileDelete);
router.delete('/quizDelete/:questionId', trainingClassController.quizDelete);
router.delete('/classDelete/:trainingClassId', trainingClassController.trainingClassDelete);
router.put('/quizUpdate/:quizId', trainingClassController.quizUpdate);
router.put('/trainingClassUpdateByName/:trainingClassId', trainingClassController.trainingClassUpdateByName);
router.post('/filePermissionAdd', trainingClassController.filePermissionAdd);
router.get('/filePermissionList', trainingClassController.filePermissionList);
router.get('/getTrainingClassList', trainingClassController.getTrainingClassList);
router.post('/quizAdd', trainingClassController.quizAdd);
module.exports = router;

