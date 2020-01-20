
const Utils = require('./../utils/Utils');
const responseHandler = require('./../utils/responseHandler');
const Model = require('../models/');
let moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');
const Sequelize = require('sequelize');
const config = require("../config/configuration");
module.exports = {
    // Schedule Training Based on Employees and Courses
    async scheduleTraining(req, res) {
        let userInput = Utils.getReqValues(req);
        // let notificationMsg = await Utils.getNotifications('assignCourse');
        let resortsData = [];
        let notifications = [];
        let courseIds = [];
        if (!userInput.createdBy) {
            responseHandler.getErrorResult("createdBy is mandatory", res); return false;
        }
        let userIds = userInput.userId;
        let scheduleType = userInput.scheduleType;
        let colourCode;
        let scheduleTypeDB;
        let notificationMsg;
        let notificationType;
        if (scheduleType === 'trainingClass') {
            colourCode = config.COLORCODE.class;
            scheduleTypeDB = 'trainingClass';
            notificationMsg = await Utils.getNotifications('assignClass');
            notificationType = 'assignClass';
        } else if (scheduleType === 'notification') {
            colourCode = config.COLORCODE.notification;
            scheduleTypeDB = 'notification';
            notificationMsg = await Utils.getNotifications('assignNotification');
            notificationType = 'assignNotification';
        } else {
            colourCode = config.COLORCODE.course;
            scheduleTypeDB = 'course';
            notificationMsg = await Utils.getNotifications('assignCourse');
            notificationType = 'assignCourse';
        }
        if (userInput.resort && userIds) {
            userInput.courses.forEach(function (course, coursekey) {
                course.isMandatory = (course.mandatory === true) ? true : false;
                course.isOptional = (course.mandatory === false) ? true : false;
                courseIds.push(course.courseId);
                userIds.forEach(function (user, userKey) {
                    let userObj = {}
                    userObj['userId'] = user;
                    userObj['divisionId'] = userInput.divisionId;
                    userObj['departmentId'] = userInput.departmentId;
                    if (scheduleType === 'trainingClass') {
                        userObj['trainingClassId'] = course.trainingClassId;
                    } else {
                        userObj['courseId'] = course.courseId;
                    }
                    userObj['resortId'] = userInput.resort.resortId;
                    if (userInput['status']) {
                        userObj['status'] = userInput['status'];
                    }
                    resortsData.push(userObj);
                    let notifyObj = {};
                    notifyObj['senderId'] = userInput.createdBy;
                    notifyObj['receiverId'] = user;
                    notifyObj['courseId'] = course.courseId;
                    let nameSector = (course.courseName) ? course.courseName : course.trainingClassName;
                    if (notificationMsg.status === true) {
                        let notifyMessage = notificationMsg.data.message;
                        let notifyMessage_1 = notifyMessage.replace(new RegExp('{{COURSE}}', 'g'), nameSector);
                        let notifyMessage_2 = notifyMessage_1.replace(new RegExp('{{USERNAME}}', 'g'), user.userName);
                        notifyObj['notification'] = notifyMessage_2;
                    }
                    notifyObj['type'] = notificationType;
                    if(userInput.assignedDate){
                        notifyObj['notificationAssignedDate'] = userInput.assignedDate;
                    }
                    notifications.push(notifyObj);
                });
            });
        }
        resortsData = _.uniqWith(resortsData, _.isEqual);
        userInput.name = userInput.name.trim();
        let trainingObject = {
            resortId: userInput.resort.resortId,
            name: userInput.name,
            colorCode: colourCode,
            scheduleType: scheduleTypeDB,
            notificationDays: userInput.notificationDays,
            assignedDate: userInput.assignedDate || null,
            dueDate: userInput.dueDate || null,
            Courses: userInput.courses || [],
            Resorts: resortsData
        }
        let whereCondnCourse = {};
        whereCondnCourse['courseId'] = { $in: courseIds };
        let updateDataCourse = {};
        updateDataCourse['status'] = 'scheduled';
        let existCheck = {};
        existCheck['name'] = userInput.name;
        existCheck['resortId'] = userInput.resort.resortId;
        return Model.sequelize.transaction(transaction => {
            return Model.Course.update(updateDataCourse, { where: whereCondnCourse }, transaction).then(function () {
                return Model.TrainingSchedule.findOne({ where: existCheck }).then(function (existsSchedule) {
                    if (!existsSchedule) {
                        return Model.TrainingSchedule.create(trainingObject, {
                            include: [
                                { model: Model.TrainingScheduleCourses, as: 'Courses', transaction },
                                { model: Model.TrainingScheduleResorts, as: 'Resorts', transaction }],
                            transaction
                        }).then(function (newTraining) {
                            if (newTraining) {
                                return Model.Notification.bulkCreate(notifications, { individualHooks: true }, transaction).then(function (responseNotify) {
                                    return { "newTraining": newTraining, 'notifications': responseNotify }
                                });
                            } else {
                                return false;
                            }
                        });
                    } else {
                        responseHandler.getErrorResult("Training schedule name must be unique", res);
                    }
                });
            });
        }).then(function (result) {
            if (result) {
                responseHandler.getSuccessResult(result.newTraining, "Training scheduled successfully", res);
            } else {
                responseHandler.getErrorResult("Training schedule not created", res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            if (err && err.name === 'SequelizeUniqueConstraintError') {
                errorMessage = "Training scheduled for the same course & user combination"
            }
            return responseHandler.getErrorResult(errorMessage, res);
        });
    },
    updateScheduleTraining(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.trainingScheduleId) {
            responseHandler.getErrorResult("trainingScheduleId is required", res);
            return false;
        } else {
            let trainingObject = {
                name: userInput.name,
                notificationDays: userInput.notificationDays,
                assignedDate: userInput.assignedDate || null,
                dueDate: userInput.dueDate || null,
            };
            let insertUserCourses = [];
            let updateUserCourses = [];
            userInput.courses.forEach(function (val, key) {
                val.isMandatory = (val.mandatory === true) ? true : false;
                val.isOptional = (val.mandatory === false) ? true : false;
                if (val.trainingScheduleCourseId) {
                    updateUserCourses.push(val);
                } else {
                    val.trainingScheduleId = userInput.trainingScheduleId
                    insertUserCourses.push(val);
                }
            });
            // To Remove Users
            if (userInput.getUserId && userInput.userId) {
                let alreadyPresentId = userInput.getUserId;
                let allUsers = userInput.userId;
                // To remove deleted users in schedule set update
                let allDifData = _.difference(alreadyPresentId, allUsers);

                // To add additional users in schedule set update
                let newDiffData = _.difference(allUsers, alreadyPresentId);
                userInput.insertUserId = newDiffData;
                let removeCodn = {};
                removeCodn['trainingScheduleId'] = userInput.trainingScheduleId;
                if (allDifData.length > 0) {
                    removeCodn['userId'] = allDifData;
                    Model.TrainingScheduleResorts.destroy({ where: removeCodn });
                }
            }

            // To Remove Courses Or TC
            if (userInput.removeCourseOrTCIds && userInput.removeCourseOrTCIds.length > 0) {
                let removeCodn = {};
                removeCodn['trainingScheduleId'] = userInput.trainingScheduleId;
                if (userInput.scheduleType === 'trainingClass') {
                    removeCodn['trainingClassId'] = { $in: userInput.removeCourseOrTCIds };
                } else {
                    removeCodn['courseId'] = { $in: userInput.removeCourseOrTCIds };
                }
                Model.TrainingScheduleCourses.destroy({ where: removeCodn });
                Model.TrainingScheduleResorts.destroy({ where: removeCodn });
            }

            //To Add Users for all courses or classes already exists
            let resortsUsersData = [];
            if (userInput.insertUserId) {
                //Update old courses with new users
                let newInsertUserIds = userInput.insertUserId;
                updateUserCourses.forEach(function (course, coursekey) {
                    newInsertUserIds.forEach(function (user, userKey) {
                        let userObj = {};
                        userObj['userId'] = user;
                        userObj['divisionId'] = userInput.divisionId;
                        userObj['departmentId'] = userInput.departmentId;
                        if (userInput.scheduleType === 'trainingClass') {
                            userObj['trainingClassId'] = course.trainingClassId;
                        } else {
                            userObj['courseId'] = course.courseId;
                        }
                        userObj['resortId'] = userInput.resort.resortId;
                        userObj['status'] = 'assigned';
                        resortsUsersData.push(userObj);
                    });
                });
            }

            // To Add Course/TC
            // New Courses
            let resortsData = [];
            if (userInput.resort && insertUserCourses) {
                insertUserCourses.forEach(function (course, coursekey) {
                    userInput.userId.forEach(function (user, userKey) {
                        let userObj = {};
                        userObj['userId'] = user;
                        userObj['divisionId'] = userInput.divisionId;
                        userObj['departmentId'] = userInput.departmentId;
                        if (userInput.scheduleType === 'trainingClass') {
                            userObj['trainingClassId'] = course.trainingClassId;
                        } else {
                            userObj['courseId'] = course.courseId;
                        }
                        userObj['resortId'] = userInput.resort.resortId;
                        // if(userInput.reschedule === 1){
                        userObj['status'] = 'assigned';
                        //}
                        resortsData.push(userObj);
                    });
                });
            }
            resortsData = resortsData.concat(resortsUsersData);
            resortsData.forEach(function (val, key) {
                val.trainingScheduleId = userInput.trainingScheduleId;
                delete val.userName;
            });
            // To Update Course
            // Update Old Courses
            let resortUpdateData = [];
            if (userInput.resort && updateUserCourses) {
                updateUserCourses.forEach(function (course, coursekey) {
                    userInput.userId.forEach(function (user, userKey) {
                        let updateObj = {};
                        updateObj['userId'] = user;
                        updateObj['divisionId'] = userInput.divisionId;
                        updateObj['departmentId'] = userInput.departmentId;
                        updateObj['trainingScheduleId'] = userInput.trainingScheduleId;
                        updateObj['scheduleType'] = userInput.scheduleType;
                        if (userInput.scheduleType === 'trainingClass') {
                            updateObj['trainingClassId'] = course.trainingClassId;
                        } else {
                            updateObj['courseId'] = course.courseId;
                        }
                        updateObj['status'] = 'assigned';
                        updateObj['resortId'] = userInput.resort.resortId;
                        resortUpdateData.push(updateObj);
                    });
                });
            }
            // console.log("resortsUsersData", " -   To Add Users for all courses or classes already exists");
            // console.log(resortsUsersData);

            // console.log("resortUpdateData", " -   To update course");
            // console.log(resortUpdateData);

            // console.log("resortsData", " -   To add course");
            // console.log(resortsData)
            //return false;
            let whereCondn = {};
            whereCondn['trainingScheduleId'] = userInput.trainingScheduleId;
            return Model.sequelize.transaction(transaction => {
                return Model.TrainingSchedule.findOne({ where: whereCondn }, transaction).then(function (response) {
                    if (response) {
                        let statusCodn = {};
                        statusCodn['trainingScheduleId'] = userInput.trainingScheduleId;
                        statusCodn['status'] = { $in: ['inProgress', 'completed', 'expired'] };
                        return Model.TrainingScheduleResorts.findOne({ where: statusCodn }, transaction).then(function (scheduleRes) {
                            if (scheduleRes) {
                                let errorMsg;
                                if (scheduleRes.dataValues.status === 'expired') {
                                    errorMsg = "This schedule is already expired";
                                } else {
                                    errorMsg = "This schedule is already in progress. You cannot make any changes to this schedule";
                                }
                                return responseHandler.getErrorResult(errorMsg, res);
                            } else {
                                return Model.TrainingSchedule.update(trainingObject, { where: whereCondn }, transaction).then(function (update) {
                                    return Model.TrainingScheduleCourses.bulkCreate(insertUserCourses, { individualHooks: true }, transaction).then(function (insertnewCourses) {
                                        return Promise.all(module.exports.buildRowPromises(updateUserCourses))
                                            .then(setting =>
                                                Model.TrainingScheduleResorts.findAll({ where: whereCondn }, transaction).then(Result => {
                                                })).then(function (result) {
                                                    return Model.TrainingScheduleResorts.bulkCreate(resortsData, { individualHooks: true }, transaction).then(Results => {
                                                        return Promise.all(module.exports.buildRowPromisesResorts(resortUpdateData))
                                                            .then(setting =>
                                                                Model.TrainingScheduleResorts.findAll({ where: whereCondn }, transaction).then(ResultSet => {
                                                                    return ResultSet;
                                                                })
                                                            ).then(function (result) {
                                                                return { 'TrainingScheduleResorts': result };
                                                            });
                                                    });
                                                });
                                    });
                                });
                            }
                        });
                    } else {
                        return responseHandler.getErrorResult("Training schedule id not in db", res);
                    }
                });
            }).then(function (result) {
                if (result) {
                    responseHandler.getSuccessResult(result, "Training scheduled saved successfully", res);
                } else {
                    responseHandler.getExistsResult("Training Name", res);
                }
            }).catch(function (err) {
                let errorMessage = err;
                if (err.errors) {
                    errorMessage = Utils.constructErrorMessage(err);
                }
                return responseHandler.getErrorResult(errorMessage, res);
            });
        }
    },
    //Bulk Update TrainingScheduleCourses
    buildRowPromises(requestObject) {
        const promises = _.map(requestObject, (value, key) =>
            Promise.resolve().then((Res) => {
                module.exports.updateEachCourse(value)
            }));
        return promises;
    },
    updateEachCourse(value) {
        return Model.TrainingScheduleCourses.update(value, {
            where: { trainingScheduleCourseId: value.trainingScheduleCourseId }
        }).then((schedules) => {
        }).catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            return errorMessage;
        });
    },
    //Bulk Update TrainingScheduleResorts
    buildRowPromisesResorts(requestObject) {
        const promises = _.map(requestObject, (value, key) =>
            Promise.resolve().then((Res) => {
                module.exports.updateEachResort(value)
            }));
        return promises;
    },
    updateEachResort(value) {
        let whereCondn = {};
        // if (value.scheduleType === 'trainingClass') {
        //     whereCondn['trainingClassId'] = value.trainingClassId;
        // } else {
        //     whereCondn['courseId'] = value.courseId;
        // }
        whereCondn['trainingScheduleId'] = value.trainingScheduleId;
        whereCondn['userId'] = value.userId;
        whereCondn['resortId'] = value.resortId;
        return Model.TrainingScheduleResorts.update(value, {
            where: whereCondn
        }).then((trainingScheduleResorts) => {

        }).catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            return errorMessage;
        })
    },
    // Update Scheduled Training Status Based on Assigned Date
    updateTrainingStatus(req, res) {
        let userInput = Utils.getReqValues(req);
        let searchDate = moment().format("YYYY-MM-DD");
        Model.TrainingSchedule.findAll({
            where: { assignedDate: { $eq: searchDate } },
            attributes: ['trainingScheduleId', 'assignedDate', 'dueDate']
        }).then((allSchedules) => {
            if (allSchedules && allSchedules.length) {
                const sheduleIds = allSchedules.map(schedule => schedule.trainingScheduleId);
                Model.TrainingScheduleResorts.update({ status: 'assigned' }, {
                    where: { $and: [{ trainingScheduleId: { $in: sheduleIds } }, { status: 'unAssigned' }] }
                }).then(function (updatedEmployees) {
                    if (updatedEmployees) {
                        responseHandler.getSuccessResult(updatedEmployees, "Training schedule courses assigned successfully", res);
                    } else {
                        responseHandler.getErrorResult("Error in Updating Scheduled Training Status", res);
                    }
                }).catch(function (error) {
                    responseHandler.getErrorResult(error, res);
                });
            } else {
                responseHandler.getSuccessResult([], "No Scheduled Training Available with Today Date", res);
            }
        }).catch(function (error) {
            responseHandler.getErrorResult(error, res);
        });
    },
    // Update Scheduled Training Status Based on User,  Course  and NewStatus
    async updateUserTrainingStatus(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.userId) {
            responseHandler.getErrorResult("UserId is not Given", res);
            return false;
        } else if (!userInput.status) {
            responseHandler.getErrorResult("Status is not Given", res);
            return false;
        }
        if (userInput.status === 'inProgress') {
            // let statusCheck = await Utils.statusCheckProgressSchedules(userInput, Model);
            // if (statusCheck.status === true) {
            //     responseHandler.getErrorResult("Please complete the course that is in progress before you take up the next one.", res);
            //     return false;
            // } else {
            let fileSet;
            if (userInput.courseId) {
                let files = await Utils.getTrainingClassFiles(userInput, Model);
                if (files.status === true) {
                    let courseInfo = files.data;
                    fileSet = courseInfo.dataValues.FileMappings;
                }
            } else if (userInput.trainingClassId) {
                let files = await Utils.getClassOnlyFiles(userInput, Model);
                if (files.status === true) {
                    fileSet = files.data;
                }
            }

            let courseCondn = {};
            if (userInput.typeSet == 'Class') {
                if (userInput.trainingClassId) {
                    courseCondn['trainingClassId'] = userInput.trainingClassId;
                }
            } else {
                if (userInput.courseId) {
                    courseCondn['courseId'] = userInput.courseId;
                }
                if (userInput.trainingClassId) {
                    courseCondn['trainingClassId'] = userInput.trainingClassId;
                }
            }
            courseCondn['userId'] = userInput.userId;
            Model.TrainingScheduleFiles.findOne({ where: courseCondn }).then(function (courseFileRes) {
                // if(courseFileRes === null){
                //     responseHandler.getErrorResult("Training class files are not available contact admin support team", res);
                // }

                if (!courseFileRes) {
                    let fileAssignArray = [];
                    if (fileSet.length > 0) {
                        fileSet.forEach(function (val, key) {
                            let obj = {};
                            obj.status = 'Not Completed';
                            obj.trainingClassId = val.dataValues.trainingClassId;
                            if (userInput.courseId) {
                                obj.courseId = val.dataValues.courseId;
                            }
                            obj.fileId = val.dataValues.fileId;
                            obj.userId = userInput.userId;
                            fileAssignArray.push(obj);
                        });
                        Model.TrainingScheduleFiles.bulkCreate(fileAssignArray, { individualHooks: true }).then(function (scheduledFilesSet) {
                            module.exports.statusUpdateFunction(userInput, res);
                        });

                    }
                } else {
                    module.exports.statusUpdateFunction(userInput, res);
                }
            });
            //  }
        } else {
            module.exports.statusUpdateFunction(userInput, res);
        }
    },
    statusUpdateFunction(userInput, res) {
        let condition = {};
        if (userInput.courseId) {
            condition['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            condition['trainingClassId'] = userInput.trainingClassId;
        }
        condition['userId'] = userInput.userId;
        Model.TrainingScheduleResorts.update({ status: userInput.status }, {
            where: { $and: [condition] }
        }).then(function (updatedEmployees) {
            if (updatedEmployees && updatedEmployees[0]) {
                responseHandler.getSuccessResult(updatedEmployees, "Training schedule courses status updated successfully", res);
            } else {
                responseHandler.getErrorResult("Error in Updating Scheduled Training Status or No such Course Training Available", res);
            }
        }).catch(function (error) {
            responseHandler.getErrorResult(error, res);
        });
    },
    // Update  Status Based on File,  Course  and NewStatus
    updateFileTrainingStatus(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.fileId) {
            responseHandler.getErrorResult("fileId is not Given", res);
            return false;
        } else if (!userInput.status) {
            responseHandler.getErrorResult("Status is not Given", res);
            return false;
        } else if (!userInput.userId) {
            responseHandler.getErrorResult("userId is not Given", res);
            return false;
        }
        if (userInput.status === 'completed') {
            userInput.status = 'Completed';
        }
        if (userInput.status === 'notCompleted') {
            userInput.status = 'Not Completed';
        }
        let completedDate = new Date();
        let updateData = {};
        updateData['completedDate'] = completedDate;
        let filesCodn = {};
        filesCodn['fileId'] = userInput.fileId;
        if (userInput.courseId) {
            filesCodn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            filesCodn['trainingClassId'] = userInput.trainingClassId;
        }
        filesCodn['userId'] = userInput.userId;
        Model.TrainingScheduleFiles.findAll({
            where: { $and: [filesCodn] }
        }).then(function (updatedEmployees) {
            if (updatedEmployees.length > 0) {
                Model.TrainingScheduleFiles.update({ status: userInput.status }, {
                    where: { $and: [filesCodn] }
                }).then(function (updatedEmployees) {
                    if (updatedEmployees && updatedEmployees[0]) {
                        responseHandler.getSuccessResult(updatedEmployees, "Training schedule files status updated successfully", res);
                    }
                });
            } else {
                Model.TrainingScheduleFiles.create(userInput).then(function (response) {
                    if (!response) {
                        responseHandler.getErrorResult("Error in Updating Scheduled Training Status or No such Course Training Available", res);
                    } else {
                        responseHandler.getSuccessResult(response, "Training schedule files status updated successfully", res);
                    }
                });
            }
        }).catch(function (error) {
            responseHandler.getErrorResult(error, res);
        });
    },
    async updateTrainingClassCompletedStatus(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.status) {
            responseHandler.getErrorResult("Status is not Given", res);
            return false;
        } else if (!userInput.userId) {
            responseHandler.getErrorResult("userId is not Given", res);
            return false;
        } else if (!userInput.resortId) {
            responseHandler.getErrorResult("resortId is not Given", res);
            return false;
        }
        userInput.status = (userInput.status === 'completed') ? 'Completed' : 'Not Completed';
        // let markPercentage;
        // let needPercentage = await Utils.coursePassPercentage(userInput,Model);
        // if(needPercentage.status === true){
        //     markPercentage = needPercentage.data[0].dataValues.passPercentage;
        // }
        let markPercentage = userInput.passPercentage;
        if (userInput.typeSet === 'Course') {
            let countClasscomplete;
            let completedClassesCount = await Utils.completedClassesCount(userInput, Model);
            if (completedClassesCount.status === true) {
                countClasscomplete = completedClassesCount.data;
            }

            let courseCondition = {};
            if (userInput.courseId) {
                courseCondition['courseId'] = userInput.courseId;
            }
            let filesCodn = {};
            filesCodn['courseId'] = userInput.courseId;
            filesCodn['status'] = 'Not Completed';
            filesCodn['fileId'] = { $eq: null };
            Model.Course.findAll({
                include: [
                    {
                        model: Model.CourseTrainingClassMap,
                    }
                ],
                where: courseCondition
            }).then(async function (courses) {
                let classesLength;
                if (courses && userInput.courseId) {
                    classesLength = (courses[0].dataValues.CourseTrainingClassMaps.length);
                }
                //console.log(classesLength, "Classes for course length");
                //console.log(countClasscomplete, "completed classes count tracked");
                if (classesLength === countClasscomplete) {
                    module.exports.generateCertificate(userInput, 'Course', markPercentage);
                    return responseHandler.getSuccessResult(courses, "Status saved successfully", res);
                } else {
                    let classRes = await module.exports.classCompletion(userInput, 'Class', markPercentage);
                    // console.log("classRes status update change");
                    // classRes.then(function(data){
                    //     console.log(data);
                    if (classRes.status === true) {
                        return responseHandler.getSuccessResult(courses, "Status saved successfully", res);
                    }
                    // });
                }
            });
        }
        else if (userInput.typeSet === 'Class') {
            let classRes = module.exports.classCompletion(userInput, 'Class', markPercentage);
            if (classRes.status === true) {
                return responseHandler.getSuccessResult(req, "Status saved successfully", res);
            }
        }
    },
    classCompletion(userInput, type, markPercentage) {
        // console.log("class completion userinput");
        // console.log(userInput);
        // console.log("class completion userinput");
        return new Promise(resolve => {
            try {
                let courseCondn = {};
                courseCondn['resortId'] = userInput.resortId;
                courseCondn['userId'] = userInput.userId;
                if (userInput.courseId) {
                    courseCondn['courseId'] = userInput.courseId;
                }
                if (userInput.trainingClassId) {
                    courseCondn['trainingClassId'] = userInput.trainingClassId;
                }

                let percent = userInput.percentage;
                if (percent >= markPercentage) {
                   // console.log("eneterd here");
                    let filesCodn = {};
                    filesCodn['fileId'] = { $eq: null };
                    if (userInput.courseId) {
                        filesCodn['courseId'] = userInput.courseId;
                    }
                    if (userInput.trainingClassId) {
                        filesCodn['trainingClassId'] = userInput.trainingClassId;
                    }
                    if (userInput.userId) {
                        filesCodn['userId'] = userInput.userId;
                    }

                    // console.log(filesCodn);

                    let completeStatus = {};
                    completeStatus['status'] = 'Completed';
                    Model.TrainingScheduleFiles.findAll({ where: filesCodn }).then(function (responseSet) {
                        if (responseSet.length > 0) {
                            Model.TrainingScheduleFiles.update(completeStatus, { where: filesCodn });
                        } else {
                            let completeObj = {};
                            completeObj.courseId = (userInput.courseId) ? userInput.courseId : null;
                            completeObj.trainingClassId = (userInput.trainingClassId) ? userInput.trainingClassId : null;
                            completeObj.userId = userInput.userId;
                            completeObj.status = 'Completed';
                            completeObj.fileId = null;
                            Model.TrainingScheduleFiles.create(completeObj);
                        }
                    });
                }

                Model.FeedbackMapping.findOne({
                    where: courseCondn,
                    include: [{ model: Model.Feedback }],
                    order: [['created', 'DESC']],
                    limit: 1
                }).then(async function (feedbacks) {
                    if (feedbacks) {
                        let percentage = feedbacks.dataValues.passPercentage;

                        // console.log("percentage setup formations");
                        // console.log(percentage)
                        // console.log(markPercentage)
                        // console.log("markPercentage setup formations");

                        if (percentage >= markPercentage) {
                            let badgeCreate = {};
                            Model.Badges.findOne({
                                where: {
                                    percentage: { $lte: percentage },
                                    resortId: userInput.resortId
                                },
                                order: [['percentage', 'DESC']],
                            }).then(function (badges) {

                               // console.log(badges);
                                if (badges) {
                                    badgeCreate.badgeId = badges.dataValues.badgeId;

                                }
                                Model.CertificateUserMapping.findAll({ where: courseCondn }).then(function (certificatesPresent) {
                                    if (certificatesPresent.length > 0) {
                                        Model.CertificateUserMapping.update(badgeCreate, { where: courseCondn });
                                    } else {
                                        let badgeCodn = {};
                                        badgeCodn = courseCondn;
                                        badgeCodn.badgeId = (badges) ? badges.dataValues.badgeId : null;
                                        Model.CertificateUserMapping.create(badgeCodn, courseCondn);
                                    }
                                });

                                let feedbackCodn = {};
                                if (userInput.courseId) {
                                    feedbackCodn['courseId'] = userInput.courseId;
                                }
                                if (userInput.trainingClassId) {
                                    feedbackCodn['trainingClassId'] = userInput.trainingClassId;
                                }
                                feedbackCodn['userId'] = userInput.userId;
                                feedbackCodn['resortId'] = userInput.resortId;
                                feedbackCodn['status'] = { $eq: null };
                                Model.FeedbackMapping.update({ 'status': 'passed' }, { where: feedbackCodn });

                                // newly added
                                let newFeedBackCondn = {};
                                if (userInput.courseId) {
                                    newFeedBackCondn['courseId'] = userInput.courseId;
                                }
                                if (userInput.trainingClassId) {
                                    newFeedBackCondn['trainingClassId'] = userInput.trainingClassId;
                                }
                                newFeedBackCondn['userId'] = userInput.userId;
                                newFeedBackCondn['resortId'] = userInput.resortId;
                                newFeedBackCondn['status'] = 'failed';
                               // console.log("here newFeedBackCondn",newFeedBackCondn);
                                Model.FeedbackMapping.update({ 'latestFailed': false }, { where: newFeedBackCondn });

                                let scheduleCodn = {};
                                if (userInput.courseId && userInput.typeSet === 'Course') {
                                    scheduleCodn['courseId'] = userInput.courseId;
                                }
                                if (userInput.trainingClassId && userInput.typeSet === 'Class') {
                                    scheduleCodn['trainingClassId'] = userInput.trainingClassId;
                                }
                                scheduleCodn['userId'] = userInput.userId;
                                scheduleCodn['resortId'] = userInput.resortId;

                                // console.log("Passing Class");
                                // console.log(scheduleCodn);
                                let completedDate = new Date();
                                if (userInput.typeSet === 'Class' && type === 'Class') {
                                    Model.TrainingScheduleResorts.update({ 'status': 'completed', 'completedDate': completedDate }, { where: scheduleCodn }).then(function (completeStatus) {
                                        resolve({ status: true });
                                    });
                                } else {
                                    Model.TrainingScheduleResorts.update({ 'status': 'inProgress' }, { where: scheduleCodn }).then(function (updateResult) {
                                        resolve({ status: true });
                                    });
                                }
                            });
                        } else {
                            let filesCodn = {};
                            filesCodn['fileId'] = { $eq: null };
                            if (userInput.courseId) {
                                filesCodn['courseId'] = userInput.courseId;
                            }
                            if (userInput.trainingClassId) {
                                filesCodn['trainingClassId'] = userInput.trainingClassId;
                            }
                            let unCompleteStatus = {};
                            unCompleteStatus['status'] = 'Not Completed';
                            Model.TrainingScheduleFiles.findAll({ where: filesCodn }).then(function (responseSet) {
                                if (responseSet.length > 0) {
                                    Model.TrainingScheduleFiles.update(unCompleteStatus, { where: filesCodn });
                                } else {
                                    let notCompleteObj = {};
                                    notCompleteObj.courseId = (userInput.courseId) ? userInput.courseId : null;
                                    notCompleteObj.trainingClassId = (userInput.trainingClassId) ? userInput.trainingClassId : null;
                                    notCompleteObj.userId = userInput.userId;
                                    notCompleteObj.status = 'Not Completed';
                                    notCompleteObj.fileId = null;
                                    Model.TrainingScheduleFiles.create(notCompleteObj);
                                }
                            });

                            let attemptCodn = {};
                            let failedItemsCodn = {};
                            attemptCodn['resortId'] = userInput.resortId;
                            attemptCodn['userId'] = userInput.userId;
                            failedItemsCodn['resortId'] = userInput.resortId;
                            failedItemsCodn['userId']    = userInput.userId;

                            if (userInput.courseId) {
                                attemptCodn['courseId'] = userInput.courseId;
                                failedItemsCodn['courseId'] = userInput.courseId;
                            }
                            if (userInput.trainingClassId) {
                                attemptCodn['trainingClassId'] = userInput.trainingClassId;
                                failedItemsCodn['trainingClassId'] = userInput.trainingClassId;
                            }
                            failedItemsCodn['status'] = 'failed';

                            //console.log("feedbacks values");
                            //console.log(feedbacks);
                            if (feedbacks)
                            {
                                // old section
                                let attempt = (feedbacks.dataValues) ? (feedbacks.dataValues.attempt) + 1 : 1;
                                attemptCodn['attempt'] = {$eq: null};
                                Model.FeedbackMapping.update({ 'status': 'failed', 'attempt': attempt,'latestFailed':true}, { where: attemptCodn });
                                    // set new workouts
                                    //console.log("failedItemsCodn");
                                   // console.log(failedItemsCodn);
                                    Model.FeedbackMapping.findAll({where:failedItemsCodn,order:[['created','ASC']]}).then(function(feedback){
                                        let failedItems= [];
                                        feedback.forEach(function(val,key){
                                            failedItems.push(val.dataValues.feedbackMappingId);
                                        });
                                        //console.log(failedItems);
                                        let omitlastfailedItems = failedItems.pop();
                                       // console.log('omitlastfailedItems',omitlastfailedItems);
                                        let whereSet = {};
                                        if(failedItems.length > 0){
                                            whereSet['feedbackMappingId'] = {$in :failedItems};
                                            Model.FeedbackMapping.update({'latestFailed':false},{where:whereSet});
                                        }
                                    });
                            } else {
                                Model.FeedbackMapping.update({ 'status': 'failed', 'attempt': 1,'latestFailed':true }, { where: attemptCodn });
                            }
                            let scheduleCodn = {};
                            if (userInput.courseId && userInput.typeSet === 'Course') {
                                scheduleCodn['courseId'] = userInput.courseId;
                            }
                            if (userInput.trainingClassId && userInput.typeSet === 'Class') {
                                scheduleCodn['trainingClassId'] = userInput.trainingClassId;
                            }
                            scheduleCodn['userId'] = userInput.userId;
                            scheduleCodn['resortId'] = userInput.resortId;

                            if (userInput.typeSet === 'Class') {
                                Model.TrainingScheduleResorts.update({ 'status': 'failed' }, { where: scheduleCodn }).then(function (updateResult) {
                                    resolve({ status: true });
                                });
                            } else {
                                Model.TrainingScheduleResorts.update({ 'status': 'inProgress' }, { where: scheduleCodn }).then(function (updateResult) {
                                    resolve({ status: true });
                                });
                            }
                        }
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    generateCertificate(userInput, type, markPercentage) {
        let courseCondn = {};
        courseCondn['resortId'] = userInput.resortId;
        courseCondn['userId'] = userInput.userId;
        if (userInput.courseId) {
            courseCondn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            courseCondn['trainingClassId'] = userInput.trainingClassId;
        }
        Model.FeedbackMapping.findOne({
            where: courseCondn,
            include: [{ model: Model.Feedback }],
            order: [['created', 'DESC']],
            limit: 1
        }).then(async function (feedbacks) {
            if (feedbacks) {
                let percentage = feedbacks.dataValues.passPercentage;
                if (percentage >= markPercentage) {
                    // Certificate Generation Only For Course ;
                    let certificates;
                    let filePath;
                    let certificateId;
                    let certificatesData = await Utils.getCertificate(userInput, Model);
                    if (certificatesData.status === true) {
                        certificates = certificatesData.data;
                        if (certificates) {
                            let someFile = certificates.dataValues.Certificate.dataValues.certificateHtmlPath;
                            filePath = path.join(__dirname, '../' + someFile);
                            certificateId = certificates.dataValues.Certificate.dataValues.certificateId;
                        } else {
                            filePath = path.join(__dirname, '../utils/default-certificate.html');
                            certificateId = null;
                        }
                    }
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        userInput.courseName = (userInput.courseName) ? userInput.courseName : userInput.trainingClassName;
                        let username = userInput.firstName + ' ' + ((userInput.lastName) ? userInput.lastName : '');
                        let result = data.replace(new RegExp('{{Name}}', 'g'), username);
                        let result1 = result.replace(new RegExp('{{CourseName}}', 'g'), userInput.courseName);
                        let currentdate = moment(new Date()).format('LL');
                        let result2 = result1.replace(new RegExp('{{DATE}}', 'g'), currentdate);
                        let certificateusercodn = {};
                        certificateusercodn.certificateGenerated = result2;
                        certificateusercodn.certificateId = certificateId;
                        Model.CertificateUserMapping.update(certificateusercodn, { where: courseCondn });
                        let scheduleCodn = {};
                        if (userInput.courseId && userInput.typeSet === 'Course') {
                            scheduleCodn['courseId'] = userInput.courseId;
                        }
                        if (userInput.trainingClassId && userInput.typeSet === 'Class') {
                            scheduleCodn['trainingClassId'] = userInput.trainingClassId;
                        }
                        scheduleCodn['userId'] = userInput.userId;
                        scheduleCodn['resortId'] = userInput.resortId;
                        let completedDate = new Date();
                        Model.TrainingScheduleResorts.update({ 'status': 'completed', 'completedDate': completedDate }, { where: scheduleCodn });
                    });
                } else {
                    let unCompleteStatus = {};
                    unCompleteStatus['status'] = 'Not Completed';
                    let filesCodn = {};
                    filesCodn['fileId'] = { $eq: null };
                    if (userInput.courseId) {
                        filesCodn['courseId'] = userInput.courseId;
                    }
                    if (userInput.trainingClassId) {
                        filesCodn['trainingClassId'] = userInput.trainingClassId;
                    }
                    Model.TrainingScheduleFiles.update(unCompleteStatus, { where: filesCodn });
                    let attemptCodn = {};
                    attemptCodn['resortId'] = userInput.resortId;
                    attemptCodn['userId'] = userInput.userId;
                    if (userInput.courseId) {
                        attemptCodn['courseId'] = userInput.courseId;
                    }
                    if (userInput.trainingClassId) {
                        attemptCodn['trainingClassId'] = userInput.trainingClassId;
                    }
                    //console.log("feedbacks.dataValues.attempt");
                    if (feedbacks) {
                        //console.log(feedbacks.dataValues.attempt);
                        let attempt = parseInt(feedbacks.dataValues.attempt) + 1;
                        attemptCodn['attempt'] = { $eq: null };
                        Model.FeedbackMapping.update({ 'status': 'failed', 'attempt': attempt }, { where: attemptCodn });
                    } else {
                        Model.FeedbackMapping.update({ 'status': 'failed', 'attempt': 1 }, { where: attemptCodn });
                    }
                    let scheduleCodn = {};
                    if (userInput.courseId && userInput.typeSet === 'Course') {
                        scheduleCodn['courseId'] = userInput.courseId;
                    }
                    if (userInput.trainingClassId && userInput.typeSet === 'Class') {
                        scheduleCodn['trainingClassId'] = userInput.trainingClassId;
                    }
                    scheduleCodn['userId'] = userInput.userId;
                    scheduleCodn['resortId'] = userInput.resortId;
                    Model.TrainingScheduleResorts.update({ 'status': 'inProgress' }, { where: scheduleCodn });
                }
            }
        });
    },
    updateTrainingClassCompletedStatus_oldcode(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.status) {
            responseHandler.getErrorResult("Status is not Given", res);
            return false;
        } else if (!userInput.userId) {
            responseHandler.getErrorResult("userId is not Given", res);
            return false;
        } else if (!userInput.resortId) {
            responseHandler.getErrorResult("resortId is not Given", res);
            return false;
        }
        if (userInput.status === 'completed') {
            userInput.status = 'Completed';
        }
        if (userInput.status === 'notCompleted') {
            userInput.status = 'Not Completed';
        }
        let conditionSet = {};
        conditionSet['fileId'] = { $eq: null };
        if (userInput.courseId) {
            conditionSet['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            conditionSet['trainingClassId'] = userInput.trainingClassId;
        }
        conditionSet['userId'] = userInput.userId;
        let andConditions = [conditionSet];
        let courseCondition = {};
        if (userInput.courseId) {
            courseCondition['courseId'] = userInput.courseId;
        }
        Model.Course.findAll({
            include: [{ model: Model.CourseTrainingClassMap }],
            where: courseCondition
        }).then(function (courses) {
            let coursesLength;
            if (courses && userInput.courseId) {
                coursesLength = (courses[0].dataValues.CourseTrainingClassMaps.length);
            } else {
                coursesLength = null;
            }
            Model.TrainingScheduleFiles.findAll({
                where: { $and: andConditions }
            }).then(function (filesStatus) {
                if (filesStatus.length > 0) {
                    let completedCondn = {};
                    if (userInput.courseId) {
                        completedCondn['courseId'] = userInput.courseId;
                    }
                    completedCondn['userId'] = userInput.userId;
                    completedCondn['fileId'] = null;
                    completedCondn['status'] = 'Completed';

                    let classCompletedCodn = {};
                    if (userInput.trainingClassId) {
                        classCompletedCodn['trainingClassId'] = userInput.trainingClassId;
                    }
                    classCompletedCodn['userId'] = userInput.userId;
                    classCompletedCodn['fileId'] = null;
                    classCompletedCodn['status'] = 'Completed';

                    Model.TrainingScheduleFiles.findAll({
                        where: { $and: [classCompletedCodn] }
                    }).then(function (classAllFiles) {
                        Model.TrainingScheduleFiles.findAll({
                            where: { $and: [completedCondn] }
                        }).then(function (coursesAllFiles) {
                            let completedCount = coursesAllFiles.length;
                            let completedClassCount = classAllFiles.length;
                            let whereCondn = {};
                            let courseCondn = {};
                            let classCodn = {};
                            if (userInput.courseId) {
                                whereCondn['courseId'] = userInput.courseId;
                                courseCondn['courseId'] = userInput.courseId;
                            }
                            if (userInput.trainingClassId) {
                                whereCondn['trainingClassId'] = userInput.trainingClassId;
                                classCodn['trainingClassId'] = userInput.trainingClassId;
                            }
                            whereCondn['userId'] = userInput.userId;
                            whereCondn['resortId'] = userInput.resortId;

                            classCodn['userId'] = userInput.userId;
                            classCodn['resortId'] = userInput.resortId;

                            courseCondn['userId'] = userInput.userId;
                            courseCondn['resortId'] = userInput.resortId;
                            if ((userInput.typeSet === 'Course') && (coursesLength === completedCount)) {
                                console.log("here course", courseCondn);
                                let completedDate = new Date();
                                Model.TrainingScheduleResorts.update({ 'status': 'completed', 'completedDate': completedDate }, { where: courseCondn }).then(function (resStatus) {
                                    module.exports.certificateGeneration(userInput, 'Course', null);
                                    return responseHandler.getSuccessResult(resStatus, "Status saved successfully", res);
                                });
                            } else if ((userInput.typeSet != 'Course') && (1 == completedClassCount)) {
                                console.log("here class", classCodn);
                                let completedDate = new Date();
                                Model.TrainingScheduleResorts.update({ 'status': 'completed', 'completedDate': completedDate }, { where: classCodn }).then(function (resStatus) {
                                    module.exports.certificateGeneration(userInput, 'Class', null);
                                    return responseHandler.getSuccessResult(resStatus, "Status saved successfully", res);
                                });
                            } else {
                                console.log("else condn bad condn", classCodn);
                                Model.TrainingScheduleResorts.update({ 'status': 'inProgress' }, { where: whereCondn }).then(function (resStatus) {
                                    module.exports.certificateGeneration(userInput, 'Class', null);
                                    return responseHandler.getSuccessResult(resStatus, "Status saved successfully", res);
                                });
                            }
                        });
                    });
                } else {



                    let updateData = {};
                    if (userInput.courseId) {
                        updateData['courseId'] = userInput.courseId;
                    }
                    if (userInput.trainingClassId) {
                        updateData['trainingClassId'] = userInput.trainingClassId;
                    }
                    updateData['userId'] = userInput.userId;
                    updateData['status'] = 'Completed';
                    let completedDate = new Date();
                    updateData['completedDate'] = completedDate;

                    let type = (coursesLength === 1) ? 'Course' : 'Class';
                    let onlyType = 'oneClass';
                    Model.TrainingScheduleFiles.create(updateData).then(function (response) {
                        module.exports.certificateGeneration(userInput, type, onlyType);
                        return responseHandler.getSuccessResult(response, "Status saved successfully", res);
                    });
                }
            });
        });
    },
    certificateGeneration(userInput, type, oneClass) {
        let courseCondn = {};
        let certificateCodn = {};
        let certificateusercodn = {};
        let conditionSet = {};
        if (type === 'Course') {
            certificateCodn['courseId'] = userInput.courseId;
            courseCondn['courseId'] = userInput.courseId;
            courseCondn['userId'] = userInput.userId;
            certificateusercodn = {
                userId: userInput.userId, courseId: userInput.courseId, resortId: userInput.resortId
            }
        } else {
            certificateCodn['trainingClassId'] = userInput.trainingClassId;
            if (userInput.courseId) {
                courseCondn['courseId'] = userInput.courseId;
            }
            courseCondn['trainingClassId'] = userInput.trainingClassId;
            courseCondn['userId'] = userInput.userId;
            certificateusercodn['userId'] = userInput.userId;
            if (userInput.courseId) {
                certificateusercodn['courseId'] = userInput.courseId;
            }
            certificateusercodn['trainingClassId'] = userInput.trainingClassId;
            certificateusercodn['resortId'] = userInput.resortId;
            userInput.courseName = (userInput.trainingClassName) ? userInput.trainingClassName : userInput.courseName;
        }
        let unCompleteCondn = {};
        if (userInput.courseId) {
            unCompleteCondn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            unCompleteCondn['trainingClassId'] = userInput.trainingClassId;
        }
        unCompleteCondn['userId'] = userInput.userId;
        if (userInput.courseId && (userInput.typeSet === 'Course')) {
            conditionSet['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId && (userInput.typeSet === 'Class')) {
            conditionSet['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.trainingScheduleId) {
            conditionSet['trainingScheduleId'] = userInput.trainingScheduleId;
        }

        Model.TrainingScheduleCourses.findOne({ where: conditionSet, attributes: ['passPercentage', 'courseId', 'trainingClassId'] }).then(function (courseScheduled) {
            let passPercentageValue = courseScheduled.dataValues.passPercentage;
            // Certificate Generation 
            Model.FeedbackMapping.findOne({
                where: courseCondn,
                include: [{ model: Model.Feedback }],
                order: [['created', 'DESC']],
                limit: 1
            }).then(function (feedbacks) {
                if (feedbacks) {
                    let percentage = feedbacks.dataValues.passPercentage;
                    if (percentage >= passPercentageValue) {
                        Model.CertificateMapping.findOne({
                            where: certificateCodn,
                            include: [{ model: Model.Certificate }]
                        }).then(function (certificates) {
                            let filePath;
                            let certificateId;
                            if (certificates) {
                                let someFile = certificates.dataValues.Certificate.dataValues.certificateHtmlPath;
                                filePath = path.join(__dirname, '../' + someFile);
                                certificateId = certificates.dataValues.Certificate.dataValues.certificateId;
                            } else {
                                filePath = path.join(__dirname, '../utils/default-certificate.html');
                                certificateId = null;
                            }
                            fs.readFile(filePath, 'utf8', function (err, data) {
                                if (err) {
                                    return console.log(err);
                                }
                                userInput.courseName = (userInput.courseName) ? userInput.courseName : userInput.trainingClassName;
                                let username = userInput.firstName + ' ' + ((userInput.lastName) ? userInput.lastName : '');
                                let result = data.replace(new RegExp('{{Name}}', 'g'), username);
                                let result1 = result.replace(new RegExp('{{CourseName}}', 'g'), userInput.courseName);
                                let currentdate = moment(new Date()).format('LL');
                                let result2 = result1.replace(new RegExp('{{DATE}}', 'g'), currentdate);
                                Model.Badges.findOne({
                                    where: { percentage: { $lte: percentage }, resortId: userInput.resortId }, order: [
                                        ['percentage', 'DESC']
                                    ],
                                }).then(function (badges) {

                                    let unCompleteStatus = {};
                                    unCompleteStatus['status'] = 'Completed';// Passed
                                    let insertCond = {};
                                    if (userInput.courseId) {
                                        insertCond['courseId'] = userInput.courseId;
                                    }
                                    if (userInput.trainingClassId) {
                                        insertCond['trainingClassId'] = userInput.trainingClassId;
                                    }
                                    insertCond['userId'] = userInput.userId;
                                    insertCond['status'] = 'Completed';// Passed
                                    if (type === 'Class') {
                                        courseCondn['attempt'] = { $eq: null };
                                        Model.TrainingScheduleFiles.findAll({ where: unCompleteCondn }).then(function (filesCodn) {
                                            if (!filesCodn) {
                                                Model.TrainingScheduleFiles.create(insertCond);
                                            } else {
                                                Model.TrainingScheduleFiles.update(unCompleteStatus, { where: unCompleteCondn });
                                            }
                                        });

                                        Model.FeedbackMapping.update({ 'status': 'passed' }, { where: courseCondn });

                                        let newFeedBackCondn = {};
                                        if (userInput.courseId) {
                                            newFeedBackCondn['courseId'] = userInput.courseId;
                                        }
                                        if (userInput.trainingClassId) {
                                            newFeedBackCondn['trainingClassId'] = userInput.trainingClassId;
                                        }
                                        newFeedBackCondn['userId'] = userInput.userId;
                                        newFeedBackCondn['resortId'] = userInput.resortId;
                                        newFeedBackCondn['status'] = 'failed';
                                       // console.log(newFeedBackCondn ,"newFeedBackCondn");
                                        Model.FeedbackMapping.update({ 'latestFailed': false }, { where: newFeedBackCondn });

                                    }
                                    // Badges Set up

                                    let badgeId;
                                    let updateSetofCert = {};
                                    if (badges && type === 'Class') {
                                        badgeId = badges.dataValues.badgeId;
                                        updateSetofCert.badgeId = badgeId;
                                    } else if (badges && oneClass == 'oneClass') {
                                        badgeId = badges.dataValues.badgeId;
                                        updateSetofCert.badgeId = badgeId;
                                    } else {
                                        badgeId = null;
                                    }

                                    // Certificate Creation

                                    if (type === 'Course') {
                                        updateSetofCert.certificateGenerated = result2;
                                        updateSetofCert.certificateId = certificateId;
                                    }

                                    Model.CertificateUserMapping.findAll({
                                        where: certificateusercodn
                                    }).then(function (resp) {
                                        if (resp.length > 0) {


                                            Model.CertificateUserMapping.update(updateSetofCert, { where: certificateusercodn })
                                        }
                                        else {
                                            // Badges Set up
                                            let badgeId;
                                            if (badges && type === 'Class') {
                                                badgeId = badges.dataValues.badgeId;
                                                certificateusercodn.badgeId = badgeId;

                                            } else if (badges && oneClass == 'oneClass') {
                                                badgeId = badges.dataValues.badgeId;
                                                certificateusercodn.badgeId = badgeId;
                                            } else {
                                                badgeId = null;
                                            }
                                            if (type === 'Course') {
                                                certificateusercodn.certificateGenerated = result2;
                                                certificateusercodn.certificateId = certificateId;
                                            }
                                            Model.CertificateUserMapping.create(certificateusercodn).then(function (updates) {
                                            });
                                        }
                                        //  if(type === 'Course'){
                                        //     console.log("certificateusercodn for course sec");
                                        //     console.log(certificateusercodn);
                                        //  }else{
                                        //     console.log("certificateusercodn for class sec");
                                        //     console.log(certificateusercodn);
                                        //  }
                                    });
                                });
                            });
                        });
                    } else {



                        if (type === 'Class') {
                            let newCond = {};
                            let insertCond = {};
                            if (userInput.courseId) {
                                newCond['courseId'] = userInput.courseId;
                                insertCond['courseId'] = userInput.courseId;
                            }
                            if (userInput.trainingClassId) {
                                newCond['trainingClassId'] = userInput.trainingClassId;
                                insertCond['trainingClassId'] = userInput.trainingClassId;
                            }
                            newCond['resortId'] = userInput.resortId;
                            newCond['userId'] = userInput.userId;
                            newCond['status'] = 'failed';
                            insertCond['userId'] = userInput.userId;
                            insertCond['status'] = 'Not Completed';//Failed
                            let unCompleteStatus = {};
                            unCompleteStatus['status'] = 'Not Completed';//Failed




                            Model.FeedbackMapping.findOne({ where: newCond, limit: 1, order: [['created', 'DESC']] }).then(function (feedbacks) {
                                Model.TrainingScheduleFiles.findAll({ where: unCompleteCondn }).then(function (filesCodn) {


                                    if (!filesCodn) {
                                        Model.TrainingScheduleFiles.create(insertCond);
                                    } else {
                                        Model.TrainingScheduleFiles.update(unCompleteStatus, { where: unCompleteCondn });
                                    }
                                    if (feedbacks) {
                                        let attempt = feedbacks.dataValues.attempt + 1;
                                        courseCondn['attempt'] = { $eq: null };
                                        Model.FeedbackMapping.update({ 'status': 'failed', 'attempt': attempt }, { where: courseCondn });
                                        // ********* added now *******//
                                        // Model.TrainingScheduleResorts.update(updateResortStatus,{where:updateResortCodn});
                                    } else {
                                        Model.FeedbackMapping.update({ 'status': 'failed', 'attempt': 1 }, { where: courseCondn });
                                        // ********* added now *******//
                                        //  Model.TrainingScheduleResorts.update(updateResortStatus,{where:updateResortCodn});
                                    }
                                });
                            });
                        }
                    }
                }
            });
        });
    },
    checkFeedbackRated(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.trainingClassId) {
            responseHandler.getErrorResult("trainingClassId is not Given", res);
            return false;
        }
        else if (!userInput.resortId) {
            responseHandler.getErrorResult("resortId is not Given", res);
            return false;
        } else {
            let condition = {};
            if (userInput.trainingClassId) {
                condition['trainingClassId'] = userInput.trainingClassId;
            }
            condition['resortId'] = userInput.resortId;
            condition['status'] = 'passed';
            if (userInput.userId) {
                condition['userId'] = userInput.userId;
            }
            if (userInput.courseId) {
                condition['courseId'] = userInput.courseId;
            }
            Model.Feedback.findAll({
                attributes: ['feedbackId'],
                include: { model: Model.FeedbackMapping, attributes: ['trainingClassId', 'resortId'], where: condition, as: 'feedbackMap' }
            }).then(function (response) {
                if (response.length > 0) {
                    responseHandler.getSuccessResult(response, "Cannot to do course more than once after passed", res);
                } else {
                    responseHandler.getErrorResult("no feedback found", res);
                }
            });
        }
    },
    async courseEmployeestatusList(req, res) {
        let userInput = Utils.getReqValues(req);
        var limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        let courseCondn = {};
        let commonCondn = {};
        let classCodn = {};
        if (userInput.courseId) {
            courseCondn['courseId'] = userInput.courseId;
            commonCondn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            classCodn['trainingClassId'] = userInput.trainingClassId;
            commonCondn['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.notificationFileId) {
            commonCondn['notificationFileId'] = userInput.notificationFileId;
        }
        if (userInput.resortId) {
            commonCondn['resortId'] = userInput.resortId;
        }
        if (userInput.createdBy) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            commonCondn['userId'] = { $in: userIds };
        }
        else if (userInput.userId) {
            commonCondn['userId'] = userInput.userId;
        }
        let departArray = [];
        departArray.push(userInput.departmentId);
        let divArray = [];
        divArray.push(userInput.divisionId);
        if (userInput.divisionId) {
            isReq = true;
            commonCondn["divisionId"] = { $overlap: divArray };
        } else if (userInput['divIds']) {
            isReq = true;
            let divArray = userInput['divIds'].split(',');
            commonCondn['divisionId'] = { $overlap: divArray };
        }
        if (userInput.departmentId) {
            isReq = true;
            commonCondn["departmentId"] = { $overlap: departArray };
        } else if (userInput['departmentIds']) {
            isReq = true;
            let departArray = userInput['departmentIds'].split(',');
            commonCondn['departmentId'] = { $overlap: departArray };
        }
        Model.TrainingScheduleResorts.findAndCountAll({
            include: [{
                model: Model.Course,
                attributes: ['courseName', 'courseId'],
            }, {
                model: Model.TrainingClass,
                attributes: ['trainingClassName', 'trainingClassId'],
            }, {
                model: Model.NotificationFile,
                attributes: ['notificationFileId'],
            }, {
                model: Model.User,
                attributes: ['userId', 'userName', 'firstName', 'lastName', 'email', 'phoneNumber']
            }, {
                model: Model.Resort,
                attributes: ['resortName', 'resortId']
            }, {
                model: Model.TrainingSchedule,
                attributes: ['name', 'assignedDate', 'dueDate', 'name']
            }],
            where: commonCondn,
            limit: limit,
            offset: offset
        }).then(function (response) {
            responseHandler.getSuccessResult(response, "Course employees status listed Successfully", res);
        });
    },
    async employeesExpireList(req, res) {
        let userInput = Utils.getReqValues(req);
        var limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        let whereCondn = {};
        let courseCodn = {};
        let classCodn = {};
        if (userInput.courseId) {
            whereCondn['courseId'] = userInput.courseId;
            courseCodn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            whereCondn['trainingClassId'] = userInput.trainingClassId;
            classCodn['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.resortId) {
            whereCondn['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            whereCondn['userId'] = userInput.userId;
        }
        if (userInput.createdBy) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            whereCondn['userId'] = userIds;
        }
        let notNullCondn = {};
        notNullCondn['divisionId'] = { $ne: null };
        notNullCondn['departmentId'] = { $ne: null };
        if (userInput.divisionId) {
            whereCondn['divisionId'] = { $overlap: [userInput.divisionId] };
        } else if (userInput['divIds']) {
            let divArray = userInput['divIds'].split(',');
            whereCondn['divisionId'] = { $overlap: divArray };
        }
        if (userInput.departmentId) {
            whereCondn['departmentId'] = { $overlap: [userInput.departmentId] };
        } else if (userInput['departmentIds']) {
            let departArray = userInput['departmentIds'].split(',');
            whereCondn['departmentId'] = { $overlap: departArray };
        }
        whereCondn['status'] = {$in : ['assigned','inProgress']}

        let currentSectDate = new Date();
        let currentDate = new Date();
        let dueCodn = {};
        currentDate.setDate(currentDate.getDate() + 7);
        dueCodn['dueDate'] = { $lte: currentDate, $gte: currentSectDate };
        dueCodn['isExpired'] = false;

        Model.User.findAndCountAll({
            attributes: ['userId', 'userName', 'firstName', 'lastName', 'email', 'phoneNumber', 'userImage', 'homeNumber', 'employeeId', 'employeeNo', 'reportingTo'],
            include: [{
                model: Model.ResortUserMapping,
                attributes: ['resortId', 'userId', 'divisionId', 'departmentId', 'designationId'],
                include: [
                    {
                        model: Model.Division,
                        attributes: ['divisionName']
                    },
                    {
                        model: Model.Department,
                        attributes: ['departmentName']
                    },
                    {
                        model: Model.Resort,
                        attributes: ['resortName']
                    }
                ]
            }, {
                model: Model.TrainingScheduleResorts,
                attributes: ['userId', 'resortId', 'courseId', 'trainingClassId', 'divisionId', 'departmentId'],
                where: whereCondn,
                include: [{
                    model: Model.TrainingSchedule,
                    attributes: ['assignedDate', 'dueDate', 'name'],
                    where: dueCodn
                }]
            }, {
                model: Model.User,
                attributes: ['userId', 'userName', 'firstName', 'lastName'],
                as: 'reportDetails'
            }],
            limit: limit,
            offset: offset
        }).then(function (employees) {
            Model.Course.findOne({ where: courseCodn, attributes: ['courseId', 'courseName'] }).then(function (course) {
                employees['course'] = course;
                Model.TrainingClass.findOne({ where: classCodn, attributes: ['trainingClassId', 'trainingClassName'] }).then(function (classSet) {
                    employees['trainingClass'] = classSet;
                    responseHandler.getSuccessResult(employees, "employees status listed successfully", res);
                });
            });
        });
    },
    employeeFilestatusList(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.userId) {
            responseHandler.getErrorResult("userId is required", res);
            return false;
        } else {
            let userCondn = {};
            let commonCondn = {};
            let allcodn = {};
            userCondn['userId'] = userInput.userId;
            allcodn['userId'] = userInput.userId;

            if (userInput.courseId) {
                allcodn['courseId'] = userInput.courseId;
            }
            if (userInput.trainingClassId) {
                allcodn['trainingClassId'] = userInput.trainingClassId;
            }
            if (userInput.resortId) {
                commonCondn['resortId'] = userInput.resortId;
            }
            var limit, page, offset;
            if (userInput.page && userInput.size) {
                limit = userInput.size;
                page = userInput.page ? userInput.page : 1;
                offset = (page - 1) * userInput.size;
            }

            allcodn['fileId'] = { $ne: null };
            if (userInput.search) {
                let search = userInput.search;
                searchCondition = {
                    $or: [
                        {
                            '$TrainingClass.trainingClassName$': {
                                $iLike: "%" + (search ? search : "") + "%"
                            }
                        },
                        {
                            '$File.fileName$': {
                                $iLike: "%" + (search ? search : "") + "%"
                            }
                        }
                    ],
                    $and: allcodn
                };
            } else {
                searchCondition = allcodn;
            }
            Model.TrainingScheduleFiles.findAndCountAll({
                where: searchCondition,
                include: [
                    { model: Model.File, attributes: ['fileId', 'fileType', 'fileExtension', 'fileName'] },
                    { model: Model.TrainingClass, attributes: ['trainingClassId', 'trainingClassName'] },
                    { model: Model.User, attributes: ['userId', 'userName', 'firstName', 'lastName'] }
                ],
                limit: limit,
                offset: offset
            }).then(function (result) {
                Model.User.findOne({ where: userCondn, attributes: ['userId', 'userName', 'firstName', 'lastName'] }).then(function (user) {
                    result['user'] = user;
                    responseHandler.getSuccessResult(result, "Course employees status listed Successfully", res);
                });
            });
        }
    },
    async getTrainingSchedule(req, res) {
        let userInput = Utils.getReqValues(req);
        let resortConditions = {};
        if (userInput.resortId) {
            resortConditions['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            resortConditions['userId'] = userInput.userId;
        }
        // if(userInput.createdBy){
        //     userInput.userId = (userInput.createdBy)?userInput.createdBy :userInput.userId;
        //     let allDivUsers = await Utils.getAllDivisionUsers(userInput,Model);
        //     let userIds = [];
        //     if(allDivUsers.status == true){
        //         userIds = allDivUsers.data;
        //     }
        //     resortConditions['userId'] = userIds;
        // }

        Model.TrainingSchedule
            .findAll({
                attributes: ['trainingScheduleId', 'name', 'assignedDate', 'dueDate', 'colorCode', 'scheduleType'],
                include:
                    [
                        {
                            model: Model.TrainingScheduleCourses, as: 'Courses', attributes: ['courseId'],
                            include: [{ model: Model.Course, attributes: ['courseName'] }]
                        },
                        {
                            model: Model.TrainingScheduleCourses, as: 'Courses', attributes: ['trainingClassId'],
                            include: [{ model: Model.TrainingClass, attributes: ['trainingClassName'] }]
                        },
                        {
                            model: Model.TrainingScheduleResorts, as: 'Resorts',
                            where: resortConditions,
                            include: [{ model: Model.NotificationFile, attributes: ['notificationFileId', 'status', 'type', 'assignedDate', 'dueDate'] }]
                        }]

            }).then(function (scheduleResp) {
                if (scheduleResp.length > 0) {
                    responseHandler.getSuccessResult(scheduleResp, "Schedule details listed successfully", res);
                } else {
                    responseHandler.getNotExistsResult(scheduleResp, res);
                }
            }).catch(function (error) {
                var errorMessage = Utils.constructErrorMessage(error);
                return responseHandler.getErrorResult(errorMessage, res);
            });
    },
    getSpecificTrainingSchedule(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (userInput.trainingScheduleId) {
            conditions['trainingScheduleId'] = userInput.trainingScheduleId;
        }
        let conditionSet = {};
        if (userInput.scheduleType === 'course') {
            conditionSet = {
                model: Model.TrainingScheduleCourses, as: 'Courses', attributes: ['trainingScheduleCourseId', 'courseId', 'isMandatory', 'isOptional', 'passPercentage'],
                include: [{
                    model: Model.Course, attributes: ['courseName']
                }]
            }
        } else if (userInput.scheduleType === 'trainingClass') {
            conditionSet = {
                model: Model.TrainingScheduleCourses, as: 'Courses', attributes: ['trainingScheduleCourseId', 'trainingClassId', 'isMandatory', 'isOptional', 'passPercentage'],
                include: [{
                    model: Model.TrainingClass, attributes: ['trainingClassName']
                }]
            }
        } else {
            conditionSet = {
                model: Model.TrainingScheduleCourses, as: 'Courses', attributes: ['trainingScheduleCourseId', 'courseId', 'isMandatory', 'isOptional', 'passPercentage'],
                include: [{
                    model: Model.Course, attributes: ['courseName']
                }]
            }
        }
        Model.TrainingSchedule
            .findAll({
                where: conditions,
                attributes: ['trainingScheduleId', 'name', 'assignedDate', 'dueDate', 'notificationDays', 'scheduleType'],
                include:
                    [conditionSet,
                        {
                            model: Model.TrainingScheduleResorts, as: 'Resorts',
                            include: [{ model: Model.User, attributes: ['userId', 'userName', 'firstName', 'lastName'] }]
                        }
                    ],
            }).then(function (scheduleResp) {
                responseHandler.getSuccessResult(scheduleResp, "Schedule details listed successfully", res);
            });
    },
    getAllSchedules(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let userCondn = {};
        if (userInput.trainingScheduleId) {
            conditions['trainingScheduleId'] = userInput.trainingScheduleId;
        }
        if (userInput.userId) {
            userCondn['userId'] = userInput.userId;
        }
        let limit, offset, page;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate());
        conditions['assignedDate'] = { $lte: currentDate};
        conditions['scheduleType'] = { $ne: 'notification' };
        Model.TrainingSchedule.findAndCountAll({
            limit: limit,
            offset: offset,
            where: conditions,
            distinct: true,
            attributes: ['trainingScheduleId', 'name', 'assignedDate', 'dueDate', 'notificationDays', 'colorCode', 'scheduleType'],
            include: [{
                model: Model.TrainingScheduleCourses, as: 'Courses',
                attributes: ['trainingScheduleCourseId', 'courseId', 'trainingClassId', 'passPercentage']
            }, {
                model: Model.TrainingScheduleResorts, as: 'Resorts',
                where: userCondn,
                attributes: []
            }],
            order: [["created", "DESC"]]
        }).then(async function (scheduleResp) {
            responseHandler.getSuccessResult(scheduleResp, "Schedule details listed successfully", res);
        });
    },
    deleteSchedule(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.trainingScheduleId) {
            responseHandler.getErrorResult('trainingScheduleId is mandatory', res);
            return false;
        }
        let trainingCodn = {};
        trainingCodn['trainingScheduleId'] = userInput.trainingScheduleId;
        let statusCodn = {};
        statusCodn['trainingScheduleId'] = userInput.trainingScheduleId;
        statusCodn['status'] = {$in :['inProgress','completed']};

        Model.TrainingScheduleResorts.findAll({where:statusCodn}).then(function(scheduleResorts){
            if(scheduleResorts && scheduleResorts.length > 0){
                responseHandler.getErrorResult('Unable to delete training schedule already users are in progress and completion status', res);
            }else{
                let notificationFileIdCodn = {};
                if (userInput.notificationFileId) {
                    notificationFileIdCodn['notificationFileId'] = userInput.notificationFileId;
                    Model.NotificationFileMap.destroy({ where: notificationFileIdCodn });
                    Model.NotificationFile.destroy({ where: notificationFileIdCodn });
                }
                Model.TrainingScheduleCourses.findAll({ where: trainingCodn }).then(function (coursesScheduled) {
                    let courseIds = [];
                    let trainingClassIds = [];
                    let courseCondn = {};
                    if (coursesScheduled) {
                        coursesScheduled.forEach(function (value, key) {
                            if (value.dataValues.courseId) {
                                courseIds.push(value.dataValues.courseId);
                            }
                            if (value.dataValues.trainingClassId) {
                                trainingClassIds.push(value.dataValues.trainingClassId);
                            }
                        });
                        if (courseIds.length > 0) {
                            courseCondn['courseId'] = { $in: courseIds };
                        } else if (trainingClassIds.length > 0) {
                            courseCondn['trainingClassId'] = { $in: trainingClassIds };
                        }
                    }
                    Model.TrainingSchedule.destroy({
                        where: trainingCodn
                    }).then(function (deletedSchedule) {
                        if (deletedSchedule) {
                            Model.TrainingScheduleResorts.destroy({ where: trainingCodn }).then(function (value) {
                                Model.FeedbackMapping.destroy({ where: courseCondn }).then(function (feedbackDel) {
                                    res.status(200).send({ "isSuccess": true, message: 'Training schedule deleted successfully' });
                                });
                            });
                        } else {
                            responseHandler.getErrorResult('Unable to delete training schedule ', res);
                        }
                    }).catch(function (err) {
                        let errorMessage = err;
                        if (err.errors) {
                            errorMessage = Utils.constructErrorMessage(err);
                        }
                        responseHandler.getErrorResult(errorMessage, res);
                    });
                });
            }
        });
    },
    fileUpdate(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.fileName) {
            responseHandler.getErrorResult("fileName is required", res);
            return false;
        } else if (!userInput.fileDescription) {
            responseHandler.getErrorResult("fileDescription is required", res);
            return false;
        } else {
            let whereCondn = {};
            whereCondn['fileId'] = userInput.fileId;
            Model.File.findOne({ where: whereCondn }).then(function (response) {
                let updateRes = {};
                updateRes['fileName'] = userInput.fileName;
                updateRes['fileDescription'] = userInput.fileDescription;
                if (response) {
                    Model.File.update(updateRes, { where: whereCondn }).then(function (updateRes) {
                        responseHandler.getSuccessResult(updateRes, "file details updated successfully", res);
                    });
                } else {
                    responseHandler.getErrorResult('fileId is not in db', res);
                }
            }).catch(function (err) {
                let errorMessage = err;
                if (err.errors) {
                    errorMessage = Utils.constructErrorMessage(err);
                }
                responseHandler.getErrorResult(errorMessage, res);
            });
        }
    },
    failedList(req, res) {
        let userInput = Utils.getReqValues(req);
        let whereConditions = {};
        whereConditions['resortId'] = userInput.resortId;
        whereConditions['userId'] = userInput.userId;
        whereConditions['notificationFileId'] = { $eq: null };
        let userResortCodn = {};
        userResortCodn['userId'] = userInput.userId;
        userResortCodn['resortId'] = userInput.resortId;
        userResortCodn['status'] = {$ne :'passed'};
        userResortCodn['latestFailed'] = true;

        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }

        if (userInput.selectType === 'Class') {
            whereConditions['courseId'] = { $eq: null };
        } else if (userInput.selectType === 'Course') {
            whereConditions['trainingClassId'] = { $eq: null };
        }

        let failedClassCond = {};
        failedClassCond['userId'] = userInput.userId;
        failedClassCond['resortId'] = userInput.resortId;
        failedClassCond['status'] = 'failed';
        failedClassCond['courseId'] = { $eq: null };

        let passedClass = {};
        passedClass['userId'] = userInput.userId;
        passedClass['resortId'] = userInput.resortId;
        passedClass['status'] = { $ne: 'passed' };
        passedClass['courseId'] = { $eq: null };

        let failedCourse = {};
        failedCourse['userId'] = userInput.userId;
        failedCourse['resortId'] = userInput.resortId;
        failedCourse['status'] = 'failed';
        failedCourse['courseId'] = { $ne: null };

        let passedCourse = {};
        passedCourse['userId'] = userInput.userId;
        passedCourse['resortId'] = userInput.resortId;
        passedCourse['status'] = { $ne: 'passed' };
        passedCourse['courseId'] = { $ne: null };

        let failedCourseSet = { $or: [failedCourse, passedCourse] };
        let failedClassSet = { $or: [failedClassCond, passedClass] };
        Model.FeedbackMapping.findAll({
            where: failedCourseSet,
            attributes: ['courseId'],
        }).then(function (failedCourses) {
            Model.FeedbackMapping.findAll({ where: failedClassSet, attributes: ['trainingClassId'] }).then(function (failedClasses) {
                let courses = [];
                failedCourses.forEach(function (val, key) {
                    courses.push(val.dataValues.courseId);
                });
                let classes = [];
                failedClasses.forEach(function (val, key) {
                    classes.push(val.dataValues.trainingClassId);
                });
                courses = _.uniq(courses);
                classes = _.uniq(classes);
                let feedbackCodn = {};
                let course = {};
                let classesSet = {};
                let searchFields = {};
                course['courseId'] = { $in: courses };

                classesSet['trainingClassId'] = { $in: classes };
                classesSet['courseId'] = { $eq: null };
                feedbackCodn = { $or: [course, classesSet], $and: [userResortCodn] };


                let searchCondn = {};
                if (userInput.search) {
                    let search = userInput.search;
                    searchCondn = {
                        $or: [
                            {
                                "$Course.courseName$": {
                                    $iLike: "%" + (search ? search : "") + "%"
                                }
                            }, {
                                "$TrainingClass.trainingClassName$": {
                                    $iLike: "%" + (search ? search : "") + "%"
                                }
                            }
                            , course, classesSet
                        ], $and: [userResortCodn]
                    };
                } else {
                    searchCondn = { $or: [course, classesSet], $and: [userResortCodn] };
                }
                Model.FeedbackMapping.findAndCountAll({
                    where: searchCondn,
                    attributes: ['courseId', 'status', 'passPercentage','trainingClassId','created'],
                    include: [
                        { model: Model.Course, attributes: ['courseName', 'courseId'] },
                        { model: Model.TrainingClass, attributes: ['trainingClassName', 'trainingClassId'] }
                    ],
                    limit:limit,
                    offset:offset,
                    order:[['created', 'DESC']],
                }).then(function (feedbacks) {
                    responseHandler.getSuccessResult(feedbacks, "Failed course/classes listed successfully", res);
                });
            });
        });
    },
    getSpecificSchedule(req, res) {
        let userInput = Utils.getReqValues(req);
        let whereCondn = {};
        let scheduleCodn = {};
        if (userInput.trainingScheduleId) {
            scheduleCodn['trainingScheduleId'] = userInput.trainingScheduleId;
        }
        let courseCondn = {};
        let classCondn = {};
        if (userInput.userId) {
            whereCondn['userId'] = userInput.userId;
        }
        if (userInput.trainingClassId) {
            scheduleCodn['trainingClassId'] = userInput.trainingClassId;
        }
        let Courses = [];
        let Classes = [];
        let response = {};
        Model.TrainingScheduleCourses.findAll({ where: scheduleCodn }).then(function (courseSchedules) {
            courseSchedules.forEach(function (value, key) {
                Courses.push(value.dataValues.courseId);
                Classes.push(value.dataValues.trainingClassId);
            });
            if (Courses.length > 0) {
                courseCondn['courseId'] = { $in: Courses };
            }
            if (Classes.length > 0) {
                classCondn['trainingClassId'] = { $in: Classes };
            }
            Model.Course.findAll({
                where: courseCondn,
                attributes: ['courseId', 'courseName'],
                include: [
                    {
                        model: Model.CourseTrainingClassMap,
                        attributes: ['courseId', 'trainingClassId'],
                        include: [{
                            model: Model.TrainingClass,
                            attributes: ['trainingClassId', 'trainingClassName'],
                            include: [{
                                model: Model.FeedbackMapping,
                                where: whereCondn,
                                required: false
                            }]
                        }]
                    },{
                        model:Model.TrainingScheduleResorts,
                        attributes:['userId','status','resortId'],
                        where:whereCondn
                    }
                ],
                order: [[Sequelize.col('"CourseTrainingClassMaps->TrainingClass->FeedbackMappings"."feedbackMappingId"'), 'DESC']],
            }).then(function (result) {
                response['course'] = result;
                Model.TrainingClass.findAll({
                    where: classCondn,
                    attributes: ['trainingClassId', 'trainingClassName'],
                    include: [{
                        model: Model.FeedbackMapping,
                        where: whereCondn,
                        required: false
                    },{
                        model:Model.TrainingScheduleResorts,
                        attributes:['userId','status','resortId'],
                        where:whereCondn
                    }],
                    order: [[Sequelize.col('"FeedbackMappings"."feedbackMappingId"'), 'DESC']],
                }).then(function (classRes) {
                    response['class'] = classRes;
                    responseHandler.getSuccessResult(response, "Schedule specific listed successfully", res);
                });
            });
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    },
    removeDuplicatesFromArray(arr) {
        var obj = {};
        var uniqueArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (!obj.hasOwnProperty(arr[i])) {
                obj[arr[i]] = arr[i];
                uniqueArr.push(arr[i]);
            }
        }
        return uniqueArr;
    },
    checkTrainingFilesCompleted(req, res) {
        let userInput = Utils.getReqValues(req);
        let trainingClassCodn = {};
        // if (userInput.resortId) {
        //     trainingClassCodn['resortId'] = userInput.resortId;
        // }
        if (userInput.courseId) {
            trainingClassCodn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            trainingClassCodn['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.userId) {
            trainingClassCodn['userId'] = userInput.userId;
        }
        trainingClassCodn['fileId'] = { $ne: null };
        Model.TrainingScheduleFiles.findAll({ where: trainingClassCodn }).then(function (allFiles) {
            let check = _.find(allFiles, function (o) { return o.dataValues.status === 'Not Completed'; });
            let outputRes = {};
            if (!check) {
                outputRes.message = 'Training Class Files Completed';
                outputRes.statusKey = true;
            } else {
                outputRes.message = 'Please view all the contents of the class before you complete';
                // outputRes.message = 'Training class files are not completed still. See all videos fully and documents need to be viewed before completion';
                outputRes.statusKey = false;
            }
            responseHandler.getSuccessResult(outputRes, outputRes.message, res);
        });
    },
    expireReschedule(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.trainingScheduleId) {
            return responseHandler.getErrorResult("trainingScheduleId is required", res);
        } else if (!userInput.assignedDate) {
            return responseHandler.getErrorResult("assignedDate is required", res);
        } else if (!userInput.dueDate) {
            return responseHandler.getErrorResult("dueDate is required", res);
        } else if (!userInput.userId) {
            return responseHandler.getErrorResult("userId is required", res);
        } else if (!userInput.resortId) {
            return responseHandler.getErrorResult("resortId is required", res);
        }
        let whereConditions = {};
        whereConditions['trainingScheduleId'] = userInput.trainingScheduleId;
        whereConditions['status'] = "expired";
        whereConditions['userId'] = userInput.userId;
        whereConditions['resortId'] = userInput.resortId;
        if (userInput.courseId) {
            whereConditions['courseId'] = userInput.courseId;
        } else if (userInput.trainingClassId) {
            whereConditions['trainingClassId'] = userInput.trainingClassId;
        } else if (userInput.notificationFileId) {
            whereConditions['notificationFileId'] = userInput.notificationFileId;
        }
        let updateSet = {};
        let updateDateSet = {};
        updateDateSet['assignedDate'] = userInput.assignedDate;
        updateDateSet['dueDate'] = userInput.dueDate;
        updateSet['status'] = "assigned";

        let scheduleCodn = {};
        scheduleCodn['trainingScheduleId'] = userInput.trainingScheduleId;

        Model.TrainingSchedule.update(updateDateSet, { where: scheduleCodn });

        Model.TrainingScheduleResorts.update(updateSet, { where: whereConditions }).then(function (response) {
            responseHandler.getSuccessResult(response, "Rescheduled successfully", res);
        });
    }
}