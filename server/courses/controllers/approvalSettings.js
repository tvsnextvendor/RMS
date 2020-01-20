const Utils = require("./../utils/Utils");
const responseHandler = require("./../utils/responseHandler");
const Model = require("../models")
module.exports =
    {
        approvallist(req, res) {
            let userInput = Utils.getReqValues(req);
            let whereCodn = {};
            let orCodn;
            if (userInput.approvalId) {
                whereCodn['approvalId'] = userInput.approvalId;
            }
            if (userInput.approvalStatus) {
                whereCodn['approverStatus'] = userInput.approvalStatus;
            }
            if (userInput.createdBy) {
                orCodn = {
                    $or: [
                        {
                            'createdBy': userInput.createdBy
                        },
                        {
                            'reportingTo': userInput.createdBy
                        }
                    ],
                    $and: whereCodn
                };
            } else {
                orCodn = whereCodn;
            }
            let limit, page, offset;
            if (userInput.page && userInput.size) {
                limit = userInput.size;
                page = userInput.page ? userInput.page : 1;
                offset = (page - 1) * userInput.size;
            }
            Model.Approvals.findAndCountAll({
                where: orCodn,
                include: [{
                    model: Model.Resort,
                    attributes: ['resortId', 'resortName']
                }, {
                    model: Model.Course,
                    attributes: ['courseId', 'courseName'],
                    required: false
                }, {
                    model: Model.TrainingClass,
                    attributes: ['trainingClassId', 'trainingClassName'],
                    required: false
                }, {
                    model: Model.Quiz,
                    attributes: ['quizId', 'quizName'],
                    required: false
                }, {
                    model: Model.NotificationFile,
                    attributes: ['notificationFileId'],
                    required: false
                },
                {
                    model: Model.User,
                    attributes: ['userId', 'userName', 'firstName', 'lastName'],
                    as: 'Requestor',
                    required: false
                }, {
                    model: Model.User,
                    attributes: ['userId', 'userName', 'firstName', 'lastName'],
                    as: 'Approver',
                    required: false
                }
                ],
                limit: limit,
                offset: offset,
                order: [['created', 'DESC']]
            }).then(function (response) {
                if (response && response.count > 0) {
                    responseHandler.getSuccessResult(
                        response,
                        "Approval listed successfully",
                        res
                    );
                } else {
                    return responseHandler.getNotExistsResult(response, res);
                }
            }).catch(function (error) {
                var errorMessage = Utils.constructErrorMessage(error);
                return responseHandler.getErrorResult(errorMessage, res);
            });
        },
        async createApproval(req, res) {
            let userInput = Utils.getReqValues(req);
            let notificationMsg = await Utils.getNotifications('sentApproval');
            if (!userInput.resortId) {
                return responseHandler.getErrorResult("resortId is required", res);
            } else if (!userInput.contentName) {
                return responseHandler.getErrorResult("contentName is required", res);
            } else if (!userInput.contentId) {
                // contentId may be coure or quiz or training Class ids 
                return responseHandler.getErrorResult("contentId is required", res);
            } else if (!userInput.contentType) {
                // contentId may be coure or quiz or training Class values
                return responseHandler.getErrorResult("contentType is required", res);
            }
            else if (!userInput.createdBy) {
                return responseHandler.getErrorResult("createdBy is required", res);
            } else {
                let classIds;
                if (userInput.contentType === 'Course') {
                    userInput.courseId = userInput.contentId;
                    classIds = await Utils.getTrainingClassIds(userInput,Model);
                }
                else if (userInput.contentType === 'Quiz') {
                    userInput.quizId = userInput.contentId;
                } else if (userInput.contentType === 'Notification') {
                    userInput.notificationFileId = userInput.contentId;
                } else {
                    userInput.trainingClassId = userInput.contentId;
                }
                let whereCodn = {};
                whereCodn['contentName'] = userInput.contentName;
                whereCodn['createdBy'] = userInput.createdBy;
                whereCodn['resortId'] = userInput.resortId;
                whereCodn['approverStatus'] = { $notIn: ['Rejected'] };
                if (!userInput.reportingTo) {
                    responseHandler.getErrorResult("Your reporting person is not allocated by admin,Please contact admin to send content", res);
                    return false;
                }
                let notifications = [];
                let notifyObj = {};
                notifyObj['senderId'] = userInput.createdBy;
                notifyObj['receiverId'] = userInput.reportingTo;
                if (notificationMsg.status === true) {
                    let notifyMessage = notificationMsg.data.message;
                    let notifyMessage_1 = notifyMessage.replace(new RegExp('{{COURSE}}', 'g'), userInput.contentName);
                    notifyObj['notification'] = notifyMessage_1;
                }
                notifyObj['type'] = 'sentApproval';
                notifications.push(notifyObj);

                let updateDraft = {};
                updateDraft['approvedStatus'] = true;
                Model.Approvals.findOne({ where: whereCodn }).then(function (responseSet) {
                    if (!responseSet) {
                        Model.Approvals.create(userInput).then(function (response) {
                            if (response) {
                                Model.Notification.bulkCreate(notifications, { individualHooks: true }).then(function (response) {
                                    if (userInput.courseId){
                                        let whereCodn = {};
                                        whereCodn['courseId'] = userInput.courseId;
                                        Model.Course.update(updateDraft, { where: whereCodn });
                                        let classCodn = {};
                                        if(classIds){
                                            classCodn['trainingClassId'] = {$in : classIds};
                                            Model.TrainingClass.update(updateDraft, { where: classCodn });
                                        }
                                    }
                                    if (userInput.trainingClassId) {
                                        let whereCodn = {};
                                        whereCodn['trainingClassId'] = userInput.trainingClassId;
                                        Model.TrainingClass.update(updateDraft, { where: whereCodn });
                                    }
                                    if (userInput.quizId) {
                                        let whereCodn = {};
                                        whereCodn['quizId'] = userInput.quizId;
                                        Model.Quiz.update(updateDraft, { where: whereCodn });
                                    }
                                    if (userInput.notificationFileId) {
                                        let whereCodn = {};
                                        whereCodn['notificationFileId'] = userInput.notificationFileId;
                                        Model.NotificationFile.update(updateDraft, { where: whereCodn });
                                    }


                                    responseHandler.getSuccessResult(
                                        response,
                                        "Content approval sent successfully",
                                        res
                                    );
                                });
                            }
                        }).catch(function (error) {
                            var errorMessage = Utils.constructErrorMessage(error);
                            return responseHandler.getErrorResult(errorMessage, res);
                        });
                    } else {
                        return responseHandler.getErrorResult("Content already send for approval", res);
                    }
                });
            }
        },
        statusApproval(req, res) {
            let userInput = Utils.getReqValues(req);
            if (!userInput.approvalId) {
                return responseHandler.getErrorResult("approvalId is required", res);
            } else if (!userInput.approverId) {
                return responseHandler.getErrorResult("approverId is required", res);
            } else if (!userInput.approvalStatus) {
                return responseHandler.getErrorResult("approvalStatus is required", res);
            } else {

                let whereCodn = {};
                whereCodn['approvalId'] = userInput.approvalId;

                let updateResponse = {};
                updateResponse['approvedOn'] = new Date();
                updateResponse['approverStatus'] = userInput.approvalStatus;
                updateResponse['approverId'] = userInput.approverId;

                let message;
                if (userInput.approvalAccess) {
                    message = "Content assigned for second level approval successfully";
                    Model.Approvals.findOne({ where: whereCodn }).then(function (result) {
                        let respData = result.dataValues;
                        let updateSetRes = {};
                        // added now
                        updateSetRes.approverId = userInput.approvalAccess;
                        // added now
                        updateSetRes.approverStatus = "Rescheduled";
                        if (respData.level === 1) {
                            Model.Approvals.update(updateSetRes, { where: whereCodn });
                            let secondApproval = {
                                'resortId': respData.resortId,
                                'courseId': respData.courseId,
                                'contentName': respData.contentName,
                                'trainingClassId': respData.trainingClassId,
                                'quizId': respData.quizId,
                                'notificationFileId': respData.notificationFileId,
                                'contentType': respData.contentType,
                                'createdBy': respData.createdBy,
                                'reportingTo': userInput.approvalAccess,
                                'level': 2
                            };
                            Model.Approvals.create(secondApproval).then(function (response) {
                                if (response) {
                                    responseHandler.getSuccessResult(
                                        response,
                                        message,
                                        res
                                    );
                                }
                            });
                        } else {
                            return responseHandler.getErrorResult("Already sent for second level approval.Cannot able to send more than 2 level of approvals", res);
                        }
                    });
                } else {
                    if (userInput.approvalStatus === 'Rejected') {
                        message = "Content rejected successfully";
                        if (!userInput.rejectComment) {
                            return responseHandler.getErrorResult("rejectComment is required", res);
                        } else {
                            updateResponse['rejectComment'] = userInput.rejectComment;
                        }
                        // added now in rejected section too

                        let updateDraft = {};
                        updateDraft['approvedStatus'] = false;
                        Model.Approvals.findOne({ where: whereCodn }).then(function (approvalRes) {
                            let respData = approvalRes.dataValues;
                            let removeRescheduleCodn = {};
                            removeRescheduleCodn['approverStatus'] = "Rescheduled";
                            removeRescheduleCodn['courseId'] = respData.courseId;
                            removeRescheduleCodn['approvalId'] = { $ne: userInput.approvalId };
                            Model.Approvals.destroy({ where: removeRescheduleCodn });
                            if (respData.courseId) {
                                let whereCodn = {};
                                whereCodn['courseId'] = respData.courseId;
                                Model.Course.update(updateDraft, { where: whereCodn });
                            }
                            if (respData.trainingClassId) {
                                let whereCodn = {};
                                whereCodn['trainingClassId'] = respData.trainingClassId;
                                Model.TrainingClass.update(updateDraft, { where: whereCodn });
                            }
                            if (respData.quizId) {
                                let whereCodn = {};
                                whereCodn['quizId'] = respData.quizId;
                                Model.Quiz.update(updateDraft, { where: whereCodn });
                            }
                            if (respData.notificationFileId) {
                                let whereCodn = {};
                                whereCodn['notificationFileId'] = respData.notificationFileId;
                                Model.NotificationFile.update(updateDraft, { where: whereCodn });
                            }
                        });
                        // added now in rejected section too
                    } else {
                        let updateDraft = {};
                        updateDraft['draft'] = false;
                        updateDraft['approvedStatus'] = true;
                        Model.Approvals.findOne({ where: whereCodn }).then(async function (approvalRes) {
                            let respData = approvalRes.dataValues;
                            // added now
                            let removeRescheduleCodn = {};
                            removeRescheduleCodn['approverStatus'] = "Rescheduled";
                            removeRescheduleCodn['courseId'] = respData.courseId;
                            removeRescheduleCodn['approvalId'] = { $ne: userInput.approvalId };
                            console.log("removeRescheduleCodn");
                            console.log(removeRescheduleCodn);;
                            Model.Approvals.destroy({ where: removeRescheduleCodn });
                            // added now
                            if (respData.courseId) {
                                let id = respData.courseId;
                                let updateFiles = await Utils.updateDraftForAllFiles('course',Model,id);
                                // console.log(updateFiles);
                                // console.log("course");
                                let whereCodn = {};
                                whereCodn['courseId'] = respData.courseId;
                                Model.Course.update(updateDraft, { where: whereCodn });
                            }
                            if (respData.trainingClassId) {
                                //console.log("came hereee");
                                let id = respData.trainingClassId;
                                let updateFiles = await Utils.updateDraftForAllFiles('class',Model,id);
                                // console.log(updateFiles);
                                // console.log("class");
                                let whereCodn = {};
                                whereCodn['trainingClassId'] = respData.trainingClassId;
                                Model.TrainingClass.update(updateDraft, { where: whereCodn });
                            }
                            if (respData.quizId) {
                                let whereCodn = {};
                                whereCodn['quizId'] = respData.quizId;
                                Model.Quiz.update(updateDraft, { where: whereCodn });
                            }
                            if (respData.notificationFileId) {
                                let whereCodn = {};
                                whereCodn['notificationFileId'] = respData.notificationFileId;
                                Model.NotificationFile.update(updateDraft, { where: whereCodn });
                            }
                        });
                        message = "Content approved successfully";
                    }
                    Model.Approvals.update(updateResponse, { where: whereCodn }).then(function (response) {
                        if (response) {
                            responseHandler.getSuccessResult(
                                response,
                                message,
                                res
                            );
                        }
                    }).catch(function (error) {
                        var errorMessage = Utils.constructErrorMessage(error);
                        return responseHandler.getErrorResult(errorMessage, res);
                    });
                }
            }
        }
    }