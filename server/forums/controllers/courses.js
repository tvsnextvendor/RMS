const Course                 = require('../models').Course;
const TrainingClass          = require('../models').TrainingClass;
const CourseTrainingClassMap = require('../models').CourseTrainingClassMap;
const File                   = require('../models').File;
const User                   = require('../models').User;
const Utils                  = require('./../utils/Utils');
const responsehandler        = require('./../utils/responseHandler');
const sequelize              = require('sequelize');
const Model 	             = require('../models/');
const settings 	             = require('../config/configuration');
module.exports = {
    list(req, res) {
        var userInput = Utils.getReqValues(req);
        var conditions = {};
        var response = {};
        if (userInput.courseId) {
            conditions['courseId'] = userInput.courseId;
        }
        var limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if(userInput.created){
            conditions['createdBy'] = userInput.created;
        }
        Course.findAll({
            where: conditions,
            attributes: [
                'courseId',
                'courseName',
                'createdBy',
                'created',
                'updated'
            ],
            include: [{
                model: CourseTrainingClassMap,
                attributes: [
                    'courseTrainingClassMapId',
                    'courseId',
                    'trainingClassId'
                ],
                required :false,
                include: [{
                    model: TrainingClass,
                    required :false,
                    attributes: [
                        'trainingClassName'

                    ],
                    include: [{ model: File, attributes: ['fileId'] ,required :false,}]
                }]
            },{model : User,attributes:['userName'],as:'createdByDetails',required :false,}],
            // group: [
            //     'Course.courseId',
            //     'CourseTrainingClassMaps.courseTrainingClassMapId',
            //     'CourseTrainingClassMaps->TrainingClass.trainingClassId',
            //     'createdByDetails.userId'
            // ],
            limit: limit,
            offset: offset,
            // subQuery: false,
            order: [['courseId', 'ASC']]

        }).then((result) => {
            if (result) {
                response.rows = result;
                // Only For Courses Total Count 
                Course.findAndCountAll({
                    where: conditions,
                    include: [{
                        model: CourseTrainingClassMap,
                        attributes: [],
                        include: [{
                            model: TrainingClass,
                            attributes: [],
                            include: [{ model: File, attributes: [], required: false }]
                        }]
                    }],
                    group: ['Course.courseId']
                }).then(coursesCount => {
                    response.count = coursesCount.count.length;
                    return responsehandler.getSuccessResult(response, 'Course listed successfully', res);
                });
            } else {
                return responsehandler.getNotExistsResult(result, res)
            }
        })
            .catch(function (error) {
                var errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
    },
    getCourse(req, res) {
        var userInput = Utils.getReqValues(req);
        var conditions = {};
        var trainingConditions = {};
        var response = {};
        if (userInput.courseId) {
            conditions['courseId'] = userInput.courseId;
        }
        if(userInput.trainingClassId){
            trainingConditions['trainingClassId'] = userInput.trainingClassId;
        }
     
        Course.findAll({
            where: conditions,
            attributes: [
                'courseId',
                'courseName'
            ],
            include: [{
                model: CourseTrainingClassMap,
                include: [{
                    model: TrainingClass,
                   where : trainingConditions
                }]
            },{model : User,attributes:['userName'],as:'createdByDetails'}],
            order: [['courseId', 'ASC']],
           // group: ['Course.courseId']
        }).then((result) => {
            if (result) {
                return responsehandler.getSuccessResult(result, 'Course listed successfully', res);
               
            } else {
                return responsehandler.getNotExistsResult(result, res)
            }
        })
            .catch(function (error) {
                var errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
    },
    getCreatedByDetails(req,res){
        var userInput = Utils.getReqValues(req);
        const CreatedArray = [];
        Course.findAll({
            attributes : ['createdBy']
        }).then((courses) =>{
            courses.forEach(function(item) { 
                CreatedArray.push(item.dataValues.createdBy);
            });
            User.findAll({where:{createdBy : CreatedArray}}).then((created) =>{
                return responsehandler.getSuccessResult(created, 'Created listed successfully', res);
            });
           // CreatedArray.push()
            
        });




    },
    add(req, res)
    {
		var userInput = Utils.getReqValues(req);
		if (!userInput.courseName) {
			const errorMessage = "Course Name is mandatory";
			return responsehandler.getErrorResult(errorMessage, res);
      	}
      	Course
        	.create(userInput)
        	.then((courseData) => {
          		if (userInput.courseTrainingClasses) {
            		let trainingData = [];
            		userInput.courseTrainingClasses.forEach(trainingClassId => {
						let trainingObj = {};
						trainingObj.courseId = courseData.courseId;
						trainingObj.trainingClassId = trainingClassId;
						trainingData.push(trainingObj);
					});
            		CourseTrainingClassMap.bulkCreate(trainingData)
              			.then((result) => {
                			return responsehandler.getSuccessResult(courseData,'Course saved successfully', res);
              			})
						.catch ((err) => {
							var errorMessage = Utils.constructErrorMessage(err);
							return responsehandler.getErrorResult(errorMessage,res );
						});
          		} else {
            		return responsehandler.getSuccessResult(courseData,'Course saved successfully', res);  
          		}
        })
        .catch((error) => {
          	var errorMessage = Utils.constructErrorMessage(error);
          	return responsehandler.getErrorResult(errorMessage,res );
      	});
    },
    // Get Employees in a Course 
    getEmployees(req, res) {
        let userInput = Utils.getReqValues(req);
        Model.TrainingScheduleResorts.findAndCountAll({
            where:{courseId: userInput.courseId}, 
            attributes:['userId','courseId', 'status','completedDate'], 
            include:[{model:Model.TrainingSchedule, attributes:['name','assignedDate','dueDate','notificationDays'] },
                     {model:Model.User, attributes:['userId','userName','email','employeeId'] }]
        }).then((allUsers) => {
            if(allUsers &&   allUsers.rows && allUsers.rows.length){
                responsehandler.getSuccessResult( allUsers,"Employees Listed Successfully", res );	
            }else{
                responsehandler.getSuccessResult( allUsers.rows, "No Employees Found in this Course", res );
            }
        }).catch(function(error){
            responsehandler.getErrorResult(error,res );
        });	
    },
    getCourseByStatus(req, res) {
        let userInput = Utils.getReqValues(req);
        if(!userInput.status || !userInput.userId){
            responsehandler.getErrorResult("Both Status and UserId are mandatory", res );
            return false;
        }
        Model.TrainingScheduleResorts.findAndCountAll({
            where:{  $and: [{userId : +userInput.userId},{status: userInput.status} ]  }, 
            limit: userInput.limit ? userInput.limit : settings.LIMIT,
            offset: userInput.offset ? userInput.offset : settings.OFFSET,
            attributes:['userId','courseId', 'status','completedDate', 'trainingScheduleId'], 
            include:[{model:Model.TrainingSchedule, attributes:['name','assignedDate','dueDate','notificationDays', 'trainingScheduleId'] },
                     {model:Model.Course, attributes:['courseId','courseName','topic','createdBy'], 
                     include:[{model:Model.CourseTrainingClassMap , include:[{model:Model.TrainingClass , attributes:['trainingClassName', 'trainingClassId']}]  }]  }]
        }).then((allCourses) => {
            if(allCourses &&  allCourses.rows && allCourses.rows.length){
                responsehandler.getSuccessResult( allCourses,"Courses Listed Successfully", res );	
            }else{
                responsehandler.getSuccessResult( allCourses.rows, "No Course Found in this Status", res );
            }
        }).catch(function(error){
            responsehandler.getErrorResult(error,res );
        });	
    },
    update(req, res) {
    },
    //delete user
    delete(req, res) {
    }
}

