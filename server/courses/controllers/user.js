const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models')
module.exports = {
    async getEmployeeDetails(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let whereconditions = {};
        let mapCodn = {};
        if (userInput.userId) {
            conditions['userId'] = userInput.userId;
        }
        if (userInput.divisionId) {
            mapCodn['divisionId'] = userInput.divisionId;
        }
        if (userInput.departmentId) {
            mapCodn['departmentId'] = userInput.departmentId;
        }
        if (userInput.resortId) {
            mapCodn['resortId'] = userInput.resortId;
        }
        if (userInput.createdBy) {
            conditions['createdBy'] = userInput.createdBy;
        }
        if (userInput.type === 'schedule') {
            conditions['status'] = { $in: ['mobile', 'web/mobile', 'mobileAdmin', 'web/mobileAdmin'] };
        }
        if(userInput.courseId){
            let scheduledUsers = await Utils.scheduledUsersForCourse(userInput,Model);
            let usersSet = [];
            if(scheduledUsers.status === true){
                usersSet = scheduledUsers.data;
            }
            conditions['userId'] = {$in : usersSet};
        }
        conditions['active'] = true;
        whereconditions['roleId'] = 4;
        Model.User
            .findAll({
                where: conditions,
                attributes: [
                    'employeeId',
                    'employeeNo',
                    'userId',
                    'userName',
                    'firstName',
                    'lastName',
                    'email',
                ],
                include: [
                    {
                        model: Model.ResortUserMapping,
                        attributes: ['divisionId', 'departmentId', 'designationId', 'resortId'],
                        where: mapCodn
                    },
                    {
                        model: Model.UserRoleMapping, as: 'UserRole',
                        where: whereconditions,
                        attributes: []
                    }],
                order: [
                    ['created', 'DESC']
                ]
            })
            .then((result) => {
                if (result.length > 0){
                    return responsehandler.getSuccessResult(result, 'Employee listed successfully', res);
                } else if(userInput.courseId){
                    return responsehandler.getErrorResult( 'No More Employees Scheduled For Selected Course', res);
                } else {
                    return responsehandler.getNotExistsResult(result, res);
                }
            })
            .catch(function (error) {
                let errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
    },
    readNotification(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        conditions['notificationId'] = userInput.notificationId;
        Model.Notification.findOne({ where: conditions }).then(function (response) {
            if (response) {
                Model.Notification.update(userInput, { where: conditions }).then(function (result) {
                    return responsehandler.getSuccessResult(result, 'Notification readed successfully', res);
                });
            } else {
                return responsehandler.getNotExistsResult(response, res);
            }
        }).catch(function (error) {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
        });
    },
    readAllNotifications(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.userId) {
            const errorMessage = "userId is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        }
        let conditions = {};
        conditions['receiverId'] = userInput.userId;
        Model.Notification.findOne({ where: conditions }).then(function (response) {
            if (response) {
                Model.Notification.update({ status: 'Read' }, { where: conditions }).then(function (result) {
                    return responsehandler.getSuccessResult(result, 'All Notifications readed successfully', res);
                });
            } else {
                return responsehandler.getNotExistsResult(response, res);
            }
        }).catch(function (error) {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
        });
    },
    async sendExpireNotification(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.userIds) {
            const errorMessage = "userIds is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        } else if (!userInput.typeSet) {
            const errorMessage = "typeSet is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        } else if (!userInput.createdBy) {
            const errorMessage = "createdBy is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        }
        else {
            let userIds = userInput.userIds;
            let notificationMsg;
            let notifications = [];
            let expireType;
            let typeSet = userInput.typeSet;
            if (typeSet === 'toAllEmployee') {
                expireType = 'expiryNotifyToEmployees';
                notificationMsg = await Utils.getNotifications('expiryNotifyToEmployees');
            } else if (typeSet === 'toAllReportManager') {
                expireType = 'expiryNotifyToManagers';
                notificationMsg = await Utils.getNotifications('expiryNotifyToManagers');
            }
            let courseSectionName;
            let courseSectionNameContent = await Utils.getCourseOrTrainingClass(userInput, Model);
            if (courseSectionNameContent.status === true) {
                courseSectionName = courseSectionNameContent.data;
            }
            userIds.forEach(function (val, key) {
                let notifyObj = {};
                notifyObj['senderId'] = userInput.createdBy;
                notifyObj['receiverId'] = val;
                if (userInput.courseId) {
                    notifyObj['courseId'] = userInput.courseId;
                }
                if (userInput.trainingClassId) {
                    notifyObj['trainingClassId'] = userInput.trainingClassId;
                }
                if (notificationMsg.status === true) {
                    let notifyMessage = notificationMsg.data.message;
                    let notifyMessage_1 = notifyMessage.replace(new RegExp('{{COURSE}}', 'g'), courseSectionName);
                    let notifyMessage_2 = (userInput.comments) ? notifyMessage_1.replace(new RegExp('{{COMMENT}}', 'g'), userInput.comments) : notifyMessage_1.replace(new RegExp('{{COMMENT}}', 'g'), "");
                    notifyObj['notification'] = notifyMessage_2;
                }
                notifyObj['type'] = expireType;
                notifications.push(notifyObj);
            });
            Model.Notification.bulkCreate(notifications, { individualHooks: true }).then(function (notificationSets) {
                if (notificationSets) {
                    return responsehandler.getSuccessResult(notificationSets, 'Notifications sent successfully', res);
                } else {
                    let errorMessage = Utils.constructErrorMessage(error);
                    return responsehandler.getErrorResult(errorMessage, res);
                }
            }).catch(function (error) {
                let errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
        }
    },
    getReportingManagers(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (!userInput.userIds) {
            const errorMessage = "userIds is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        }
        else {
            conditions['userId'] = { $in: userInput.userIds };
            Model.User.findAll({
                attributes: ['userId', 'userName','firstName','lastName'],
                where: conditions,
                include: [{ model: Model.User, as: 'reportDetails' }]
            }).then(function (response) {
                if (response) {
                    return responsehandler.getSuccessResult(response, 'All reporters listed successfully', res);
                } else {
                    return responsehandler.getNotExistsResult(response, res);
                }
            }).catch(function (error) {
                let errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
        }
    },
    checkCourse(req, res) {
        let userInput = Utils.getReqValues(req);
        let innerCodn = {};
        let whereCodn = {};

        if (userInput.resortId) {
            whereCodn['resortId'] = userInput.resortId;
        }
        
        if (userInput.courseName) {
          

           
            whereCodn['courseName'] = userInput.courseName;
            whereCodn['isDeleted'] = false;
            return Model.Course
                .findAll({
                    where: whereCodn
                })
                .then(course => {
                    if (course.length === 0) {
                        return res.status(200).send({
                            isSuccess: true,
                            message: 'Course Not Found',
                        });
                    } else {
                        return res.status(200).send({
                            isSuccess: false,
                            message: userInput.courseName + ' - ' + ' Course name already exists',
                        });
                    }
                })
                .catch((error) => res.status(400).send(error));
        } else {
            return responsehandler.getErrorResult('Course name is mandatory', res);
        }
    },
    async sendReportEmail(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.to) {
            const errorMessage = "to is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        } else if (!userInput.subject) {
            const errorMessage = "subject is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        } else if (!userInput.message) {
            const errorMessage = "message is mandatory";
            return responsehandler.getErrorResult(errorMessage, res);
        } else {
            let attachments = req.files;
            let to = userInput.to;
            let subject = userInput.subject;
            let message = userInput.message;
            let mailTo = to.split(',');
            let mailSendMessage;
            if (attachments) {
                mailSendMessage = await Utils.mailOptions(mailTo, message, subject, attachments);
            } else {
                mailSendMessage = await Utils.mailOptions(mailTo, message, subject, '');
            }
            return responsehandler.getSuccessResult(mailSendMessage, 'Mail report sent successfully', res);
        }
    }
};