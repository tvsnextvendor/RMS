
'use strict';
const express = require('express');
const router = express.Router();
const coursesController = require('./../controllers/courses');

router.post('/Add', coursesController.add);
router.get('/List', coursesController.list);
router.put('/Update/:courseId', coursesController.update);
router.delete('/Delete/:courseId', coursesController.delete);
router.get('/getCourse',coursesController.getCourse);
router.get('/getEmployees',coursesController.getEmployees);
router.get('/courseByStatus',coursesController.getCourseByStatus);
router.get('/getCreatedByDetails',coursesController.getCreatedByDetails);
router.get('/getEditdetails',coursesController.getEditdetails);
router.put('/courseUpdate/:courseId',coursesController.courseUpdate);
router.post('/assignVideosToCourse',coursesController.assignVideosToCourse);
router.get('/getTrainingClasses',coursesController.getTrainingClasses);
router.post('/courseDuplicate',coursesController.courseDuplicate);
router.get('/getIndividualCourses',coursesController.getIndividualCourses);
router.post('/saveAsNewVersion/:courseId',coursesController.saveAsNewVersion);
router.delete('/recentlyDeleted/:courseId',coursesController.recentlyDeleted);
router.get('/getCourses',coursesController.getCourses);
router.get('/getSpecificCourseDatas/:courseId',coursesController.getSpecificCourseDatas);

module.exports = router;

