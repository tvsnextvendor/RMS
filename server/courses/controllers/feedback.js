const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models');
module.exports = {
    courseFeedback(req, res) {
        var userInput = Utils.getReqValues(req);
        if (!userInput.trainingClassId) {
            return responsehandler.getErrorResult("trainingClassId is required", res);
        } else if (!userInput.userId) {
            return responsehandler.getErrorResult("userId is required", res);
        }
        // else if (!userInput.feedback) {
        //     return responsehandler.getErrorResult("feedback is required", res);
        // }
        else if (!userInput.ratingPercent) {
            return responsehandler.getErrorResult("ratingPercent is required", res);
        } else if (!userInput.ratingStar) {
            return responsehandler.getErrorResult("ratingStar is required", res);
        }
        // else if (!userInput.scoreOutof){
        //     return responsehandler.getErrorResult("scoreOutof is required", res);
        // } 
        else if (!userInput.resortId) {
            return responsehandler.getErrorResult("resortId is required", res);
        } else {
            var passPercentage;
            if (!userInput.passPercentage) {
                passPercentage = Math.round((userInput.score * 100) / userInput.scoreOutof);
                if (isNaN(passPercentage)) {
                    passPercentage = 0;
                }
            }
            userInput.score = (userInput.score) ? userInput.score : 0;
            userInput.scoreOutof = (userInput.scoreOutof) ? userInput.scoreOutof : 0;
            if (userInput.passPercentage) {
                passPercentage = userInput.passPercentage;
            }
            let self = this;
            return Model.sequelize
                .transaction(function (transaction) {
                    let feedbackObj = {
                        'feedback': userInput.feedback,
                        'ratingPercent': userInput.ratingPercent,
                        'ratingStar': userInput.ratingStar,
                        'score': userInput.score,
                        'scoreOutof': userInput.scoreOutof,
                        'feedbackMap': {
                            'courseId': userInput.courseId,
                            'userId': userInput.userId,
                            'trainingClassId': userInput.trainingClassId,
                            'resortId': userInput.resortId,
                            'passPercentage': passPercentage,
                            'timeTaken': userInput.timeTaken
                        }
                    };
                    return Model.Feedback.create(feedbackObj, {
                        include: [{ model: Model.FeedbackMapping, as: 'feedbackMap' }]
                    }, transaction).then(function (response) {
                        if (response) {
                            // time tracking add in course feedback section
                            let timeConditions = {};
                            let updateTime = {};
                            updateTime['timeTaken'] = userInput.timeTaken;
                            timeConditions['resortId'] = userInput.resortId;
                            timeConditions['userId'] = userInput.userId;
                            if (userInput.trainingClassId && userInput.typeSet === 'Class') {
                                timeConditions['trainingClassId'] = userInput.trainingClassId;
                                timeConditions['courseId'] = { $eq: null };
                                return Model.TrainingScheduleResorts.update(updateTime, { where: timeConditions }, transaction).then(function (timeSec) {
                                    return response;
                                });
                            } else if (userInput.courseId && userInput.typeSet === 'Course') {
                                timeConditions['courseId'] = userInput.courseId;
                                timeConditions['trainingClassId'] = { $eq: null };
                                return Model.TrainingScheduleResorts.findOne({ where: timeConditions }, transaction).then(function (scheduleResult) {
                                    if (scheduleResult) {
                                        let previousScheduleTime = scheduleResult.dataValues.timeTaken;
                                        let newTimeTaken = (userInput.timeTaken && previousScheduleTime) ? Utils.addTimes(previousScheduleTime, userInput.timeTaken) : userInput.timeTaken;
                                        let timeObj = { "timeTaken": newTimeTaken };
                                        return Model.TrainingScheduleResorts.update(timeObj, { where: timeConditions }, transaction).then(function (timeUpdate) {
                                            return response;
                                        });
                                    } else {
                                        return Model.TrainingScheduleResorts.update(updateTime, { where: timeConditions }, transaction).then(function (timeInsert) {
                                            return response;
                                        });
                                    }
                                });
                            } else {
                                return response;
                            }

                        }
                    });
                }).then(function (courseFeedback) {
                    responsehandler.getSuccessResult(
                        courseFeedback,
                        "Feedback saved successfully",
                        res
                    );
                }).catch(function (error) {
                    var errorMessage = Utils.constructErrorMessage(error);
                    return responsehandler.getErrorResult(errorMessage, res);
                });
        }
    },
    applicationFeedback(req, res) {
        var userInput = Utils.getReqValues(req);
        if (!userInput.feedback) {
            return responsehandler.getErrorResult("feedback is required", res);
        } else if (!userInput.feedbackType) {
            return responsehandler.getErrorResult("feedbackType is required", res);
        } else if (!userInput.userId) {
            return responsehandler.getErrorResult("userId is required", res);
        } else if (!userInput.resortId) {
            return responsehandler.getErrorResult("resortId is required", res);
        } else {
            return Model.sequelize
                .transaction(function (transaction) {
                    let feedbackObj = {
                        'feedback': userInput.feedback,
                        'feedbackType': userInput.feedbackType,
                        'feedbackMap': {
                            'userId': userInput.userId,
                            'resortId': userInput.resortId
                        }
                    };
                    return Model.Feedback.create(feedbackObj, {
                        include: [{ model: Model.FeedbackMapping, as: 'feedbackMap' }]
                    }, transaction).then(function (response) {
                        if (response) {
                            return response;
                        }
                    });
                }).then(function (courseFeedback) {
                    responsehandler.getSuccessResult(
                        courseFeedback,
                        "Feedback saved successfully",
                        res
                    );
                }).catch(function (error) {
                    var errorMessage = Utils.constructErrorMessage(error);
                    return responsehandler.getErrorResult(errorMessage, res);
                });
        }
    },
    feedbackList(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let whereConditions = {};
        if (userInput.feedbackType == 'course') {
            conditions['feedbackType'] = 'None';
        }
        if (userInput.feedbackType == 'app') {
            conditions['feedbackType'] = { $in: ['Compliment', 'Suggestion', 'Complaint'] };
        }
        if (userInput.trainingClassId) {
            whereConditions['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.resortId) {
            whereConditions['resortId'] = userInput.resortId;
        }
        if (userInput.courseId) {
            whereConditions['courseId'] = userInput.courseId;
        }
        //conditions['feedback'] = { $ne: null };
        let uploadPaths = Utils.uploadFilePaths();
        Model.Feedback.findAndCountAll({
            where: conditions,
            include: [{
                model: Model.FeedbackMapping, as: 'feedbackMap', where: whereConditions,
                include: [
                    { model: Model.User, attributes: ['userName', 'firstName', 'lastName', 'userImage'] },
                    { model: Model.Resort, attributes: ['resortId', 'resortName'] },
                    { model: Model.Course, attributes: ['courseId', 'courseName'] },
                    { model: Model.TrainingClass, attributes: ['trainingClassId', 'trainingClassName'] },
                ]
            }
            ]
        }).then(function (feedback) {
            let response = {};
            if (feedback.rows.length > 0) {
                response['uploadPaths'] = uploadPaths;
                response['feedback'] = feedback;
                responsehandler.getSuccessResult(
                    response,
                    "Feedback listed successfully",
                    res
                );
            } else {
                responsehandler.getNotExistsResult(
                    feedback,
                    res
                );
            }
        });
    },
}