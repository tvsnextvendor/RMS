
const Utils = require("./../utils/Utils");
const responsehandler = require("./../utils/responseHandler");
const Model = require("../models/");
const settings = require("../config/configuration");
const _ = require('lodash');
const Sequelize = require('sequelize');
module.exports = {
  async list(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    let whereConditions = {};
    let trainingConditions = {};
    let isReq = false;
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    let divUsers = [];
    let departUsers = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }
    if (userInput.courseId) {
      conditions["courseId"] = userInput.courseId;
    }
    if (userInput.trainingClassId) {
      trainingConditions["trainingClassId"] = userInput.trainingClassId;
    }
    if (userInput.status) {
      conditions["status"] = userInput.status;
    }

    if (userInput.status === 'none') {
      conditions['status'] = { $in: ['none', 'scheduled'] };
    }
    if (userInput.departmentId) {
      let departData = await Utils.getParticularDepartUsers(userInput, Model);
      if (departData.status === true) {
        departUsers = departData.data;
        conditions['createdBy'] = { $in: departUsers };
      }
    } else if (userInput.divisionId) {
      let divData = await Utils.getParticularDivUsers(userInput, Model);
      if (divData.status === true) {
        divUsers = divData.data;
        conditions['createdBy'] = { $in: divUsers };
      }
    }
    // if(userInput.created){
    //   conditions["createdBy"] = userInput.created;
    // }

    // let departArray = [];
    // departArray.push(userInput.departmentId);
    // let divArray = [];
    // divArray.push(userInput.divisionId);
    // if (userInput.divisionId) {
    //   isReq = true;
    //   whereConditions["divisionId"] = { $overlap: divArray };
    // }
    // if (userInput.departmentId) {
    //   isReq = true;
    //   whereConditions["departmentId"] = { $overlap: departArray };
    // }
    // if (userInput.createdBy) {
    //   isReq = true;
    //   whereConditions["userId"] = userInput.createdBy;
    // }
    // if (userInput.resortId) {
    //   whereConditions["resortId"] = userInput.resortId;
    // }
    // if (userInput.subResortId) {
    //   isReq = true;
    //   whereConditions["resortId"] = userInput.subResortId;
    // }
    if (userInput.courseStatus && userInput.courseStatus === 'assigned') {
      conditions['status'] = 'scheduled';
    }

    if (userInput.courseStatus && userInput.courseStatus === 'unscheduled') {
      conditions['status'] = 'none';
    }

    //Conditions
    if (userInput.draft === 'true') {
      conditions['draft'] = true;
    } else if (userInput.draft === 'false') {
      conditions['draft'] = false;
    } else {
      conditions['draft'] = false;
    }

    if (userInput.allDrafts === '1') {
      conditions['draft'] = { $in: [true, false] };
    }

    if (userInput.isDeleted) {
      conditions['isDeleted'] = true;
    } else {
      conditions['isDeleted'] = false;
    }


    if (userInput.created && departUsers.length > 0) {
      conditions['createdBy'] = { $in: departUsers };
    }
    else if (userInput.created && divUsers.length > 0) {
      conditions['createdBy'] = { $in: divUsers };
    }
    else if (userInput.createdBy && userInput.created) {
      conditions['createdBy'] = userInput.createdBy;
    }
    else if (userInput.created) {
      conditions['createdBy'] = userInput.created;
    }
    else if (userInput.createdBy) {
      conditions['createdBy'] = userInput.createdBy;
    } else if (userInput.subResortId) {
      conditions["resortId"] = userInput.subResortId;
    }
    else if (userInput.parentResort) {
      conditions["resortId"] = userInput.parentResort;
    }
    else {
      conditions['resortId'] = { $in: resorts };
    }

    if (userInput.userId) {
      let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
      let userIds = [];
      if (allDivUsers.status == true) {
        userIds = allDivUsers.data;
      }
      conditions['createdBy'] = userIds;
    }
    // Paginations
    let limit, page, offset;
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    let searchCondition;
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
        $and: conditions
      };
    } else {
      searchCondition = conditions;
    }
    let orderBy;
    if (userInput.order === '1') {
      orderBy = [['courseName', 'ASC']]
    } else {
      orderBy = [['courseId', 'DESC']]
    }
    Model.Course.findAndCountAll({
      where: searchCondition,
      attributes: ["courseId", "courseName", "createdBy", "created", "updated", "draft", "approvedStatus"],
      include: [
        {
          model: Model.CourseTrainingClassMap,
          attributes: [
            "courseTrainingClassMapId",
            "courseId",
            "trainingClassId"
          ],
          required: false,
          include: [
            {
              model: Model.TrainingClass,
              required: false,
              attributes: ["trainingClassName"],
              include: [
                {
                  model: Model.FileMapping,
                  attributes: ['trainingClassId', 'courseId', 'fileId'],
                  include: [{
                    model: Model.File,
                    attributes: ["fileId", "fileSize"],
                    required: false
                  }]
                },
                {
                  model: Model.QuizMapping,
                  attributes: ['trainingClassId', 'quizId'],
                  include: [{
                    model: Model.Quiz,
                    attributes: ["quizId", "quizName"],
                    required: false
                  }]
                }
              ],
              conditions: trainingConditions
            }
          ]
        },
        {
          model: Model.TrainingScheduleResorts,
          where: whereConditions,
          required: isReq
        },
        {
          model: Model.User,
          attributes: ["userName", 'firstName', 'lastName'],
          as: "createdByDetails",
          required: false
        }
      ],
      distinct: true,
      limit: limit,
      offset: offset,
      order: orderBy
    })
      .then(result => {
        if (result) {
          return responsehandler.getSuccessResult(
            result,
            "Course listed successfully",
            res
          );
        } else {
          return responsehandler.getNotExistsResult(result, res);
        }
      })
      .catch(function (error) {
        var errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });

  },
  getCourse(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    let trainingConditions = {};
    if (userInput.courseId) {
      conditions["courseId"] = userInput.courseId;
    }
    if (userInput.trainingClassId) {
      trainingConditions["trainingClassId"] = userInput.trainingClassId;
    }
    Model.Course.findAll({
      where: conditions,
      attributes: ["courseId", "courseName"],
      include: [
        {
          model: Model.CourseTrainingClassMap,
          include: [
            {
              model: Model.TrainingClass,
              where: trainingConditions
            }
          ]
        },
        {
          model: Model.User,
          attributes: ["userName", "firstName", "lastName"],
          as: "createdByDetails"
        }
      ],
      order: [["courseId", "ASC"]]
    })
      .then(result => {
        if (result) {
          return responsehandler.getSuccessResult(
            result,
            "Course listed successfully",
            res
          );
        } else {
          return responsehandler.getNotExistsResult(result, res);
        }
      })
      .catch(function (error) {
        var errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },
  getCreatedByDetails(req, res) {
    let userInput = Utils.getReqValues(req);
    const CreatedArray = [];
    let resortCondn = {};
    if (userInput['resortId']) {
      resortCondn['resortId'] = userInput['resortId'];
    }
    Model.ResortUserMapping.findAndCountAll({
      where: resortCondn,
      attributes: ['resortId', 'userId']
    }).then(function (resorts) {
      if (resorts.rows) {
        resorts.rows.forEach(function (item) {
          CreatedArray.push(item.dataValues.userId);
        });
      }
      Model.User.findAll({
        attributes: ['userName', 'firstName', 'userId', 'lastName'],
        where: { userId: CreatedArray },
        order: [['userName', 'ASC']]
      }).then(created => {
        return responsehandler.getSuccessResult(
          created,
          "Created listed successfully",
          res
        );
      });
    });
  },
  add(req, res) {
    let userInput = Utils.getReqValues(req);
    if (!userInput.courseName) {
      const errorMessage = "Course Name is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    }
    userInput.courseName = userInput.courseName.trim();
    let courseCodn = {};
    courseCodn['courseName'] = userInput.courseName;
    return Model.sequelize
      .transaction(function (t) {
        return Model.Course.findOne({ where: courseCodn }, { transaction: t }).then(function (courseRes) {
          if (courseRes && courseRes.length > 0) {
            return responsehandler.getErrorResult("Course Name already exists", res);
          } else {
            return Model.Course.create(userInput, t)
              .then(courseData => {
                if (userInput.courseTrainingClasses) {
                  let trainingData = [];
                  userInput.courseTrainingClasses.forEach(trainingClassId => {
                    let trainingObj = {};
                    trainingObj.courseId = courseData.courseId;
                    trainingObj.trainingClassId = trainingClassId;
                    trainingData.push(trainingObj);
                  });
                  return Model.CourseTrainingClassMap.bulkCreate(trainingData, { individualHooks: true }, t)
                    .then(result => {
                      let trainingCodn = {};
                      trainingCodn['trainingClassId'] = userInput.courseTrainingClasses;
                      trainingCodn['courseId'] = { $eq: null };
                      return Model.FileMapping.findAll({ where: trainingCodn, distinct: true }).then(function (fileMapRes) {
                        let fileInsert = [];
                        if (fileMapRes.length > 0) {
                          fileMapRes.forEach(function (val, item) {
                            let obj = {};
                            obj.courseId = courseData.courseId;
                            obj.trainingClassId = val.dataValues.trainingClassId;
                            obj.fileId = val.dataValues.fileId;
                            fileInsert.push(obj);
                          });
                          fileInsert = _.uniqWith(fileInsert, _.isEqual);
                        }
                        return Model.FileMapping.bulkCreate(fileInsert, { individualHooks: true }, t).then(function (ress) {
                          return ress;
                        });
                      });
                    })
                    .catch(err => {
                      let errorMessage = Utils.constructErrorMessage(err);
                      return responsehandler.getErrorResult(errorMessage, res);
                    });
                } else {
                  return result;
                }
              })
          }
        });
      })
      .then(function (responseSet) {
        responsehandler.getSuccessResult(
          responseSet,
          "Course saved successfully",
          res
        );
      })
      .catch(function (error) {
        var errorMessage = Utils.constructErrorMessage(error);
        if (errorMessage === "courseName must be unique,\nresortId must be unique") {
          errorMessage = "Course name must be unique";
        }
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },
  getEmployees(req, res) {
    let userInput = Utils.getReqValues(req);
    Model.TrainingScheduleResorts.findAndCountAll({
      where: { courseId: userInput.courseId },
      attributes: ["userId", "courseId", "status", "completedDate"],
      include: [
        {
          model: Model.TrainingSchedule,
          attributes: ["name", "assignedDate", "dueDate", "notificationDays"]
        },
        {
          model: Model.User,
          attributes: ["userId", "userName", "firstName", "lastName", "email", "employeeId"]
        }
      ]
    })
      .then(allUsers => {
        if (allUsers && allUsers.rows && allUsers.rows.length) {
          responsehandler.getSuccessResult(
            allUsers,
            "Employees listed successfully",
            res
          );
        } else {
          responsehandler.getSuccessResult(
            allUsers.rows,
            "No Employees Found in this Course",
            res
          );
        }
      })
      .catch(function (error) {
        responsehandler.getErrorResult(error, res);
      });
  },
  getCourseByStatus(req, res) {
    let userInput = Utils.getReqValues(req);
    if (!userInput.status || !userInput.userId) {
      responsehandler.getErrorResult(
        "Both Status and UserId & resortId are mandatory",
        res
      );
      return false;
    }
    let whereConditions = {};
    let whereCond = {};
    let searchCondn = {};
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    whereCond = {
      $or: [
        {
          "$TrainingSchedule.assignedDate$": { $lte: currentDate, $ne: null }
        },
        {
          "$TrainingSchedule.dueDate$": { $lte: currentDate, $ne: null }
        }
      ]
    };
    // whereCond['assignedDate'] = { $lte: currentDate, $ne: null };
    // whereCond['dueDate'] = { $lte: currentDate, $ne: null };
    whereConditions['userId'] = userInput.userId;
    if (userInput.status === 'inProgress') {
      whereConditions['status'] = { $in: ['inProgress', 'failed'] };
    } else {
      whereConditions['status'] = userInput.status;
    }
    whereConditions['notificationFileId'] = { $eq: null };
    if (userInput.resortId) {
      whereConditions['resortId'] = userInput.resortId;
    }
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
    if (userInput.search) {
      let search = userInput.search;
      searchCondn = {
        $or: [
          {
            "$Course.courseName$": {
              $iLike: "%" + (search ? search : "") + "%"
            }
          }
        ], $and: whereConditions
      };
    } else {
      searchCondn = whereConditions;
    }
    let feedbackCodn = {};
    feedbackCodn['userId'] = userInput.userId;
    Model.TrainingScheduleResorts.findAndCountAll({
      attributes: [
        "userId",
        "courseId",
        "trainingClassId",
        "status",
        "completedDate",
        "trainingScheduleId",
        "notificationFileId"
      ],
      include: [{
        model: Model.TrainingSchedule,
        attributes: [
          "name",
          "assignedDate",
          "dueDate",
          "notificationDays",
          "trainingScheduleId",
          "scheduleType",
          "colorCode"
        ],
        where: whereCond
      }, {
        model: Model.Course,
        attributes: [
          'courseId',
          'courseName',
          'topic', 'createdBy'],
        include: [{
          model: Model.CourseTrainingClassMap,
          attributes: ['courseId', 'trainingClassId'], required: false
        }],
        required: false,
        distint: true,
      }, {
        model: Model.TrainingClass,
        attributes: ['trainingClassId', 'trainingClassName', 'createdBy'],
        required: false,
        distint: true,
        include: [{
          model: Model.FeedbackMapping,
          attributes: ['status', 'passPercentage', 'trainingClassId', 'userId'],
        }],
      }],
      required: true,
      where: searchCondn,
      limit: limit,
      offset: offset,
      distinct: true,
      order: [[Sequelize.col('"TrainingSchedule"."dueDate"'), 'ASC']],
    }).then(function (courseRes) {
      if (courseRes && courseRes.rows && courseRes.rows.length) {
        responsehandler.getSuccessResult(
          courseRes,
          "Courses Listed Successfully",
          res
        );
      } else {
        responsehandler.getSuccessResult(
          courseRes.rows,
          "No Course Found in this Status",
          res
        );
      }
    });
  },
  async update(req, res) {
    let Data = Utils.getReqValues(req);
    let checkSchedules = await Utils.checkScheduledCourses(Data, Model);
    if (checkSchedules.status === true) {
      let errorMessage;
      errorMessage = "Course is scheduled unable to edit by now.";
      return responsehandler.getErrorResult(errorMessage, res);
    } else {
      Model.Course.findOne({
        where: {
          courseId: Data.courseId
        }
      }).then(courses => {
        if (!courses) {
          return res.status(404).send({
            message: "Courses Not Found"
          });
        }
        Model.Course.update(Data, {
          where: { courseId: courses.dataValues.courseId }
        }).then(result => {
          Model.CourseTrainingClassMap.destroy({
            where: {
              courseId: Data.courseId
            }
          }).then(courses => {
            if (Data.courseTrainingClasses) {
              let trainingData = [];
              Data.courseTrainingClasses.forEach(trainingClassId => {
                let trainingObj = {};
                trainingObj.courseId = Data.courseId;
                trainingObj.trainingClassId = trainingClassId;
                trainingData.push(trainingObj);
              });
              Model.CourseTrainingClassMap.bulkCreate(trainingData)
                .then(result => {
                  let trainingCodn = {};
                  trainingCodn['trainingClassId'] = Data.courseTrainingClasses;
                  trainingCodn['courseId'] = { $eq: null };
                  return Model.FileMapping.findAll({ where: trainingCodn }).then(function (fileMapRes) {
                    let fileInsert = [];
                    if (fileMapRes.length > 0) {
                      fileMapRes.forEach(function (val, key) {
                        let obj = {};
                        obj.courseId = Data.courseId;
                        obj.trainingClassId = val.dataValues.trainingClassId;
                        obj.fileId = val.dataValues.fileId;
                        fileInsert.push(obj);
                      });
                      fileInsert = _.uniqWith(fileInsert, _.isEqual);
                    }
                    let wherecCourse = {};
                    wherecCourse['courseId'] = Data.courseId;
                    return Model.FileMapping.destroy({ where: wherecCourse }).then(function (fileResDestroy) {
                      return Model.FileMapping.bulkCreate(fileInsert, { individualHooks: true }).then(function (ress) {
                        return responsehandler.getUpdateResult(result, res);
                      });
                    });
                  });
                })
                .catch(err => {
                  var errorMessage = Utils.constructErrorMessage(err);
                  return responsehandler.getErrorResult(errorMessage, res);
                });
            }
          });
        })
          .catch(function (error) {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          })
          .catch(function (error) {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          });
      });
    }
  },
  getIndividualCourses(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    let courseCodn = {};
    let certificateCodn = {};
    if (userInput.courseId) {
      conditions['courseId'] = userInput.courseId;
      courseCodn['courseId'] = userInput.courseId;
      certificateCodn['courseId'] = userInput.courseId;
    }
    if (userInput.resortId) {
      conditions['resortId'] = userInput.resortId;
      certificateCodn['resortId'] = userInput.resortId;
    }
    certificateCodn['certificateGenerated'] = { $ne: null };
    Model.Course.findAll({
      attributes: [
        'courseId',
        'courseName',
        'created',
        'updated',
      ],
      include: [
        {
          model: Model.CourseTrainingClassMap,
          attributes: ['courseId', 'trainingClassId']
        },
        {
          model: Model.FileMapping,
          attributes: ['fileId', 'trainingClassId', 'courseId'],
          include: [{
            model: Model.File,
            attributes: ['fileSize', 'fileId', 'fileName']
          }]
        },
        {
          model: Model.TrainingScheduleResorts,
          where: conditions,
          required: false
        },
        {
          model: Model.CertificateUserMapping,
          where: certificateCodn,
          required: false
        },
        {
          model: Model.User,
          attributes: ["userName", 'firstName', 'lastName'],
          as: "createdByDetails",
          required: false
        }
      ],
      where: courseCodn
    }).then(function (responses) {
      if (responses) {
        responses.forEach(function (value, key) {
          let employeesCount = [];
          let assigned = [];
          let inProgress = [];
          let completed = [];
          if (value.TrainingScheduleResorts) {
            value.TrainingScheduleResorts.forEach(function (valSet, keySet) {
              employeesCount.push(valSet.userId);
              if (valSet.status === 'assigned') {
                assigned.push(valSet);
              }
              if (valSet.status === 'inProgress') {
                inProgress.push(valSet);
              }
              if (valSet.status === 'completed') {
                completed.push(valSet);
              }
            });
          }
          value.dataValues['totalEmployeeCount'] = value.TrainingScheduleResorts.length;
          if (!value.dataValues.hasOwnProperty('assignedCount')) {
            value.dataValues['assignedCount'] = {};
          }
          let arrayassignedSum = _.uniq(assigned);
          value.dataValues['assignedCount'] = arrayassignedSum.length;

          if (!value.dataValues.hasOwnProperty('inProgressCount')) {
            value.dataValues['inProgressCount'] = {};
          }
          let arrayinProgressSum = _.uniq(inProgress);
          value.dataValues['inProgressCount'] = arrayinProgressSum.length;

          if (!value.dataValues.hasOwnProperty('completedCount')) {
            value.dataValues['completedCount'] = {};
          }
          let arraycompletedSum = _.uniq(completed);
          value.dataValues['completedCount'] = arraycompletedSum.length;
        });
        return responsehandler.getSuccessResult(
          responses,
          "Course listed successfully",
          res
        );
      } else {
        return responsehandler.getNotExistsResult(result, res);
      }
    });
  },
  getEditdetails(req, res) {
    let Data = Utils.getReqValues(req);
    let conditions = {};
    let trainingConditions = {};
    let filecondn = {};
    if (Data.courseId) {
      conditions["courseId"] = Data.courseId;
    }
    if (Data.trainingClassId) {
      conditions["trainingClassId"] = Data.trainingClassId;
    }
    if (Data.fileType) {
      filecondn["fileType"] = Data.fileType;
    }
    Model.File.findAll({
      include: [{
        model: Model.FileMapping,
        attributes: ['fileId', 'courseId', 'trainingClassId'],
        where: conditions,
        include: [
          { model: Model.Course, attributes: ['courseName', 'courseId'] },
          { model: Model.TrainingClass, attributes: ['trainingClassName', 'trainingClassId'] }],
      }],
      where: filecondn
    }).then(function (resp) {
      responsehandler.getSuccessResult(
        resp,
        "Courses Listed Successfully",
        res
      );
    });
  },
  async courseUpdate(req, res) {
    let Data = Utils.getReqValues(req);
    let notificationMsg = await Utils.getNotifications('updateCourse');
    let newFileDetails = [];
    let updatedData = [];
    let fileMapCodn = [];
    let newfileMapCodn = [];
    if (Data.trainingClassId) {
      Data.files.forEach(function (item, key) {
        if (!item.fileId) {
          newFileDetails.push(item);
        } else {
          updatedData.push(item);
        }
      });
      return Model.sequelize
        .transaction(function (t) {
          return Model.Course.update(Data, {
            where: { courseId: Data.courseId },
            transaction: t
          }).then(updatedCourse => {
            let courseUpdate = Data.courseId;
            let whereConditions = {};
            whereConditions['courseId'] = courseUpdate;
            whereConditions['status'] = { $in: ['assigned'] };

            return Model.TrainingScheduleResorts.findAll({ where: whereConditions }).then(function (scheduleRes) {
              return Model.Sequelize.Promise.map(updatedData, function (
                itemToUpdate
              ) {
                let conditions = {};
                conditions["fileId"] = itemToUpdate["fileId"];
                return Model.File.update(itemToUpdate, {
                  where: conditions,
                  transaction: t
                });
              })
                .then(function (updatedResult) {
                  return Model.File.bulkCreate(newFileDetails, { individualHooks: true }, { transaction: t }).then(function (fileRes) {
                    fileRes.forEach(function (item, key) {
                      let fileObj = {};
                      fileObj.fileId = item.dataValues.fileId;
                      fileObj.trainingClassId = Data.trainingClassId;
                      fileObj.courseId = courseUpdate;
                      fileMapCodn.push(fileObj);
                    });
                    if (Data.fileUpdateCourse) {
                      Data.fileUpdateCourse.forEach(function (item, key) {
                        let fileObjSet = {};
                        fileObjSet.fileId = item;
                        fileObjSet.trainingClassId = Data.trainingClassId;
                        fileObjSet.courseId = courseUpdate;
                        newfileMapCodn.push(fileObjSet);
                      });
                    }
                    fileMapCodn = fileMapCodn.concat(newfileMapCodn);
                    return Model.FileMapping.bulkCreate(fileMapCodn, { transaction: t }).then(function (fileMapRes) {
                      let notifications = [];
                      if (scheduleRes) {
                        scheduleRes.forEach(function (val, key) {
                          let notifyObj = {};
                          notifyObj['senderId'] = Data.createdBy;
                          notifyObj['receiverId'] = val.dataValues.userId;
                          notifyObj['courseId'] = Data.courseId;
                          if (notificationMsg.status === true) {
                            let notifyMessage = notificationMsg.data.message;
                            let notifyMessage_1 = notifyMessage.replace(new RegExp('{{COURSE}}', 'g'), Data.courseName);
                            notifyObj['notification'] = notifyMessage_1;
                          }
                          notifyObj['type'] = 'updateCourse';
                          notifications.push(notifyObj);
                        });
                        return Model.Notification.bulkCreate(notifications, { individualHooks: true }).then(function (responseNotify) {
                          return { "files": fileRes, "fileMapRes": fileMapRes };
                        });
                      } else {
                        return { "files": fileRes, "fileMapRes": fileMapRes };
                      }
                    });
                  });
                })
                .then(function (resp) {
                  return Model.File.destroy(
                    { where: { fileId: Data.fileIds } },
                    { transaction: t }
                  );
                });
            });
          });
        })
        .then(function (updatedCourseDetail) {
          responsehandler.getSuccessResult(
            updatedCourseDetail,
            "Updated Successfully",
            res
          );
        })
        .catch(function (error) {
          let errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      return responsehandler.getErrorResult(
        "Traningclass Id is mandatory",
        res
      );
    }
  },
  courseDuplicate(req, res) {
    let Data = Utils.getReqValues(req);
    let newFileDetails = [];
    let updatedData = [];
    let fileMapCodn = [];
    if (Data.trainingClassId) {
      Data.files.forEach(function (item, key) {
        if (!item.fileId) {
          newFileDetails.push(item);
        } else {
          updatedData.push(item);
        }
      });
      return Model.sequelize
        .transaction(function (t) {
          let courseCodn = {};
          courseCodn.courseName = Data.courseName;
          return Model.Course.findOne({ where: courseCodn }, { transaction: t }).then(function (courseRes) {
            if (courseRes.length > 0) {
              return responsehandler.getErrorResult("Course Name already exists", res);
            } else {
              return Model.Course.create(Data, { transaction: t }).then(
                updatedCourse => {
                  let courseTaining = {};
                  courseTaining.courseId = updatedCourse.dataValues.courseId;
                  courseTaining.trainingClassId = Data.trainingClassId;
                  return Model.CourseTrainingClassMap.create(courseTaining, {
                    transaction: t
                  }).then(created => {
                    return Model.Sequelize.Promise.map(updatedData, function (
                      itemToUpdate
                    ) {
                      let conditions = {};
                      conditions["fileId"] = itemToUpdate["fileId"];
                      return Model.File.update(itemToUpdate, {
                        where: conditions,
                        transaction: t
                      });
                    })
                      .then(function (updatedResult) {
                        return Model.File.bulkCreate(newFileDetails, { individualHooks: true }, { transaction: t }).then(function (fileRes) {
                          fileRes.forEach(function (item, key) {
                            let fileObj = {};
                            fileObj.fileId = item.dataValues.fileId;
                            fileObj.trainingClassId = Data.trainingClassId;
                            fileObj.courseId = Data.courseId;
                            fileMapCodn.push(fileObj);
                          });
                          return Model.FileMapping.bulkCreate(fileMapCodn, { transaction: t }).then(function (fileMapRes) {
                            return { "files": fileRes, "fileMapRes": fileMapRes };
                          });
                        });
                      })
                      .then(function (resp) {
                        if (Data.fileIds) {
                          return Model.File.destroy(
                            { where: { fileId: Data.fileIds } },
                            { transaction: t }
                          );
                        }
                      });
                  });
                }
              );
            }
          });
        })
        .then(function (updatedCourseDetail) {
          responsehandler.getSuccessResult(
            updatedCourseDetail,
            "Updated Successfully",
            res
          );
        })
        .catch(function (error) {
          let errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      return responsehandler.getErrorResult(
        "traningclass Id is mandatory",
        res
      );
    }
  },
  assignVideosToCourse(req, res) {
    let userInput = Utils.getReqValues(req);
    if (!userInput.courseId) {
      const errorMessage = "courseId is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    } else if (!userInput.trainingClassId) {
      const errorMessage = "trainingClassId is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    } else if (!userInput.fileType) {
      const errorMessage = "fileType is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    } else if (!userInput.assignedFiles) {
      const errorMessage = "assignedFiles is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    } else if (!Array.isArray(userInput.assignedFiles)) {
      const errorMessage = "assignedFiles is Not in correct format";
      return responsehandler.getErrorResult(errorMessage, res);
    } else {
      let msg;
      if (userInput.fileType === "video") {
        msg = "Videos";
      } else {
        msg = "Documents";
      }
      if (userInput.fileIds && userInput.fileIds.length > 0) {
        let fileMapArray = [];
        userInput.fileIds.forEach(function (val, key) {
          let obj = {};
          obj.trainingClassId = userInput.trainingClassId;
          obj.courseId = userInput.courseId;
          obj.fileId = val;
          fileMapArray.push(obj);
        });
        Model.FileMapping.bulkCreate(fileMapArray, { individualHooks: true }).then(function (mapRes) {
          let message = msg + " assigned to course successfully";
          return responsehandler.getSuccessResult(mapRes, message, res);
        });
      }
      else if (userInput.assignedFiles) {
        Model.File.bulkCreate(userInput.assignedFiles, { individualHooks: true })
          .then(function (files) {
            let fileMapArray = [];
            files.forEach(function (val, key) {
              let obj = {};
              obj.trainingClassId = userInput.trainingClassId;
              obj.courseId = userInput.courseId;
              obj.fileId = val.dataValues.fileId;
              fileMapArray.push(obj);
            });
            Model.FileMapping.bulkCreate(fileMapArray, { individualHooks: true }).then(function (mapRes) {
              let message = msg + " assigned to course successfully";
              return responsehandler.getSuccessResult(mapRes, message, res);
            });
          })
          .catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          });
      }
    }
  },
  getTrainingClasses(req, res) {
    let userInput = Utils.getReqValues(req);
    if (!userInput.courseId) {
      const errorMessage = "courseId is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    } else {
      let conditions = {};
      conditions["courseId"] = userInput.courseId;
      Model.TrainingClass.findAll({
        attributes: ["trainingClassId", "trainingClassName"],
        include: [
          {
            model: Model.CourseTrainingClassMap,
            attributes: [],
            where: conditions,
            required: true
          },
        ],
        order: [['trainingClassName', 'DESC']]
      }).then(function (resu) {
        return responsehandler.getSuccessResult(
          resu,
          "Training classes listed successfully",
          res
        );
      });
    }
  },
  async saveAsNewVersion(req, res) {
    let Data = Utils.getReqValues(req);
    let notificationMsg = await Utils.getNotifications('saveAsNewVersion');
    let saveAllFileIds = [];
    let newFileDetails = [];
    let updatedData = [];
    let fileMapCodn = [];
    if (Data.trainingClassId) {
      if (Data.files) {
        if (Data.files.length > 0) {
          Data.files.forEach(function (item, key) {
            if (!item.fileId) {
              item.createdBy = Data.createdBy;
              item.resortId = Data.resortId;
              newFileDetails.push(item);
            } else {
              saveAllFileIds.push(item.fileId);
              updatedData.push(item);
            }
          });
        }
      }
      let whereFileCondn = {};
      whereFileCondn['trainingClassId'] = Data.trainingClassId;
      Model.FileMapping.findAll({ where: whereFileCondn }).then(function (existFileMap) {
        let existArray = [];
        if (existFileMap) {
          existFileMap.forEach(function (val, key) {
            existArray.push(val.dataValues.fileId);
          });
          let diff = _.difference(saveAllFileIds, existArray);
          Data.resourseFiles = diff;
        }
      });
      return Model.sequelize
        .transaction(function (t) {
          let oldCourseId = Data.courseId;
          let oldFileCodn = {};
          oldFileCodn['courseId'] = oldCourseId;
          return Model.FileMapping.findAll({ where: oldFileCodn }, { transaction: t }).then(function (oldfilRes) {
            return Model.Course.findOne({ where: { courseId: Data.courseId } }, { transaction: t }).then(function (oldCourse) {
              let oldCourseName = oldCourse.dataValues.courseName;
              let oldArray = oldCourseName.split('~V');
              let courseVersion = (oldArray[1]) ? parseInt(oldArray[1]) + parseInt(1) : 1;
              let newCourseName = oldArray[0] + '~V' + courseVersion;
              let input = { "courseName": newCourseName, "topic": Data.topic, "createdBy": Data.createdBy, "resortId": Data.resortId };

              //console.log("new saved versions updates");
              //console.log(input);
              return Model.Course.create(input, { transaction: t }).then(
                updatedCourse => {
                  let courseTaining = {};
                  let newCourseId = updatedCourse.dataValues.courseId;
                  courseTaining.courseId = updatedCourse.dataValues.courseId;
                  courseTaining.trainingClassId = Data.trainingClassId;
                  let insertAsNewCourse = [];
                  if (oldfilRes) {
                    oldfilRes.forEach(function (val, key) {
                      let object = {};
                      object.fileId = val.dataValues.fileId;
                      object.trainingClassId = val.dataValues.trainingClassId;
                      object.courseId = newCourseId;
                      insertAsNewCourse.push(object);
                    });
                  }
                  let resourseResult = [];
                  if (Data.resourseFiles) {
                    Data.resourseFiles.forEach(function (val, key) {
                      let resourceObj = {};
                      resourceObj['fileId'] = val;
                      resourceObj['trainingClassId'] = Data.trainingClassId;
                      resourceObj['courseId'] = newCourseId;
                      resourseResult.push(resourceObj);
                    });
                  }
                  if (resourseResult.length > 0) {
                    insertAsNewCourse = insertAsNewCourse.concat(resourseResult);
                  }
                  return Model.CourseTrainingClassMap.create(courseTaining, {
                    transaction: t
                  }).then(created => {
                    let version = { createdBy: Data.createdBy, newCourseId: updatedCourse.dataValues.courseId, oldCourseId: Data.courseId }
                    return Model.Version.create(version, { transaction: t }).then(function (versions) {
                      return Model.Sequelize.Promise.map(updatedData, function (
                        itemToUpdate
                      ) {
                        let conditions = {};
                        conditions["fileId"] = itemToUpdate["fileId"];
                        return Model.File.update(itemToUpdate, {
                          where: conditions,
                          transaction: t
                        });
                      })
                        .then(function (updatedResult) {
                          return Model.File.bulkCreate(newFileDetails, { individualHooks: true }, { transaction: t }).then(function (fileRes) {
                            fileRes.forEach(function (item, key) {
                              let fileObj = {};
                              fileObj.fileId = item.dataValues.fileId;
                              fileObj.trainingClassId = Data.trainingClassId;
                              fileObj.courseId = updatedCourse.dataValues.courseId;
                              fileMapCodn.push(fileObj);
                            });
                            fileMapCodn = fileMapCodn.concat(insertAsNewCourse);
                            return Model.FileMapping.bulkCreate(fileMapCodn,  { individualHooks: true },{ transaction: t }).then(function (fileMapRes) {

                            

                              let courseDataCondn = {};
                              courseDataCondn['courseId'] = oldCourseId;
                              courseDataCondn['status'] = 'assigned';
                              let updateCondition = {};
                              updateCondition['courseId'] = newCourseId;

                             
                              return Model.TrainingScheduleResorts.findAll({ where: courseDataCondn }, { transaction: t }).then(function (scheduleRes) {
                                if (scheduleRes && scheduleRes.length > 0) {
                                  let notifications = [];
                                  scheduleRes.forEach(function (val, key) {
                                    let notifyObj = {};
                                    notifyObj['senderId'] = (Data.createdBy) ? Data.createdBy : '';
                                    notifyObj['receiverId'] = val.userId;
                                    notifyObj['courseId'] = newCourseId;
                                    let nameSector = newCourseName;
                                    if (notificationMsg.status === true) {
                                      let notifyMessage = notificationMsg.data.message;
                                      let notifyMessage_1 = notifyMessage.replace(new RegExp('{{COURSE}}', 'g'), nameSector);
                                      notifyObj['notification'] = notifyMessage_1;
                                    }
                                    notifyObj['type'] = 'saveAsNewVersion';
                                    notifications.push(notifyObj);
                                  });
                                  console.log("notifications", notifications);
                                  return Model.Course.update({ status: 'scheduled' }, { where: updateCondition }, { transaction: t }).then(function (updateRes) {
                                    return Model.TrainingScheduleResorts.update(updateCondition, { where: courseDataCondn }, { transaction: t }).then(function (updateScheduleCourse) {
                                      return Model.Notification.bulkCreate(notifications, { transaction: t }).then(function (res) {
                                        return { "files": fileRes, "fileMapRes": fileMapRes };
                                      });
                                    });
                                  });
                                } else {
                                  console.log("fileRes");
                                  console.log(fileRes);
                                  console.log("fileMapRes");
                                  console.log(fileMapRes);
                                  return { "files": fileRes, "fileMapRes": fileMapRes };
                                }
                              });
                            });
                          });
                        }).then(function (resp) {
                          console.log(Data);
                          console.log("Data.fileIds");
                          console.log(Data.fileIds);
                          if (Data && Data.fileIds && Data.fileIds.length > 0) {
                            let oldCourseRemove = { 'courseId': newCourseId, 'fileId': { $in: Data.fileIds } };
                            console.log(oldCourseRemove);
                            return Model.FileMapping.findAll({ where: oldCourseRemove }, { transaction: t }).then(function (fileRes) {

                              console.log("fileRes result found");
                              console.log(fileRes);
                              if (fileRes) {
                                return Model.FileMapping.destroy({ where: oldCourseRemove }, { transaction: t }).then(function (oldFileMap) {
                                  console.log(oldFileMap);
                                  // return Model.File.destroy(
                                  //   { where: { fileId: { $in: Data.fileIds } } },
                                  //   { transaction: t }
                                  // ).then(function (deleteres) {
                                  // console.log("deleteres");
                                  // console.log(deleteres);
                                  return oldFileMap;
                                  //});
                                });
                              } else {
                                return resp;
                              }
                            });
                          } else {
                            return resp;
                          }
                        });
                    });
                  });
                }
              ).catch(function (error) {
                console.log("coure errr");
                console.log(error);
                let errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
              });
            });
          });
        })
        .then(function (updatedCourseDetail) {

          console.log("updatedCourseDetail");
          console.log(updatedCourseDetail);
          responsehandler.getSuccessResult(
            updatedCourseDetail,
            "Course saved as new version successfully",
            res
          );
        })
        .catch(function (error) {
          let errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      return responsehandler.getErrorResult(
        "traningclass Id is mandatory",
        res
      );
    }
  },
  delete(req, res) {
    let Data = Utils.getReqValues(req);
    let conditions = {};
    if (Data.courseId) {
      conditions['courseId'] = Data.courseId;
    }
    let itemToUpdate;
    let message;
    if (Data.deleteUndo) {
      itemToUpdate = {
        isDeleted: false
      }
      message = 'Course deleted status undo successfully';
    } else {
      itemToUpdate = {
        isDeleted: true
      }
      message = 'Course deleted successfully';
    }
    let scheduleCond = {};
    scheduleCond['courseId'] = Data.courseId;
    scheduleCond['status'] = { $in: ['inProgress', 'completed'] }

    Model.TrainingScheduleResorts.findAll({ where: scheduleCond }).then(function (response) {
      console.log(response);
      if (response.length === 0 || Data.deleteUndo) {
        return Model.Course
          .findOne({ where: { courseId: Data.courseId } })
          .then(course => {
            if (!course) {
              return res.status(400).send({
                "isSucess": false,
                message: 'Course Not Found',
              });
            }
            Model.Course.update(itemToUpdate, {
              where: conditions,
            },
            ).then(function (updated) {
              Model.CourseTrainingClassMap.update(itemToUpdate, { where: conditions }).then(function (upadteds) {
                Model.TrainingScheduleCourses.update(itemToUpdate, { where: conditions }).then(function (trainingscheduleupdate) {
                  Model.TrainingScheduleFiles.update(itemToUpdate, { where: conditions }).then(function (sdsf) {
                    Model.Notification.update(itemToUpdate, { where: conditions }).then(function (notify) {
                      Model.NotificationFileMap.update(itemToUpdate, { where: conditions }).then(function (files) {
                        Model.TrainingScheduleResorts.update(itemToUpdate, { where: conditions }).then(function (sdsdfsdff) {
                          Model.FeedbackMapping.update(itemToUpdate, { where: conditions }).then(function (dadfdfs) {
                            res.status(200).send({ "isSuccess": true, message: message });
                          })
                        });
                      })
                    })
                  })
                })
              })
            });
          })
      } else {
        return responsehandler.getErrorResult("The course is already scheduled to few users and is in progress. You cannot make any changes to an ongoing course", res);
      }
    });
  },
  recentlyDeleted(req, res) {
    let Data = Utils.getReqValues(req);
    return Model.Course
      .findOne({ where: { courseId: Data.courseId } })
      .then(course => {
        if (!course) {
          return res.status(400).send({
            "isSucess": false,
            message: 'Course Not Found',
          });
        }
        return Model.TrainingScheduleCourses.findOne({ where: { courseId: Data.courseId } })
          .then(courseSet => {
            if (!courseSet) {
              return Course
                .destroy({ where: { courseId: Data.courseId } })
                .then(() => res.status(200).send({ "isSuccess": true, message: 'Course deleted successfully' }))
                .catch((error) => res.status(400).send(error));
            } else {
              res.status(200).send({ "isSuccess": false, message: 'Course scheduled to training schedule not able to delete' });
            }
          });
      })
      .catch((error) => res.status(400).send(error));
  },
  async getCourses(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    if (userInput.courseId) {
      conditions['courseId'] = userInput.courseId;
    }
    if (userInput.status) {
      conditions['status'] = userInput.status;
    }
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }
    if (resorts && userInput.resortId) {
      conditions['resortId'] = { $in: resorts };
    }
    if (userInput.draft) {
      conditions['draft'] = userInput.draft;
    } else {
      conditions['draft'] = false;
    }
    if (userInput.isDeleted) {
      conditions['isDeleted'] = true;
    } else {
      conditions['isDeleted'] = false;
    }
    if (userInput.userId) {
      let allDivUsers = await Utils.getAllDivisionUsers(userInput, Model);
      let userIds = [];
      if (allDivUsers.status == true) {
        userIds = allDivUsers.data;
      }
      conditions['createdBy'] = userIds;
    }
    Model.Course.findAll({
      where: conditions,
      attributes: ['courseName', 'courseId', 'resortId'],
      order: [['courseName', 'ASC']]
    }).then(function (courseRes) {
      responsehandler.getSuccessResult(
        courseRes,
        "Course listed successfully",
        res
      );
    });
  },
  getSpecificCourseDatas(req, res) {
    let userInput = Utils.getReqValues(req);
    let uploadPaths = Utils.uploadFilePaths();
    let response = {};
    let whereConditions = {};
    if (userInput.courseId) {
      whereConditions['courseId'] = userInput.courseId;
    }
    let orderBy = [
      [Model.TrainingClass, Model.FileMapping, Model.File, 'order', 'ASC'],
      [Model.TrainingClass, Model.QuizMapping, Model.Quiz, Model.Question, 'order', 'ASC']
    ];
    Model.CourseTrainingClassMap.findAll({
      where: whereConditions,
      attributes: ['courseId', 'trainingClassId'],
      include: [{
        model: Model.TrainingClass,
        attributes: ['trainingClassId', 'trainingClassName'],
        include: [
          {
            model: Model.FileMapping,
            attributes: ['fileId', 'trainingClassId'],
            where: whereConditions,
            include: [{ model: Model.File }],
            required: false
          },
          {
            model: Model.QuizMapping,
            attributes: ['quizId', 'trainingClassId'],
            include: [{ model: Model.Quiz, include: [{ model: Model.Question }] }],
            required: false
          }]
      }],
      order: orderBy
    }).then(function (courseRes) {
      response["uploadPaths"] = uploadPaths;
      response['course'] = courseRes;
      responsehandler.getSuccessResult(
        response,
        "Course listed successfully",
        res
      );
    });
  }
};
