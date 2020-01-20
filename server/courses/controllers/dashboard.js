const Utils = require("./../utils/Utils");
const responsehandler = require("./../utils/responseHandler");
const Model = require("../models");
const async = require('async');
const _ = require('lodash');
const Sequelize = require('sequelize');
module.exports = {
    async getTotalCount(req, res) {
        let resortConditions = {};
        let roleConditions = {};
        let deptcond = {};
        let userInput = Utils.getReqValues(req);
        let response = {};
        let resortUserConditions = {};
        resortConditions['divisionId'] = { $ne: null };
        roleConditions['roleId'] = 4

        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.type == "summary") {
            let childResortIds = await Utils.getChildResorts(userInput, Model);
            let resorts = [];
            if (childResortIds.status === true) {
                resorts = childResortIds.data;
                resorts.push(userInput.resortId);
            } else {
                resorts.push(userInput.resortId);
            }
            resortConditions['resortId'] = { $in: resorts };
            resortUserConditions['resortId'] = { $in: resorts };
        }
        else if (userInput.resortId) {
            resortConditions['resortId'] = userInput.resortId;
            resortUserConditions['resortId'] = userInput.resortId;
        }
        async.waterfall([
            function (done) {
                Model.ResortMapping.findAndCountAll({
                    where: resortConditions
                }).then(function (resorts) {
                    done(null, resorts);
                })
            },
            function (division, done) {
                let divisionIds = _.map(division.rows, 'divisionId');
                deptcond['divisionId'] = divisionIds;
                Model.Department.findAndCountAll({ where: deptcond }).then(function (departments) {
                    response.departmentCount = departments.count;
                    response.divisionCount = division.count;
                    done(null, response);
                });
            }, function (response, done) {
                Model.User.findAndCountAll({
                    include: [{ model: Model.UserRoleMapping, as: 'UserRole', where: roleConditions }, { model: Model.ResortUserMapping, where: resortUserConditions }],
                    duplicating: false
                }).then(function (users) {
                    let empCount = 0;
                    if (users.count > 0) {
                        empCount = users.rows.length;
                    }
                    response.employeeCount = empCount;
                    done(null, response);
                });
            }
        ], function (err, response) {
            if (err) throw new Error(err);
            return responsehandler.getSuccessResult(
                response,
                "Listed successfully",
                res
            );
        });
    },
    async getTotalCourse(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let response = {};
        let courseId;
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.type == "summary") {
            let childResortIds = await Utils.getChildResorts(userInput, Model);
            let resorts = [];
            if (childResortIds.status === true) {
                resorts = childResortIds.data;
                resorts.push(userInput.resortId);
            } else {
                resorts.push(userInput.resortId);
            }
            conditions['resortId'] = { $in: resorts };
        } else if (userInput.resortId) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput.divisionId) {
            conditions['divisionId'] = { $overlap: [userInput.divisionId] };
        }

        if (userInput.departmentId) {
            conditions['departmentId'] = { $overlap: [userInput.departmentId] };
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            conditions['userId'] = userIds;
        }
        conditions['courseId'] = { $ne: null };
        Model.TrainingScheduleResorts.findAll({
            where: conditions,
            attributes: ['status', [Sequelize.fn('count', Sequelize.col('status')), 'totalcount']],
            group: ['status']
        }).then(function (training) {
            Model.TrainingScheduleResorts.findAll({ where: conditions }).then(function (courses) {
                let courseIds = _.map(courses, 'courseId');
                courseId = _.union(courseIds);
                response.courseTotalCount = courseId.length;
                response.training = training;
                return responsehandler.getSuccessResult(
                    response,
                    "Listed successfully",
                    res
                );
            })
        })
    },
    async topRatedTrainingClass(req, res) {
        let userInput = Utils.getReqValues(req);
        let whereConditions = {};
        let limit = 10;
        if (userInput.limit) {
            limit = userInput.limit;
        }
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.type == "summary") {
            let childResortIds = await Utils.getChildResorts(userInput, Model);
            let resorts = [];
            if (childResortIds.status === true) {
                resorts = childResortIds.data;
                resorts.push(userInput.resortId);
            } else {
                resorts.push(userInput.resortId);
            }
            whereConditions['resortId'] = { $in: resorts };
        } else if (userInput.resortId) {
            whereConditions['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            whereConditions['userId'] = userIds;
        }
        Model.TrainingClass.findAll({
            attributes: ['trainingClassId', 'trainingClassName', [Sequelize.fn('AVG', Sequelize.col('"FeedbackMappings->Feedback"."ratingStar"')), 'ratingStar']],
            include: [{
                model: Model.FeedbackMapping,
                attributes: [],
                where: whereConditions,
                include: [{ model: Model.Feedback, attributes: [] }],
            }],
            group: ["TrainingClass.trainingClassId"],
            limit: limit,
            order: [[Sequelize.fn('AVG', Sequelize.col('"FeedbackMappings->Feedback"."ratingStar"')), 'DESC']],
            subQuery: false
        }).then(function (feedback) {
            // If Ascending Order use below commented
            // feedback = _.sortBy(feedback, 'ratingStar').reverse();
            // Descending Order 
            //let feedbacks = _.sortBy(feedback, 'ratingStar');
            //    feedbacks = _.sortBy(feedback,'ratingStar', function(o) {
            //     return parseFloat(o.Value);
            //   });
            return responsehandler.getSuccessResult(
                feedback,
                "Listed successfully",
                res
            );
        });
    },
    async getCourseBymonth(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let resortCodn = {};
        if (userInput['year'] && userInput['year'] !== 'undefined') {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.createdBy) {
            conditions['createdBy'] = userInput.createdBy;
        }
        if (userInput.type == "summary") {
            let childResortIds = await Utils.getChildResorts(userInput, Model);
            let resorts = [];
            if (childResortIds.status === true) {
                resorts = childResortIds.data;
                resorts.push(userInput.resortId);
            } else {
                resorts.push(userInput.resortId);
            }
            resortCodn['resortId'] = { $in: resorts };
        } else if (userInput.resortId) {
            resortCodn['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            conditions['createdBy'] = userIds;
        }

        if (userInput.divisionId) {
            resortCodn['divisionId'] = userInput.divisionId;
        }
        if (userInput.departmentId) {
            resortCodn['departmentId'] = userInput.departmentId;
        }
        Model.ResortUserMapping.findAll({ where: resortCodn, attributes: ['resortId', 'userId'] }).then(function (resortUsers) {
            let users = [];
            resortUsers.forEach(function (val, key) {
                users.push(val.dataValues.userId);
            });

            if (!userInput.userId) {
                conditions['createdBy'] = { $in: users };
            }

            conditions['status'] = { $in: ['none', 'scheduled'] };
            conditions['isDeleted'] = false;
            conditions['draft'] = false;


            Model.Course.findAll({
                where: conditions,
                attributes: [[Sequelize.fn('date_part', 'month', Sequelize.col('created')), 'monthCreated'], [Sequelize.fn('count', Sequelize.col('created')), 'totalcount']],
                group: [Sequelize.fn('date_part', 'month', Sequelize.col('created'))]
            }).then(function (courses) {
                let monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                let tempSumArray = [];
                courses.forEach(function (value, key) {
                    tempSumArray[value.dataValues.monthCreated - 1] = value.dataValues.totalcount;
                });
                let sumData = _.map(Array.apply(null, tempSumArray), function (currentItem) {
                    return _.isUndefined(currentItem) ? 0 : currentItem;
                });
                let length = 12;
                sumData = module.exports.array_pad(sumData, length, 0);
                return responsehandler.getSuccessResult(
                    sumData,
                    "Listed successfully",
                    res
                );
            });
        });
    },
    async getAllCoursesByMonth(req, res) {
        let userInput = Utils.getReqValues(req);
        let searchCondition = {};
        let conditions = {};
        let andCodn = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput['resortId']) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput['divisionId']) {
            let divArray = [];
            divArray.push(userInput.divisionId);
            conditions['divisionId'] = { $overlap: divArray };
        }
        else if (userInput['divIds']) {
            let divArray = userInput['divIds'].split(',');
            conditions['divisionId'] = { $overlap: divArray };
        }
        if (userInput['departmentId']) {
            let departArray = [];
            departArray.push(userInput.departmentId);
            conditions['departmentId'] = { $overlap: departArray };
        } else if (userInput['departmentIds']) {
            let departArray = userInput['departmentIds'].split(',');
            conditions['departmentId'] = { $overlap: departArray };
        }

        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if (userInput['month'] && userInput['year']) {
            let endDate = new Date();
            endDate.setDate(30);
            endDate.setMonth(userInput['month'] - 1);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(userInput['month'] - 1);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };

        } else if (userInput['year']) {
            let endDate = new Date();
            endDate.setDate(30);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            conditions['userId'] = { $in: userIds };
        }
        if (userInput['courseId']) {
            andCodn['courseId'] = userInput.courseId;
        }
        andCodn['draft'] = false;
        andCodn['isDeleted'] = false;
        andCodn['status'] = { $in: ['none', 'scheduled'] };
        if (userInput.search) {
            let search = userInput.search;
            searchCondition = {
                $or: [
                    {
                        courseName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }
                ],
                $and: andCodn
            };
        } else {
            searchCondition = andCodn;
        }
        let dueCodn = {};
        let includeCodn = [];
        if (userInput.expire == '1') {
            conditions['status'] = {$in :['assigned','inProgress']}
            let currentSectDate = new Date();
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            dueCodn['dueDate'] = { $lte: currentDate, $gte: currentSectDate };
            dueCodn['isExpired'] = false;
            includeCodn = [{ model: Model.TrainingSchedule, attributes: [], where: dueCodn }];
        }
        Model.Course.findAndCountAll({
            attributes: [
                'courseId',
                'courseName',
                'created',
                'updated',
                [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."resortId"))'), 'resortsCount'],
                [Sequelize.literal('COUNT(("TrainingScheduleResorts"."userId"))'), 'employeesCount'],
                [Sequelize.literal(`SUM(CASE WHEN "TrainingScheduleResorts"."status" = 'failed' THEN 1 ELSE 0 END)`), 'failedClassesCount'],
                [Sequelize.literal(`SUM(CASE WHEN "TrainingScheduleResorts"."status" = 'unAssigned' THEN 1 ELSE 0 END)`), 'unAssignedCount'],
                [Sequelize.literal(`SUM(CASE WHEN "TrainingScheduleResorts"."status" = 'assigned' THEN 1 ELSE 0 END)`), 'assignedCount'],
                [Sequelize.literal(`SUM(CASE WHEN "TrainingScheduleResorts"."status" = 'inProgress' THEN 1 ELSE 0 END)`), 'inProgressCount'],
                [Sequelize.literal(`SUM(CASE WHEN "TrainingScheduleResorts"."status" = 'completed' THEN 1 ELSE 0 END)`), 'completedCount'],
                [Sequelize.literal(`SUM(CASE WHEN "TrainingScheduleResorts"."status" = 'expired' THEN 1 ELSE 0 END)`), 'expiredCount'],
            ],
            include: [
                {
                    attributes: [],
                    model: Model.TrainingScheduleResorts,
                    include: includeCodn,
                    where: conditions
                },
                {
                    attributes: ['trainingClassId'],
                    model: Model.CourseTrainingClassMap,
                }
            ],
            distinct: true,
            where: searchCondition,
            group: ["Course.courseId", "CourseTrainingClassMaps.courseTrainingClassMapId"],
            subQuery: false,
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']]
        }).then(function (resp) {
            resp.count = resp.count.length;
            return responsehandler.getSuccessResult(
                resp,
                "Course trend listed successfully",
                res
            );
        });
    },
    async getAllTCByMonth(req, res) {
        let userInput = Utils.getReqValues(req);
        let searchCondition = {};
        let conditions = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput['resortId']) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput['divisionId']) {
            let divArray = [];
            divArray.push(userInput.divisionId);
            conditions['divisionId'] = { $overlap: divArray };
        } else if (userInput['divIds']) {
            let divArray = userInput['divIds'].split(',');
            conditions['divisionId'] = { $overlap: divArray };
        }
        if (userInput['departmentId']) {
            let departArray = [];
            departArray.push(userInput.departmentId);
            conditions['departmentId'] = { $overlap: departArray };
        } else if (userInput['departmentIds']) {
            let departArray = userInput['departmentIds'].split(',');
            conditions['departmentId'] = { $overlap: departArray };
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            conditions['userId'] = { $in: userIds };
        }

        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if (userInput['month'] && userInput['year']) {
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(userInput['month'] - 1);
            startDate.setYear(userInput['year']);
            let endDate = new Date();
            endDate.setDate(30);
            endDate.setMonth(userInput['month'] - 1);
            endDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        } else if (userInput['year']) {
            let endDate = new Date();
            endDate.setDate(30);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }
        let andCodn = {};
        let classCodn = {};
        let includeCodn = {};
        let reqSet = true;
        if (userInput['courseId']) {
            classCodn['courseId'] = userInput.courseId;
            reqSet = false;
            includeCodn = {
                attributes: [],
                model: Model.CourseTrainingClassMap,
                where: classCodn
            };
        }
        andCodn['draft'] = false;
        andCodn['isDeleted'] = false;
        if (userInput.search) {
            let search = userInput.search;
            searchCondition = {
                $or: [
                    {
                        trainingClassName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }
                ],
                $and: andCodn
            };
        } else {
            searchCondition = andCodn;
        }
        let dueCodn = {};
        if (userInput.expire == '1') {
            let currentSectDate = new Date();
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            dueCodn['dueDate'] = { $lte: currentDate, $gte: currentSectDate };
            dueCodn['isExpired'] = false;
        }
        Model.TrainingClass.findAndCountAll({
            attributes: [
                'trainingClassId',
                'trainingClassName',
                'created',
                'updated',
                // [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."resortId"))'), 'resortsCount'],
                // [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."userId"))'), 'employeesCount'
                [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."resortId"))'), 'resortsCount'],
                [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."userId"))'), 'employeesCount'],
                [Sequelize.literal(`SUM(DISTINCT(CASE WHEN "TrainingScheduleResorts"."status" = 'failed' THEN 1 ELSE 0 END))`), 'failedClassesCount'],
                [Sequelize.literal(`SUM(DISTINCT(CASE WHEN "TrainingScheduleResorts"."status" = 'unAssigned' THEN 1 ELSE 0 END))`), 'unAssignedCount'],
                [Sequelize.literal(`SUM(DISTINCT(CASE WHEN "TrainingScheduleResorts"."status" = 'assigned' THEN 1 ELSE 0 END))`), 'assignedCount'],
                [Sequelize.literal(`SUM(DISTINCT(CASE WHEN "TrainingScheduleResorts"."status" = 'inProgress' THEN 1 ELSE 0 END))`), 'inProgressCount'],
                [Sequelize.literal(`SUM(DISTINCT(CASE WHEN "TrainingScheduleResorts"."status" = 'completed' THEN 1 ELSE 0 END))`), 'completedCount'],
                [Sequelize.literal(`SUM(DISTINCT(CASE WHEN "TrainingScheduleResorts"."status" = 'expired' THEN 1 ELSE 0 END))`), 'expiredCount'],


            ],
            include: [
                {
                    attributes: [],
                    model: Model.TrainingScheduleResorts,
                    include: [{
                        model: Model.TrainingSchedule,
                        attributes: [],
                        where: dueCodn,
                        required: reqSet
                    }],
                    where: conditions,
                    required: reqSet
                }
            ],
            where: searchCondition,
            group: ["TrainingClass.trainingClassId"],
            subQuery: false,
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']]
        }).then(function (resp) {
            resp.count = resp.count.length;
            return responsehandler.getSuccessResult(
                resp,
                "TC trend listed successfully",
                res
            );
        });
    },
    async getAllNotificationsByMonth(req, res) {
        let userInput = Utils.getReqValues(req);
        let searchCondition = {};
        let conditions = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput['resortId']) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput['divisionId']) {
            let divArray = [];
            divArray.push(userInput.divisionId);
            conditions['divisionId'] = { $overlap: divArray };
        } else if (userInput['divIds']) {
            let divArray = userInput['divIds'].split(',');
            conditions['divisionId'] = { $overlap: divArray };
        }
        if (userInput['departmentId']) {
            let departArray = [];
            departArray.push(userInput.departmentId);
            conditions['departmentId'] = { $overlap: departArray };
        } else if (userInput['departmentIds']) {
            let departArray = userInput['departmentIds'].split(',');
            conditions['departmentId'] = { $overlap: departArray };
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            conditions['userId'] = { $in: userIds };
        }
        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if (userInput['month'] && userInput['year']) {
            let endDate = new Date();
            endDate.setDate(30);
            endDate.setMonth(userInput['month'] - 1);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(userInput['month'] - 1);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };

        } else if (userInput['year']) {
            let endDate = new Date();
            endDate.setDate(30);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }
        if (userInput['notificationFileId']) {
            andCodn['notificationFileId'] = userInput.notificationFileId;
        }
        let andCodn = {};
        andCodn['draft'] = false;
        andCodn['isDeleted'] = false;
        if (userInput.search) {
            let search = userInput.search;
            // searchCondition = {
            //     $or: [
            //         {
            //             courseName: {
            //                 $iLike: "%" + (search ? search : "") + "%"
            //             }
            //         }
            //     ],
            //     $and: andCodn
            // };
        } else {
            searchCondition = andCodn;
        }
        let dueCodn = {};
        if (userInput.expire == '1') {
            let currentSectDate = new Date();
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            dueCodn['dueDate'] = { $lte: currentDate, $gte: currentSectDate };
        }
        Model.NotificationFile.findAndCountAll({
            attributes: [
                'notificationFileId',
                'fileId',
                'created',
                'updated',
                'description',
                [Sequelize.literal('"TrainingScheduleResorts->TrainingSchedule"."name"'), "scheduleName"],
                [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."resortId"))'), 'resortsCount'],
                [Sequelize.literal('COUNT(DISTINCT("TrainingScheduleResorts"."userId"))'), 'employeesCount']
            ],
            include: [
                {
                    attributes: [],
                    model: Model.TrainingScheduleResorts,
                    include: [{ model: Model.TrainingSchedule, attributes: [], where: dueCodn }],
                    where: conditions
                }
            ],
            where: searchCondition,
            group: ["NotificationFile.notificationFileId", '"TrainingScheduleResorts->TrainingSchedule"."name"'],
            subQuery: false,
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']]
        }).then(function (resp) {
            resp.count = resp.count.length;
            return responsehandler.getSuccessResult(
                resp,
                "Notification trend listed successfully",
                res
            );
        });
    },
    getTopFiveResorts(req, res) {
        let userInput = Utils.getReqValues(req);
        let searchCondition = {};
        let conditions = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.resortId) {
            conditions['parentId'] = userInput.resortId;
        }
        if (userInput.resortId == 0) {
            conditions['parentId'] = { $eq: null };
        }
        let limit, page, offset;
        if (userInput.limit) {
            limit = userInput.limit;
            offset = 0;
        }
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if (userInput['month'] && userInput['year']) {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(userInput['month'] - 1);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(userInput['month'] - 1);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };

        } else if (userInput['year']) {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(11);
            endDate.setFullYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setFullYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };

        }
        let childResortIds = [];
        Model.Resort.findAll({ where: conditions }).then(function (childs) {
            if (childs) {
                childs.forEach(function (val, key) {
                    childResortIds.push(val.dataValues.resortId);
                });
            }
            let newWhereCondn = {};
            newWhereCondn['resortId'] = { $in: childResortIds };
            if (userInput.search) {
                let search = userInput.search;
                searchCondition = {
                    $or: [
                        {
                            resortName: {
                                $iLike: "%" + (search ? search : "") + "%"
                            }
                        }
                    ],
                    $and: newWhereCondn
                };
            } else {
                searchCondition = newWhereCondn;
            }
            Model.Resort.findAndCountAll({
                attributes: ['resortId', 'resortName', [Sequelize.fn('count', Sequelize.col('Courses.courseId')), 'totalCourses'], 'utilizedSpace'],
                where: searchCondition,
                include: [{
                    model: Model.Course,
                    attributes: [],
                    required: false
                }],
                group: ["Resort.resortId"],
                subQuery: false,
                offset: offset,
                limit: limit,
                order: [[Sequelize.fn('count', Sequelize.col('Courses.courseId')), 'DESC']]
            }).then(function (resortRes) {
                resortRes.count = resortRes.count.length;
                return responsehandler.getSuccessResult(
                    resortRes,
                    "Listed successfully",
                    res
                );
            });
        });
    },
    array_pad(input, padSize, padValue) {
        var pad = [];
        var newArray = [];
        var newLength;
        var diff = 0;
        var i = 0;
        if (Object.prototype.toString.call(input) === '[object Array]' && !isNaN(padSize)) {
            newLength = ((padSize < 0) ? (padSize * -1) : padSize)
            diff = newLength - input.length
            if (diff > 0) {
                for (i = 0; i < diff; i++) {
                    newArray[i] = padValue
                }
                pad = ((padSize < 0) ? newArray.concat(input) : input.concat(newArray))
            } else {
                pad = input
            }
        }
        return pad
    },
    async getBadges(req, res) {
        let userInput = Utils.getReqValues(req);
        let badgeConditions = {};
        let userCodn = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.type == "summary") {
            let childResortIds = await Utils.getChildResorts(userInput, Model);
            let resorts = [];
            if (childResortIds.status === true) {
                resorts = childResortIds.data;
                resorts.push(userInput.resortId);
            } else {
                resorts.push(userInput.resortId);
            }
            badgeConditions['resortId'] = { $in: resorts };
        } else if (userInput.resortId) {
            badgeConditions['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            userCodn['userId'] = userIds;
        }
        Model.CertificateUserMapping.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('CertificateUserMapping.badgeId')), 'totalcount']
            ],
            include: [{
                model: Model.Badges,
                where: badgeConditions,
                attributes: ['badgeId', 'badgeName']
            },
            ],
            where: userCodn,
            group: ['Badge.badgeId']
        }).then(function (badges) {
            Model.CertificateUserMapping.findAndCountAll({
                attributes: ['badgeId'],
                where: userCodn,
                include: [{ model: Model.Badges, where: badgeConditions, attributes: ['badgeName'] },
                ],
            }).then(function (badgess) {
                let response = { 'badges': badges, 'totalCount': badgess.count };
                return responsehandler.getSuccessResult(
                    response,
                    "Badges listed successfully",
                    res
                );
            })
        });
    },
    async getEmployeeCertificationTrend(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.type == "summary") {
            let childResortIds = await Utils.getChildResorts(userInput, Model);
            let resorts = [];
            if (childResortIds.status === true) {
                resorts = childResortIds.data;
                resorts.push(userInput.resortId);
            } else {
                resorts.push(userInput.resortId);
            }
            conditions['resortId'] = { $in: resorts };
        } else if (userInput.resortId) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            conditions['userId'] = userIds;
        }
        if (userInput['year'] && userInput['year'] !== 'undefined') {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }
        conditions["certificateGenerated"] = {$ne : null};
        Model.CertificateUserMapping.findAll({
            where: conditions,
            attributes: [[Sequelize.fn('date_part', 'month', Sequelize.col('created')), 'monthCreated'], [Sequelize.fn('count', Sequelize.col('userId')), 'employeecount']],
            group: [Sequelize.fn('date_part', 'month', Sequelize.col('created'))]
        }).then(function (certificates) {
            let tempSumArray = [];
            certificates.forEach(function (value, key) {
                tempSumArray[value.dataValues.monthCreated - 1] = value.dataValues.employeecount;
            });
            let sumData = _.map(Array.apply(null, tempSumArray), function (currentItem) {
                return _.isUndefined(currentItem) ? 0 : currentItem;
            });
            let length = 12;
            sumData = module.exports.array_pad(sumData, length, 0);
            return responsehandler.getSuccessResult(
                sumData,
                "Employee certificates trend listed successfully",
                res
            );
        });
    },
    getEmployeeCertificationTrendDetails(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let searchCondition = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput['resortId']) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput['userId']) {
            conditions['userId'] = userInput.userId;
        }
        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if (userInput['month'] && userInput['year']) {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(userInput['month'] - 1);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(userInput['month'] - 1);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        } else if (userInput['year']) {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            conditions['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }
        if (userInput.search) {
            let search = userInput.search;
            searchCondition = {
                $or: [
                    {
                        '$User.userName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }, {
                        '$Course.courseName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }
                ],
                $and: conditions
            };
        } else {
            searchCondition = conditions;
        }
        Model.CertificateUserMapping.findAndCountAll({
            attributes: ['userId', 'certificateId', 'badgeId', 'courseId', 'trainingClassId', 'certificateGenerated'],
            include: [{
                model: Model.User,
                attributes: ['userId', 'userName', 'firstName', 'lastName']
            }, {
                model: Model.Course,
                attributes: ['courseId', 'courseName']
            }, {
                model: Model.TrainingClass,
                attributes: ['trainingClassId', 'trainingClassName']
            }, {
                model: Model.Badges,
                attributes: ['badgeId', 'badgeName']
            }, {
                model: Model.Certificate,
                attributes: ['certificateId', 'certificateName', 'certificateHtml', 'certificateHtmlPath']
            }],
            where: searchCondition,
            limit: limit,
            offset: offset
        }).then(function (certificates) {
            return responsehandler.getSuccessResult(
                certificates,
                "Employee certificates trend listed successfully",
                res
            );
        });
    },
    async getEmployeeCoursesCount(req, res) {
        let userInput = Utils.getReqValues(req);
        let searchCondition = {};
        let resortCondn = {};
        let andCodn = {};

        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.resortId) {
            resortCondn['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            resortCondn['userId'] = userIds
        }

        if (userInput['divisionId']) {
            let divArray = [];
            divArray.push(userInput.divisionId);
            resortCondn['divisionId'] = { $overlap: divArray };
        } else if (userInput['divIds']) {
            let divArray = userInput['divIds'].split(',');
            resortCondn['divisionId'] = { $overlap: divArray };
        }
        if (userInput['departmentId']) {
            let departArray = [];
            departArray.push(userInput.departmentId);
            resortCondn['departmentId'] = { $overlap: departArray };
        } else if (userInput['departmentIds']) {
            let departArray = userInput['departmentIds'].split(',');
            resortCondn['departmentId'] = { $overlap: departArray };
        }

        if (userInput['month'] && userInput['year']) {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(userInput['month'] - 1);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(userInput['month'] - 1);
            startDate.setYear(userInput['year']);
            andCodn['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        } else if (userInput['year']) {
            let endDate = new Date();
            endDate.setDate(31);
            endDate.setMonth(11);
            endDate.setYear(userInput['year']);
            let startDate = new Date();
            startDate.setDate(01);
            startDate.setMonth(00);
            startDate.setYear(userInput['year']);
            andCodn['created'] = {
                $and: [
                    { $gte: startDate },
                    { $lte: endDate }
                ]
            };
        }

        andCodn['draft'] = false;
        andCodn['isDeleted'] = false;
        if (userInput.search) {
            let search = userInput.search;
            searchCondition = {
                $or: [
                    {
                        courseName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }
                ],
                $and: andCodn
            };
        } else {
            searchCondition = andCodn;
        }
        // console.log(resortCondn);
        // return false;
        Model.Course.findAndCountAll({
            attributes: [
                'courseId',
                'courseName',
                // [Sequelize.literal(`(CASE  WHEN 'TrainingScheduleResorts.status' = 'assigned' THEN COUNT(1) ELSE 0 END)`), 'assignedCount'],
                // [Sequelize.literal(`COUNT(DISTINCT CASE WHEN 'TrainingScheduleResorts.status' = 'assigned' THEN 1 ELSE 0 END)`), 'assignedCount'],
                // [Sequelize.literal(`COUNT(DISTINCT CASE WHEN 'TrainingScheduleResorts.status' = 'completed' THEN 1 ELSE 0 END)`), 'completedCount'],
            ],
            include: [{
                model: Model.TrainingScheduleResorts,
                attributes: ['userId', 'status'],
                where: resortCondn
            }],
            where: searchCondition,
            //group:[["courseId"]],
            order: [['created', 'DESC']],
        }).then(function (courseRes) {
            let response = {};
            let allCourses = [];
            if (courseRes.rows.length > 0) {
                JSON.parse(JSON.stringify(courseRes.rows)).forEach(function (value, key) {
                    let assignedCount = [];
                    let completedCount = [];
                    let newVal = Object.assign({}, value);
                    value.TrainingScheduleResorts.forEach(function (subVal, subKey) {
                        if (subVal.status == 'completed') {
                            completedCount.push(subVal.userId);
                        }
                        assignedCount.push(subVal.userId);
                    });
                    if (!newVal.hasOwnProperty('assignedCount')) {
                        newVal['assignedCount'] = {};
                    }
                    if (!newVal.hasOwnProperty('completedCount')) {
                        newVal['completedCount'] = {};
                    }
                    newVal['assignedCount'] = assignedCount.length;
                    newVal['completedCount'] = completedCount.length;
                    allCourses.push(newVal);
                });
            }
            response.count = courseRes.count;
            response.rows = allCourses;
            return responsehandler.getSuccessResult(
                response,
                "Employee certificates course count listed successfully",
                res
            );
        });
    },
    async getEmployeesBadgesReport(req, res) {
        let userInput = Utils.getReqValues(req);
        let resortCondn = {};
        let searchCondition = {};
        let courseCodn = {};
        if (userInput.resortId === 'null') {
            userInput.resortId = '';
        }
        if (userInput.resortId) {
            resortCondn['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
            let userIds = [];
            if (allDivUsers.status == true) {
                userIds = allDivUsers.data;
            }
            resortCondn['userId'] = userIds
        }
        if (userInput.courseId) {
            resortCondn['courseId'] = userInput.courseId;
            courseCodn['courseId'] = userInput.courseId;
        }
        if (userInput['divisionId']) {
            let divArray = [];
            divArray.push(userInput.divisionId);
            resortCondn['divisionId'] = { $overlap: divArray };
        } else if (userInput['divIds']) {
            let divArray = userInput['divIds'].split(',');
            resortCondn['divisionId'] = { $overlap: divArray };
        }
        if (userInput['departmentId']) {
            let departArray = [];
            departArray.push(userInput.departmentId);
            resortCondn['departmentId'] = { $overlap: departArray };
        } else if (userInput['departmentIds']) {
            let departArray = userInput['departmentIds'].split(',');
            resortCondn['departmentId'] = { $overlap: departArray };
        }
        resortCondn['trainingClassId'] = { $ne: null };
        if (userInput.search) {
            let search = userInput.search;
            searchCondition = {
                $or: [
                    {
                        '$CertificateUserMappings.Course.courseName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        '$CertificateUserMappings.TrainingClass.trainingClassName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        userName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }
                ]
            };
        }
        //resortCondn['certificateGenerated'] = {$eq : null};
        Model.User.findAndCountAll({
            attributes: ['userId', 'userName', 'firstName', 'lastName'],
            include: [{
                model: Model.CertificateUserMapping,
                where: resortCondn,
                attributes: ['badgeId', 'courseId', 'userId', 'trainingClassId', 'resortId'],
                include: [
                    {
                        model: Model.Course,
                        attributes: ['courseId', 'courseName']
                    },
                    {
                        model: Model.TrainingClass,
                        attributes: ['trainingClassId', 'trainingClassName'],
                        include: [{
                            model: Model.FeedbackMapping
                        }]
                    },
                    {
                        model: Model.Badges,
                        attributes: ['badgeId', 'badgeName']
                    }]
            }],
            where: searchCondition,
            order: [[Sequelize.col('"CertificateUserMappings->TrainingClass->FeedbackMappings"."feedbackMappingId"'), 'DESC']],
        }).then(function (result) {

            Model.Course.findOne({ where: courseCodn, attributes: ['courseId', 'courseName'] }).then(function (course) {
                result['course'] = course;
                return responsehandler.getSuccessResult(
                    result,
                    "Employee badges of TC listed successfully",
                    res
                );
            });
        });
    }
};