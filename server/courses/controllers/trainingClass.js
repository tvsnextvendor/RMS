const Model = require("../models/");
const Utils = require("./../utils/Utils");
const constant = require("./../utils/constant");
const responsehandler = require("./../utils/responseHandler");
const L = require("lodash");
const fs = require("fs");
const async = require("async");
const Sequelize = require('sequelize');
const _ = require('lodash');
module.exports = {
  async list(req, res) {
    // Declarations 
    let userInput = Utils.getReqValues(req);
    let response = {};
    let conditions = {};
    let whereConditions = {};
    let trainingConditions = {};
    let departUsers = [];
    let divUsers = [];
    let isReq = false;
    //Parent Child Differences 
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }
    //Paginations
    let limit, page, offset;
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    //Filters
    if (userInput.courseId) {
      conditions['courseId'] = userInput.courseId;
    }
    if (userInput.trainingClassId) {
      trainingConditions["trainingClassId"] = userInput.trainingClassId;
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
    // if (userInput.parentResortId) {
    //   isReq = true;
    //   whereConditions["parentId"] = userInput.parentResortId;
    // }
    // if (userInput.subResortId) {
    //   isReq = true;
    //   whereConditions["resortId"] = userInput.subResortId;
    // }
    // if (userInput.divisionId) {
    //   isReq = true;
    //   whereConditions["divisionId"] = userInput.divisionId;
    // }
    // if (userInput.departmentId) {
    //   isReq = true;
    //   whereConditions["departmentId"] = userInput.departmentId;
    // }
    // if (userInput.resortId) {
    //   whereConditions["resortId"] = userInput.resortId;
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

    conditions['isDeleted'] = false;
    conditions['status'] = { $in: ['none', 'scheduled'] };

    if (userInput.createdBy && departUsers.length > 0) {
      conditions['createdBy'] = { $in: departUsers };
    }
    else if (userInput.createdBy && divUsers.length > 0) {
      conditions['createdBy'] = { $in: divUsers };
    }
    else if (userInput.createdBy) {
      conditions['createdBy'] = userInput.createdBy;
    } else if (userInput.subResortId) {
      conditions["resortId"] = userInput.subResortId;
    } else {
      conditions['resortId'] = { $in: resorts };
    }
    let searchCondition;
    if (userInput.search) {
      let search = userInput.search;
      isReq = true;
      searchCondition = {
        $or: [
          {
            courseName: {
              $iLike: "%" + (search ? search : '') + "%"
            }
          }
          //,
          // {
          //   "$CourseTrainingClassMaps.TrainingClass.trainingClassName$": {
          //     $iLike: "%" + (search ? search : '') + "%"
          //   }
          // }
        ],
        $and: conditions
      };
    } else {
      searchCondition = conditions;
    }
    // Model.Version.findAll({ where: versionConditions }).then(function (versions) {
    //   let oldCourseIds = L.map(versions, 'oldCourseId');
    //   if (userInput.courseId) {
    //     conditions["courseId"] = userInput.courseId;
    //   } else {
    //     conditions['courseId'] = { $notIn: oldCourseIds };
    //   }
    Model.Course.findAndCountAll({
      where: searchCondition,
      attributes: ["courseId", "courseName", "createdBy"],
      include: [
        {
          model: Model.CourseTrainingClassMap,
          where: trainingConditions,
          include: [
            {
              model: Model.TrainingClass,
              attributes: [
                "trainingClassId",
                "trainingClassName"
              ],
              required: false,
              include: [{ model: Model.QuizMapping, attributes: ['quizId'] }]
            }
          ],
          required: false
        },
        {
          model: Model.TrainingScheduleResorts,
          where: whereConditions,
          required: isReq
        },
        {
          model: Model.FileMapping,
          attributes: ['trainingClassId', 'courseId', 'fileId'],
          include: [{
            model: Model.File,
            attributes: ["fileId", "fileType"],
            required: false
          }]
        }
      ],
      limit: limit,
      offset: offset,
      distinct: true,
      // duplicating:false,
      // subQuery:false,
      order: [["courseId", "DESC"]]
    })
      .then(result => {
        if (result) {
          let allCourses = [];
          //Construct JSON with Files and Training Class Count
          JSON.parse(JSON.stringify(result.rows)).forEach(function (item, key) {
            let courseItem = Object.assign({}, item);
            courseItem.trainingClassCount =
              courseItem.CourseTrainingClassMaps.length;
            let newTrainingClassMaps = [];
            courseItem.CourseTrainingClassMaps.forEach(function (
              classItem,
              classIndex
            ) {
              let newClassItem = Object.assign({}, classItem);
              let newArray = [];
              item.FileMappings.forEach(function (val, key) {
                if (val.trainingClassId === newClassItem.TrainingClass.trainingClassId) {
                  newArray.push(val);
                }
              });
              if (!newClassItem.TrainingClass.hasOwnProperty(newClassItem.TrainingClass.trainingClassId)) {
                newClassItem.TrainingClass[newClassItem.TrainingClass.trainingClassId] = {};
              }
              newClassItem.TrainingClass[newClassItem.TrainingClass.trainingClassId] = newArray;
              if (newClassItem.TrainingClass[newClassItem.TrainingClass.trainingClassId]) {
                newClassItem.TrainingClass.videosCount = newClassItem.TrainingClass[newClassItem.TrainingClass.trainingClassId].filter(
                  file => file.File.fileType.toLowerCase() == "video"
                ).length;
                newClassItem.TrainingClass.documentsCount = newClassItem.TrainingClass[newClassItem.TrainingClass.trainingClassId].filter(
                  file => file.File.fileType.toLowerCase() == "document"
                ).length;
              }
              newTrainingClassMaps.push(newClassItem);
            });
            courseItem.CourseTrainingClassMaps = newTrainingClassMaps;
            allCourses.push(courseItem);
          });
          response.count = result.count;
          response.rows = allCourses;
          return responsehandler.getSuccessResult(
            response,
            "Training classes listed successfully",
            res
          );
        } else {
          return responsehandler.getNotExistsResult(result, res);
        }
      })
      .catch(function (error) {
        let errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },
  trainingList(req, res) {
    let userInput = Utils.getReqValues(req);
    let whereConditions = {};
    if (userInput.createdBy) {
      whereConditions['createdBy'] = userInput.createdBy;
    }
    if (userInput.resortId) {
      whereConditions['resortId'] = userInput.resortId;
    }
    // if (userInput.draft === 'true') {
    //   whereConditions['draft'] = true;
    // } else if (userInput.draft === 'false') {
    //   whereConditions['draft'] = false;
    // }else{
    //   whereConditions['draft'] = false;
    // }
    // if(userInput.allDrafts === '1'){
    //   whereConditions['draft'] = {$in :[true ,false]};
    // }
    Model.TrainingClass.findAll({ where: whereConditions })
      .then(training => {
        if (training.length > 0) {
          return responsehandler.getSuccessResult(
            training,
            "Training classes listed successfully",
            res
          );
        } else {
          return responsehandler.getNotExistsResult(training, res);
        }
      })
      .catch(function (error) {
        let errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },
  async quizlist(req, res) {
    let userInput = Utils.getReqValues(req);

    //Parent Child Differences 
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }
    let conditions = {};
    let mapCodn = {};
    let andCondn = {};
    let quizCond = {};
    let trainingObj = [];
    let orderBy;
    let departUsers = [];
    let divUsers = [];

    if (userInput.departmentId) {
      let departData = await Utils.getParticularDepartUsers(userInput, Model);
      if (departData.status === true) {
        departUsers = departData.data;
        andCondn['createdBy'] = { $in: departUsers };
      }
    } else if (userInput.divisionId) {
      let divData = await Utils.getParticularDivUsers(userInput, Model);
      if (divData.status === true) {
        divUsers = divData.data;
        andCondn['createdBy'] = { $in: divUsers };
      }
    }
    if (userInput.trainingClassId) {
      mapCodn['trainingClassId'] = userInput.trainingClassId;
      trainingObj = [
        {
          model: Model.QuizMapping,
          where: mapCodn,
          // required:true,
          include: [
            {
              model: Model.TrainingClass,
              attributes: ['trainingClassId', 'trainingClassName']
            }
          ],
        },
        { model: Model.Question }
      ];
      // orderBy = [['created', 'DESC']];
      orderBy = [[Model.Question, 'order', 'ASC']];
    } else {
      trainingObj = [{ model: Model.Question }];
      orderBy = [['created', 'DESC']];
    }
    if (userInput.quizId) {
      andCondn['quizId'] = userInput.quizId;
      quizCond['quizId'] = userInput.quizId;
      orderBy = [[Model.Question, 'order', 'ASC']];
    }
    if (userInput.createdBy && departUsers.length > 0) {
      andCondn['createdBy'] = { $in: departUsers };
    }
    else if (userInput.createdBy && divUsers.length > 0) {
      andCondn['createdBy'] = { $in: divUsers };
    }
    else if (userInput.createdBy) {
      andCondn['createdBy'] = userInput.createdBy;
    } else if (userInput.subResortId) {
      andCondn["resortId"] = userInput.subResortId;
    } else if (resorts.length > 0) {
      andCondn['resortId'] = { $in: resorts };
    }
    if (userInput.draft === 'true') {
      andCondn['draft'] = true;
    } else if (userInput.draft === 'false') {
      andCondn['draft'] = false;
    } else {
      andCondn['draft'] = false;
    }

    if (userInput.allDrafts === '1') {
      andCondn['draft'] = { $in: [true, false] };
    }
    if (userInput.search) {
      let search = userInput.search;
      conditions = {
        $or: [
          {
            quizName: {
              $iLike: "%" + (search ? search : "") + "%"
            }
          }
        ],
        $and: andCondn
      };
    } else {
      conditions = andCondn;
    }
    Model.Quiz.findAll({
      where: conditions,
      attributes: ['quizId', 'quizName', 'createdBy', 'draft', 'approvedStatus'],
      include: trainingObj,
      order: orderBy
    }).then(function (quiz) {
      let responseObj = {};
      if (userInput.courseId) {
        let courseIdCodn = {};
        courseIdCodn['courseId'] = userInput.courseId;
        Model.Course.findOne({ where: courseIdCodn, attributes: ['courseName'] }).then(function (courseInfo) {
          responseObj['quiz'] = quiz;
          responseObj['course'] = courseInfo;
          return responsehandler.getSuccessResult(
            responseObj,
            "Quiz listed successfully",
            res
          );
        }).catch(function (error) {
          let errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
      } else {
        responseObj['quiz'] = quiz;
        return responsehandler.getSuccessResult(
          responseObj,
          "Quiz listed successfully",
          res
        );
      }
    }).catch(function (error) {
      let errorMessage = Utils.constructErrorMessage(error);
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  quizAdd(req, res) {
    let userInput = Utils.getReqValues(req);
    if (!userInput.quizName) {
      return responsehandler.getErrorResult("quizName is required", res);
    }
    else if (!userInput.quizQuestions) {
      return responsehandler.getErrorResult("quizQuestions is required", res);
    }
    else {
      userInput.quizName = userInput.quizName.trim();
      return Model.sequelize
        .transaction(function (t) {
          return Model.Quiz.create(userInput, t).then(function (quizRes) {
            let quizResponse = quizRes.dataValues;
            let quizqstn = userInput.quizQuestions;
            quizqstn.forEach(function (val, key) {
              val.quizId = quizResponse.quizId;
            });
            return Model.Question.bulkCreate(quizqstn, { individualHooks: true }, t).then(function (questionRes) {
              return { 'quiz': quizRes, 'questions': questionRes }
            });
          });
        }).then(function (quizResponse) {
          responsehandler.getSuccessResult(
            quizResponse,
            "Quiz Saved Successfully",
            res
          );
        })
        .catch(function (error) {
          let errorMessage = Utils.constructErrorMessage(error);
          if (errorMessage == 'quizName must be unique,\nresortId must be unique') {
            errorMessage = "Quiz name must be unique";
          }
          return responsehandler.getErrorResult(errorMessage, res);
        });
    }
  },
  quizUpdate(req, res) {
    let Data = Utils.getReqValues(req);
    let newQuizDetails = [];
    let updatedData = [];
    if (Data.quizQuestions) {
      Data.quizQuestions.forEach(function (item, key) {
        if (!item.questionId) {
          item.quizId = Data.quizId;
          newQuizDetails.push(item);
        } else {
          updatedData.push(item);
        }
      });
    }
    Model.Quiz.update(Data, { where: { quizId: Data.quizId } }).then(function (quiz) {
      if (quiz) {
        Model.Question.destroy({ where: { questionId: Data.questionIds } });
        if (Data.quizQuestions) {
          if (updatedData.length > 0) {
            return Sequelize.Promise.map(updatedData, function (
              itemToUpdate
            ) {
              let Id = "questionId";
              let conditions = {};
              conditions[Id] = itemToUpdate[Id];
              // itemToUpdate.quizId = Data.quizId;
              // return false;
              return Model.Question.update(itemToUpdate, {
                where: conditions,
              });
            }).then(function (updatedResult) {
              if (newQuizDetails.length > 0) {
                return Model.Question.bulkCreate(
                  newQuizDetails, { individualHooks: true }
                ).then(function (resp) {
                  let questionArrayMap = [];
                  let questionIds = [];
                  responsehandler.getSuccessResult(
                    resp,
                    "Quiz listed successfully",
                    res
                  );
                })
              } else {
                responsehandler.getSuccessResult(
                  updatedResult,
                  "Quiz listed successfully",
                  res
                );
              }
            });
          } else {
            responsehandler.getSuccessResult(
              updatedData,
              "Quiz listed successfully",
              res
            );
          }
        }
      }
    }).catch(function (error) {
      let errorMessage = Utils.constructErrorMessage(error);
      if (errorMessage == 'quizName must be unique,\nresortId must be unique') {
        errorMessage = "Quiz name must be unique";
      }
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  questionUpdate(req, res) {
    let Data = Utils.getReqValues(req);
    Model.Question.findOne({
      where: {
        questionId: Data.questionId
      }
    })
      .then(questions => {
        if (!questions) {
          return res.status(404).send({
            message: "Question Not Found"
          });
        }
        Model.Question.update(Data, { where: { questionId: Data.questionId } })
          .then(result => {
            if (Data.quizId) {
              let quizCond = {};
              quizCond['quizId'] = Data.quizId;
              let quizUpdate = {};
              quizUpdate['quizName'] = Data.quizName;
              Model.Quiz.update(quizUpdate, { where: quizCond }).then(function (quizRes) {
                return responsehandler.getSuccessResult(
                  result,
                  "Quiz updated successfully",
                  res
                );
              }).catch(function (error) {
                let errorMessage = Utils.constructErrorMessage(error);
                if (errorMessage == 'quizName must be unique,\nresortId must be unique') {
                  errorMessage = "Quiz name must be unique";
                }
                return responsehandler.getErrorResult(errorMessage, res);
              });
            } else {
              return responsehandler.getSuccessResult(
                result,
                "Quiz updated successfully",
                res
              );
            }
          })
          .catch(error => {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          });
      })
      .catch(error => {
        return responsehandler.getErrorResult(error, res);
      });
  },
  quizDelete(req, res) {
    let Data = Utils.getReqValues(req);
    return Model.Question.findOne({ where: { questionId: Data.questionId } })
      .then(question => {
        if (!question) {
          return res.status(400).send({
            message: "Question Not Found"
          });
        }
        return Model.Question.destroy({ where: { questionId: Data.questionId } })
          .then(() =>
            res
              .status(200)
              .send({ isSuccess: true, message: "Quiz deleted successfully" })
          )
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  add(req, res) {
    let userInput = Utils.getReqValues(req);
    if (!userInput.trainingClassName) {
      const errorMessage = "Training Class Name is mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    } else if (!userInput.files && isArray(userInput.files)) {
      const errorMessage = "Training files are mandatory";
      return responsehandler.getErrorResult(errorMessage, res);
    }
    userInput.trainingClassName = userInput.trainingClassName.trim();
    let trainingClass = { trainingClassName: userInput.trainingClassName, createdBy: userInput.createdBy, 'resortId': userInput.resortId, 'draft': userInput.draft };
    let files = userInput.files;
    let quizQuestions = (userInput.quizQuestions) ? userInput.quizQuestions : [];
    let responses = {};
    let quiz = {};
    let saveAllFileIds = [];
    let insertFiles = [];
    userInput.files.forEach(function (item, key) {
      item.draft = (userInput.draft) ? userInput.draft : false;
      if (item.fileId) {
        saveAllFileIds.push(item.fileId);
      } else {
        insertFiles.push(item);
      }
    });
    userInput.resourseFiles = saveAllFileIds;
    return Model.sequelize
      .transaction(function (t) {
        return Model.TrainingClass.create(trainingClass, t)
          .then(trainingClass => {
            responses["trainingClass"] = trainingClass;
            let trainingClassId = trainingClass.dataValues.trainingClassId;
            let trainingClassName = trainingClass.dataValues.trainingClassName;
            files.forEach(function (val, key) {
              files[key]['createdBy'] = userInput.createdBy;
              files[key]['resortId'] = userInput.resortId;
            });
            let resourcefileMap = [];
            if (userInput.resourseFiles) {
              userInput.resourseFiles.forEach(function (val, key) {
                let newObj = {};
                newObj['fileId'] = val;
                newObj['trainingClassId'] = trainingClassId;
                resourcefileMap.push(newObj);
              });
            }
            return Model.File.bulkCreate(insertFiles, { individualHooks: true }, t).then(filesRes => {
              responses["files"] = filesRes;
              let arraySet = [];
              filesRes.forEach((value, key) => {
                let Obj = {};
                Obj['fileId'] = value.dataValues.fileId;
                Obj["trainingClassId"] = trainingClassId;
                arraySet.push(Obj);
              });
              arraySet = arraySet.concat(resourcefileMap);
              return Model.FileMapping.bulkCreate(arraySet, { individualHooks: true }, t).then(function (fileMapRes) {
                responses['fileMap'] = fileMapRes;
                if (quizQuestions && quizQuestions.length > 0) {
                  let questionArray = [{ 'trainingClassId': trainingClassId }];
                  quiz.quizName = userInput.quizName;
                  quiz.createdBy = userInput.createdBy;
                  quiz.resortId = userInput.resortId;
                  quiz.QuizMappings = questionArray;
                  return Model.Quiz.create(quiz, { include: [{ model: Model.QuizMapping }] }).then(function (quizs) {
                    let quizqstn = userInput.quizQuestions;
                    quizqstn.forEach(function (val, key) {
                      val.quizId = quizs.dataValues.quizId;
                    });
                    return Model.Question.bulkCreate(quizqstn, { returning: true }, t).then(questionsRes => {
                      responses["quizQuestions"] = questionsRes;
                      let traing = { 'trainingClassId': trainingClassId, 'trainingClassName': trainingClassName };
                      return { 'trainingClass': traing, 'quizs': quizs };
                    });
                  });
                }
                else if (userInput.quizId) {
                  let whereConditions = {};
                  whereConditions['quizId'] = userInput.quizId;
                  let questionArraySec = [];
                  return Model.QuizMapping.findAll({ where: whereConditions }, t).then(function (quizResponse) {
                    if(quizResponse && quizResponse.length > 0){
                      quizResponse.forEach(function (value, key) {
                        let obj = {};
                        obj.quizId = userInput.quizId;
                        obj.trainingClassId = trainingClassId;
                        questionArraySec.push(obj);
                      });
                    }else{
                       let obj = {};
                        obj.quizId = userInput.quizId;
                        obj.trainingClassId = trainingClassId;
                        questionArraySec.push(obj);
                    }
                    return Model.QuizMapping.bulkCreate(questionArraySec, { individualHooks: true }, t).then(function (response) {
                      let traing = { 'trainingClassId': trainingClassId, 'trainingClassName': trainingClassName };
                      return { 'trainingClass': traing, 'quizs': response };
                    });
                  });
                }
                else {
                  let traing = { 'trainingClassId': trainingClassId, 'trainingClassName': trainingClassName };
                  return { 'trainingClass': traing };
                }
              });
            });
          })
      }).then(function (responseSet) {
        responsehandler.getSuccessResult(
          responseSet,
          "Training classes saved successfully",
          res
        );
      })
      .catch(function (error) {
        var errorMessage = Utils.constructErrorMessage(error);
        if (errorMessage == 'trainingClassName must be unique,\nresortId must be unique') {
          errorMessage = "Training class name must be unique";
        }
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },
  async updateTrainingClass(req, res) {
    let userInput = Utils.getReqValues(req);
    let updatedData = [];
    let newData = [];
    let saveAllFileIds = [];
    let newFileDetails = [];
    let newquizDetails = [];
    var insertQuestions = userInput.quizQuestions;

    let checkScheduledItems = await Utils.checkScheduledItems(userInput, Model);

    if (checkScheduledItems.status === true) {
      let errorMessage;
      errorMessage = "The class is already scheduled to few users and is in progress. You cannot make any changes to an ongoing class/course";
      return responsehandler.getErrorResult(errorMessage, res);
    } else {
      // Files data insert | update
      if (userInput.files) {
        userInput.files.forEach(function (item, key) {
          item.draft = (userInput.draft) ? userInput.draft : false;
          item.table = "File";
          if (!item.fileId) {
            item.createdBy = userInput.createdBy;
            item.resortId = userInput.resortId;
            newFileDetails.push(item);
          } else {
            saveAllFileIds.push(item.fileId);
            // order update set 
            if (item.File && item.File.order) {
              item.order = item.File.order;
            }
            // order update set 
            updatedData.push(item);
          }
        });
        newData.push({ table: "File", details: newFileDetails });
      }

      // RL find already present file ids
      let whereFileCondn = {};
      whereFileCondn['trainingClassId'] = userInput.trainingClassId;
      Model.FileMapping.findAll({ where: whereFileCondn }).then(function (existFileMap) {
        let existArray = [];
        if (existFileMap) {
          existFileMap.forEach(function (val, key) {
            existArray.push(val.dataValues.fileId);
          });
          let diff = _.difference(saveAllFileIds, existArray);
          userInput.resourseFiles = diff;
        }
      });
      // Quiz data insert | update
      if (userInput.quizQuestions && userInput.quiz && userInput.quiz.quizId) {
        userInput.quizQuestions.forEach(function (item, key) {
          item.quizId = userInput.quiz.quizId;
          item.table = "Question";
          if (!item.questionId) {
            newquizDetails.push(item);
          } else {
            updatedData.push(item);
          }
        });
        var questionIds2 = L.map(updatedData, 'questionId');
        newData.push({ table: "Question", details: newquizDetails });
      }
      let alldatas = await Utils.getAllReporters(userInput, Model);
      let reporter;

      if (alldatas.status === true) {
        reporter = alldatas.data;
      }
      let userIds = [reporter, userInput.createdBy, userInput.approverId];
      userIds = _.compact(userIds);

      let createdCondn = {};
      createdCondn['createdBy'] = { $in: userIds };
      createdCondn['trainingClassId'] = userInput.trainingClassId;
      // Model.TrainingClass.findOne({ where: createdCondn }).then(function (resultTrainingClass) {
      //   if (resultTrainingClass) {
      Model.TrainingClass.findOne({
        where: { trainingClassId: userInput.trainingClassId }
      }).then(availableTraining => {
        if (availableTraining) {
          return Model.sequelize
            .transaction(function (t) {
              return Model.TrainingClass.update(userInput, {
                where: { trainingClassId: userInput.trainingClassId },
                transaction: t
              }).then(updatedTraining => {

                return Model.Sequelize.Promise.map(updatedData, function (
                  itemToUpdate) {

                  let Id = L.camelCase(itemToUpdate.table) + "Id";
                  let conditions = {};
                  conditions[Id] = itemToUpdate[Id];
                  return Model[itemToUpdate.table].update(itemToUpdate, {
                    where: conditions,
                    transaction: t
                  });
                }).then(function (updatedResult) {

                  let ques;
                  let questionArray = [];
                  return Model.Sequelize.Promise.map(newData, function (
                    itemToAdd
                  ) {
                    return Model[itemToAdd.table].bulkCreate(
                      itemToAdd.details, { returning: true },
                      { transaction: t }
                    ).then(function (responsee) {
                      if (itemToAdd.table == 'Question') {
                        let questionIds1 = L.map(responsee, 'questionId');
                        if (questionIds1) {
                          questionIds1.forEach(function (value) {
                            let obj = {};
                            obj.questionId = value;
                            obj.quizId = userInput.quiz.quizId;
                            obj.trainingClassId = userInput.trainingClassId;
                            questionArray.push(obj);
                          });
                        }
                        ques = L.uniqBy(questionArray, 'questionId');
                      }
                      if (itemToAdd.table == 'File') {
                        let filearray = [];
                        let fileIds = L.map(responsee, 'fileId');
                        if (userInput.resourseFiles) {
                          fileIds = fileIds.concat(userInput.resourseFiles);
                        }
                        if (fileIds) {
                          fileIds.forEach(function (value) {
                            let obj = {};
                            obj.fileId = value;
                            obj.trainingClassId = userInput.trainingClassId;
                            filearray.push(obj);
                          });
                          Model.FileMapping.bulkCreate(filearray).then(function (sd) {
                          });
                        }
                      }
                    })
                  }).then(function (addedResult) {
                    var trainingClassCodn = { 'trainingClassId': userInput.trainingClassId };
                    if (questionIds2) {
                      questionIds2.forEach(function (value) {
                        let obj = {};
                        obj.questionId = value;
                        obj.quizId = userInput.quiz.quizId;
                        obj.trainingClassId = userInput.trainingClassId;
                        questionArray.push(obj);
                      });
                    }
                    if (userInput.noQuiz === 1) {
                      // No Quiz
                      Model.QuizMapping.destroy({ where: trainingClassCodn });
                    }
                    else if (userInput.quizId) {
                      // Existing Quiz
                      var quizMapSave = { 'quizId': userInput.quizId, 'trainingClassId': userInput.trainingClassId };
                      Model.QuizMapping.findOne({ where: trainingClassCodn }).then(function (quizMapRes) {
                        if (quizMapRes) {
                          Model.QuizMapping.destroy({ where: trainingClassCodn }).then(function (delRes) {

                          });
                        } else {
                          Model.QuizMapping.create(quizMapSave).then(function (saveRes) {
                            return saveRes;
                          });
                        }
                      });
                    }
                    else if (userInput.quizName) {
                      let quiz = {};
                      quiz.quizName = userInput.quizName;
                      quiz.quizName = quiz.quizName.trim();
                      let ques1 = L.uniqBy(questionArray, 'questionId');
                      var result = L.unionBy(ques1, ques, "questionId");
                      if (userInput.quiz && userInput.quiz.quizId) {
                        // Update Quiz Sections
                        return Model.Quiz.update(quiz, { where: { quizId: userInput.quiz.quizId } }, { transaction: t }).then(function (quizs) {
                          return quizs;
                        });
                      } else {
                        // Insert New Quiz and Map TC 
                        let questionArray = [{ 'trainingClassId': userInput.trainingClassId }];
                        quiz.quizName = userInput.quizName;
                        quiz.quizName = quiz.quizName.trim();
                        quiz.createdBy = userInput.createdBy;
                        quiz.resortId = userInput.resortId;
                        quiz.QuizMappings = questionArray;
                        return Model.QuizMapping.findOne({ where: trainingClassCodn }, { transaction: t }).then(function (checkQuiz) {
                          if (checkQuiz) {
                            let quizId = checkQuiz.dataValues.quizId;
                            let quizCondn = { 'quizId': quizId };
                            // delete already added quiz materials
                            return Model.Question.destroy({ where: quizCondn }, { transaction: t }).then(function (questDel) {
                              return Model.Quiz.destroy({ where: quizCondn }, { transaction: t }).then(function (quizDel) {
                                return Model.QuizMapping.destroy({ where: quizCondn }, { transaction: t }).then(function (quizMapDel) {

                                  // insert Quiz materials
                                  Model.Quiz.create(quiz, { include: [{ model: Model.QuizMapping }] }).then(function (quizs) {

                                    let quizqstnSet = insertQuestions;
                                    let newSetQuiz = [];
                                    quizqstnSet.forEach(function (val, key) {
                                      let obj = {};
                                      obj = _.omit(val, ['table']);
                                      obj.quizId = quizs.dataValues.quizId;
                                      newSetQuiz.push(obj);
                                    });

                                    Model.Question.bulkCreate(newSetQuiz, { returning: true }).then(questionsRes => {
                                      return questionsRes;
                                    });
                                  }).catch(function (error) {

                                    return error;
                                  });
                                });

                              });
                            });
                          } else {

                            Model.Quiz.create(quiz, { include: [{ model: Model.QuizMapping }] }).then(function (quizs) {

                              let quizqstnSet = insertQuestions;
                              let newSetQuiz = [];
                              quizqstnSet.forEach(function (val, key) {
                                let obj = {};
                                obj = _.omit(val, ['table']);
                                obj.quizId = quizs.dataValues.quizId;
                                newSetQuiz.push(obj);
                              });

                              Model.Question.bulkCreate(newSetQuiz, { returning: true }).then(questionsRes => {
                                return questionsRes;
                              });
                            }).catch(function (error) {

                              return error;
                            });
                          }
                        });
                      }
                    }
                    else {

                      return addedResult;
                    }
                  });
                });
              }).catch(function (error) {

                return error;
              });
            })
            .then(
              function (updatedTrainingDetail) {
                if (userInput.fileIds) {
                  Model.FileMapping.destroy({ where: { fileId: userInput.fileIds } }).then(
                    function (files) {
                    }
                  );
                }
                if (userInput.questionIds) {
                  if (userInput.questionIds.length > 0) {
                    Model.Question.destroy({
                      where: { questionId: userInput.questionIds }
                    }).then(function (questions) {
                    });
                  }
                }
                responsehandler.getSuccessResult(
                  updatedTrainingDetail,
                  constant.labels.trainingClassUpdate,
                  res
                );
              },
              function (err) {
                let errorMessage =
                  err && err.errors ? Utils.constructErrorMessage(err) : err;
                return responsehandler.getErrorResult(errorMessage, res);
              }
            )
            .catch(function (err) {
              let errorMessage =
                err && err.errors ? Utils.constructErrorMessage(err) : err;

              if (errorMessage == 'trainingClassName must be unique,\nresortId must be unique') {
                errorMessage = "Training class name must be unique";
              }

              return responsehandler.getErrorResult(errorMessage, res);
            });
        } else {
          responsehandler.getNotExistsResult(
            constant.labels.noTrainingClass,
            res
          );
        }
      })
        .catch(function (error) {
          let errorMessage = error && error.errors ? Utils.constructErrorMessage(error) : error;
          if (errorMessage == 'trainingClassName must be unique,\nresortId must be unique') {
            errorMessage = "Training class name must be unique";
          }
          responsehandler.getErrorResult(errorMessage, res);
        });
      // } else {
      //   let errorResponse = {};
      //   errorResponse['statusKey'] = true;
      //   errorResponse['message'] = "Training class is owned by another user.You cannot able to edit.Please add as New Training Class Name";
      //   return responsehandler.getErrorResult(errorResponse, res);
      // }
      // });
    }
  },
  async fileList(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    let courseCondn = {};
    let whereConditions = {};
    let andCondn = {};
    let departUsers = [];
    let divUsers = [];
    //Parent Child all files based on resort id
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }

    // File Permission Restrictionss
    //Paginations 
    let limit, page, offset;
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    // Particular Course / TC Files
    if (userInput.trainingClassId) {
      courseCondn["trainingClassId"] = userInput.trainingClassId;
    }
    if (userInput.courseId) {
      courseCondn["courseId"] = userInput.courseId;
    }
    if (userInput.fileType) {
      conditions["fileType"] = userInput.fileType;
      andCondn["fileType"] = userInput.fileType;
    }
    if (userInput.createdBy && departUsers.length > 0) {
      andCondn['createdBy'] = { $in: departUsers };
    }
    else if (userInput.createdBy && divUsers.length > 0) {
      andCondn['createdBy'] = { $in: divUsers };
    }
    else if (userInput.createdBy) {
      andCondn['createdBy'] = userInput.createdBy;
    } else if (userInput.subResortId) {
      andCondn["resortId"] = userInput.subResortId;
    } else if (resorts.length > 0 && userInput.resortId) {
      andCondn['resortId'] = { $in: resorts };
    }

    if (userInput.draft === 'true') {
      andCondn['draft'] = true;
    } else if (userInput.draft === 'false') {
      andCondn['draft'] = false;
    } else {
      andCondn['draft'] = false;
    }

    if (userInput.allDrafts === '1') {
      andCondn['draft'] = { $in: [true, false] };
    }

    // let isReq = false;
    // if (userInput.parentResortId) {
    //   isReq = true;
    //   whereConditions["parentId"] = userInput.parentResortId;
    // }
    // if (userInput.subResortId) {
    //   isReq = true;
    //   whereConditions["resortId"] = userInput.subResortId;
    //   andCondn['resortId'] = userInput.subResortId;
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
    let searchCondn = [];
    let orCondition = [];
    if (userInput.search) {
      let search = userInput.search;
      searchCondn = [
        {
          fileName: {
            $iLike: "%" + (search ? search : "") + "%"
          }
        },
        {
          fileDescription: {
            $iLike: "%" + (search ? search : "") + "%"
          }
        },
        {
          fileLength: {
            $iLike: "%" + (search ? search : "") + "%"
          }
        },
        {
          fileSize: {
            $iLike: "%" + (search ? search : "") + "%"
          }
        }
      ];
    } else {
      searchCondn = [];
    }

    // console.log("userInput.userId");
    // console.log(userInput.userId);
    // console.log("userInput.userId");

    //  File Permission Restrictions
    let fileRestrictions = await Utils.getFileRestrictions(userInput, Model);
   // console.log(fileRestrictions);
    if (fileRestrictions.status === true) {
      let files = fileRestrictions.data;
      console.log("files");
      console.log(files);
      console.log("files");
      if (files.length > 0) {
        let fileSets = [];
        files.forEach(function (val, key) {
          fileSets.push(val.dataValues.fileId);
        });
        if (userInput.userId) {
          orCondition = [
            {
              fileId: { $notIn: fileSets }
            },
            {
              createdBy: userInput.userId
            }
          ];
        }else{
          orCondition = [
            {
              fileId: { $notIn: fileSets }
            }
          ]

        }
      }
    }
    if (searchCondn.length > 0 && orCondition.length > 0) {
      orCondition = orCondition.concat(searchCondn);
    }
    else if (searchCondn.length > 0 && userInput.search) {
      orCondition = searchCondn;
    }
    if (orCondition.length > 0) {
      conditions = {
        $or: orCondition,
        $and: andCondn
      };
    } else {
      conditions = andCondn;
    }
    let required = true;
    Model.TrainingScheduleResorts.findAll({ where: whereConditions }).then(function (allSchedules) {

      let courseIds = [];
      let trainingClassIds = [];
      if (allSchedules) {
        allSchedules.forEach(function (val, key) {
          courseIds.push(val.dataValues.courseId);
          trainingClassIds.push(val.dataValues.trainingClassId);
        });
      }
      if (userInput.courseId) {
        courseCondn['courseId'] = userInput.courseId;
        required = true;
      }
      else if (userInput.trainingClassId) {
        courseCondn['trainingClassId'] = userInput.trainingClassId;
        required = true;
      }
      else if (courseIds.length > 0 && (userInput.divisionId || userInput.departmentId)) {
        courseCondn['courseId'] = { $in: courseIds };
      } else if (trainingClassIds.length > 0 && (userInput.divisionId || userInput.departmentId)) {
        courseCondn['trainingClassId'] = { $in: trainingClassIds };
      }

      console.log("conditions",conditions);
      let uploadPaths = Utils.uploadFilePaths();
      Model.File.findAndCountAll({
        where: conditions,
        include: [{
          model: Model.FileMapping,
          where: courseCondn,
          include: [
            {
              model: Model.TrainingClass,
              attributes: ["trainingClassId", "trainingClassName"],
              required: false,
            }, {
              model: Model.Course,
              attributes: ['courseId', 'courseName'],
              required: false,
            }
          ],
          required: required
        }, {
          model: Model.FilePermission,
          attributes: ['userId', 'filePermissionType'],
        }],
        distinct: true,
        order: [["fileId", "DESC"]],
        limit: limit,
        offset: offset,
      }).then(result => {
        if (result) {
          result["uploadPaths"] = uploadPaths;
          return responsehandler.getSuccessResult(
            result,
            "Files listed successfuly",
            res
          );
        } else {
          return responsehandler.getNotExistsResult(result, res);
        }
      })
        .catch(function (error) {
          let errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    });
  },
  async TrainingFileList(req, res) {
    let userInput = Utils.getReqValues(req);
    let condition = {};
    let userCondn = {};
    let scheduleCondn = {};
    let limit, offset, page;
    let feedbackCondn = {};
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    let requ = false;
    if (userInput.courseId) {
      condition['courseId'] = userInput.courseId;
      feedbackCondn['courseId'] = userInput.courseId;
      requ = true;
    }
    if (userInput.trainingScheduleId) {
      scheduleCondn['trainingScheduleId'] = userInput.trainingScheduleId;
    }
    if (userInput.resortId) {
      userCondn['resortId'] = userInput.resortId;
      feedbackCondn['resortId'] = userInput.resortId;
    }
    if (userInput.userId) {
      userCondn['userId'] = userInput.userId;
      feedbackCondn['userId'] = userInput.userId;
    }
    let uploadPaths = Utils.uploadFilePaths();
    let orderBy;
    if (userInput.type === 'mobile') {
      orderBy = [[Model.FeedbackMapping, 'feedbackMappingId', 'DESC']];
    } else {
      orderBy = [["created", "DESC"]];
    }
    Model.TrainingClass.findAndCountAll({
      attributes: ['trainingClassId', 'trainingClassName', 'created'],
      include: [{
        model: Model.CourseTrainingClassMap,
        attributes: ['courseId', 'trainingClassId'],
        where: condition,
        include:
          [{
            model: Model.Course,
            attributes: ['courseId', 'courseName'],
            include: [{
              model: Model.TrainingScheduleCourses,
              required: false,
              where: scheduleCondn,
              include: [{
                model: Model.TrainingSchedule,
                attributes: ['assignedDate']
              }]
            }]
          }]
      },
      {
        model: Model.FeedbackMapping,
        where: feedbackCondn,
        required: false,
      }
      ],
      order: orderBy,
      limit: limit,
      offset: offset,
    }).then(function (response) {
      response["uploadPaths"] = uploadPaths;
      responsehandler.getSuccessResult(
        response,
        "Training classes and files listed successfully",
        res
      );
    }).catch(function (error) {
      let errorMessage = Utils.constructErrorMessage(error);
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  classFilesList(req, res) {
    let classCondn = {};
    let feedbackCondn = {};
    let userInput = Utils.getReqValues(req);
    let scheduleCondn = {};
    if (userInput.trainingClassId) {
      classCondn['trainingClassId'] = userInput.trainingClassId;
      feedbackCondn['trainingClassId'] = userInput.trainingClassId;
    }
    if (userInput.userId) {
      feedbackCondn['userId'] = userInput.userId;
    }
    if (userInput.trainingScheduleId) {
      scheduleCondn['trainingClassId'] = userInput.trainingClassId;
      scheduleCondn['trainingScheduleId'] = userInput.trainingScheduleId;
    }
    let orderBy;
    if (userInput.type === 'mobile') {
      orderBy = [[Model.File, 'order', 'ASC']];
    }
    let uploadPaths = Utils.uploadFilePaths();
    Model.FileMapping.findAll({
      where: classCondn,
      attributes: ['trainingClassId'],
      include: [{ model: Model.File }, { model: Model.TrainingClass, attributes: ['trainingClassName'] }],
      group: ['FileMapping.trainingClassId', 'File.fileId', 'TrainingClass.trainingClassId'],
      order: orderBy
    }).then(function (classRes) {
      let response = {};
      response['file'] = classRes;
      Model.QuizMapping.findAll({ where: classCondn, attributes: ['quizId'] }).then(function (quizRes) {
        response["quiz"] = quizRes;
        response["uploadPaths"] = uploadPaths;
        Model.TrainingScheduleCourses.findAll({ where: scheduleCondn, attributes: ['trainingClassId', 'passPercentage'] }).then(function (scheduleClasses) {
          response['schedulePercentage'] = scheduleClasses;
          Model.FeedbackMapping.findAll({ where: feedbackCondn, attributes: ['status', 'userId', 'trainingClassId', 'passPercentage'], order: [['created', 'DESC']] }).then(function (feedbackRes) {
            response['feedback'] = feedbackRes;
            responsehandler.getSuccessResult(
              response,
              "Training class - files listed successfully",
              res
            );
          });
        });
      });
    }).catch(function (error) {
      let errorMessage = Utils.constructErrorMessage(error);
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  async fileDelete(req, res) {
    let userInput = Utils.getReqValues(req);
    let courseAssigned = await Utils.checkCourseAssigned(userInput, Model);
    let fileScheduled  = await Utils.checkFileScheduled(userInput, Model);

    // console.log("courseAssigned");
    // console.log(courseAssigned);
    // console.log("courseAssigned");

    // console.log(fileScheduled);

    // return false;

    if (courseAssigned.status === true) 
    {
      if (fileScheduled.status === true)
      {
        let errorMessage;
        errorMessage = "The file is already scheduled to few users and is in progress. You are not able to delete the file which affects an ongoing class/course.";
        return responsehandler.getErrorResult(errorMessage, res);
      }
      else {
        if (userInput.fileId) {
          let response = async.waterfall(
            [
              function (callback) {
                Model.File.findOne({
                  where: {
                    fileId: userInput.fileId
                  }
                }).then(resp => {
                  if (resp) {
                    const path = "./uploads/" + resp.fileUrl;
                    fs.unlink(path, err => {
                      if (err) {
                        console.error(err);
                      }
                      callback(null, "success");
                    });
                  }
                });
              },
              function (sucsess, callback) {
                Model.File.destroy({ where: { fileId: userInput.fileId } }).then(function (
                  divisions
                ) {
                  callback(null, divisions);
                });
              }
            ],
            function (err, divisions) {
              return responsehandler.getSuccessResult(
                divisions,
                "File deleted successfully",
                res
              );
            }
          );
        } else {
          return responsehandler.getErrorResult("file Id is mandatory", res);
        }
      }
    } else {
      let errorMessage;
      errorMessage = "The file is already assigned to few courses and classes. You are not able to delete the file which affects an assigned class/course.";
      return responsehandler.getErrorResult(errorMessage, res);
    }
  },
  trainingClassUpdateByName(req, res) {
    let Data = Utils.getReqValues(req);
    Model.TrainingClass.findOne({
      where: {
        trainingClassId: Data.trainingClassId
      }
    })
      .then(trainigs => {
        if (!trainigs) {
          return res.status(404).send({
            message: "Training class Not Found"
          });
        }
        Model.TrainingClass.update(Data, {
          where: { trainingClassId: Data.trainingClassId }
        })
          .then(result => {
            return responsehandler.getUpdateResult(result, res);
          })
          .catch(error => {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          });
      })
      .catch(error => {
        return responsehandler.getErrorResult(error, res);
      });
  },
  filePermissionAdd(req, res) {
    let Data = Utils.getReqValues(req);
    let divisionData = Data.divisionId;
    let resortId = Data.resortId;
    let departmentData = Data.departmentId;
    let employeedata = Data.employeeId;
    let resortArray = [];
    let newArray = [];
    let fileCodn = {};
    fileCodn['fileId'] = Data.fileId;
    Model.FilePermission.destroy({ where: fileCodn }).then(async function (deleteRes) {
      divisionData.forEach(function (value) {
        departmentData.forEach(function (val) {
          let reqobj = {};
          reqobj.divisionId = value;
          reqobj.departmentId = val;
          resortArray.push(reqobj);
        });
      });
      resortArray.map(element => {
        return (element.resortId = Data.resortId, element.fileId = Data.fileId);
      });
      resortArray.forEach(function (val) {
        employeedata.forEach(function (value) {
          let respobj;
          let obj = {
            divisionId: val.divisionId,
            departmentId: val.departmentId,
            resortId: val.resortId,
            fileId: val.fileId,
            userId: value
          };
          if (Data.filePermissionType) {
            obj.filePermissionType = Data.filePermissionType;
            respobj = obj;
          } else {
            respobj = obj;
          }
          newArray.push(respobj)
        });
      });
      let response = await Model.FilePermission.bulkCreate(newArray, { returning: true }).then((response) => {
        responsehandler.getSuccessResult(
          response,
          "File permission added successfully",
          res
        );
      }).catch(error => {
        let errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });
    });
  },
  async getTrainingClassList(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    let andCondn = {};
    let courseCondn = {};
    let whereConditions = {};
    let reqqqq = false;
    let limit, page, offset;
    let departUsers = [];
    let divUsers = [];
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    if (userInput.courseId) {
      courseCondn['courseId'] = userInput.courseId;
      reqqqq = true;
    }
    if (userInput.trainingClassId) {
      andCondn['trainingClassId'] = userInput.trainingClassId;
    }
    if (userInput.departmentId) {
      let departData = await Utils.getParticularDepartUsers(userInput, Model);
      if (departData.status === true) {
        departUsers = departData.data;
        andCondn['createdBy'] = { $in: departUsers };
      }
    } else if (userInput.divisionId) {
      let divData = await Utils.getParticularDivUsers(userInput, Model);
      if (divData.status === true) {
        divUsers = divData.data;
        andCondn['createdBy'] = { $in: divUsers };
      }
    }

    //Parent Child Differences 
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }
    if (userInput.draft === 'true') {
      andCondn['draft'] = true;
    } else if (userInput.draft === 'false') {
      andCondn['draft'] = false;
    } else {
      andCondn['draft'] = false;
    }
    if (userInput.allDrafts === '1') {
      andCondn['draft'] = { $in: [true, false] };
    }

    if (userInput.createdBy && departUsers.length > 0) {
      andCondn['createdBy'] = { $in: departUsers };
    }
    else if (userInput.createdBy && divUsers.length > 0) {
      andCondn['createdBy'] = { $in: divUsers };
    }
    else if (userInput.createdBy) {
      andCondn['createdBy'] = userInput.createdBy;
    }
    else if (userInput.subResortId) {
      andCondn['resortId'] = userInput.subResortId;
    } else {
      andCondn['resortId'] = { $in: resorts };
    }
    andCondn['isDeleted'] = false;

    console.log(andCondn);

    if (userInput.search) {
      let search = userInput.search;
      conditions = {
        $or: [
          {
            trainingClassName: {
              $iLike: "%" + (search ? search : "") + "%"
            }
          }
        ],
        $and: andCondn
      };
    } else {
      conditions = andCondn;
    }
    Model.TrainingClass.findAndCountAll({
      where: conditions,
      include: [
        {
          model: Model.CourseTrainingClassMap,
          where: courseCondn,
          attributes: [],
          required: reqqqq,
          include: [{
            model: Model.Course,
            attributes: [],
            required: false,
            include: [
              {
                model: Model.TrainingScheduleResorts,
                attributes: [],
                where: whereConditions
              },
            ]
          }]
        },
        {
          model: Model.User,
          attributes: ["userName", 'firstName', 'lastName'],
          as: "createdByDetails",
          required: false
        }
      ],
      limit: limit,
      offset: offset,
      distinct: true,
      subQuery: false,
      group: ['TrainingClass.trainingClassId', 'createdByDetails.userId'],
      order: [["created", "DESC"]],
    }).then(function (resp) {
      resp.count = resp.count.length;
      responsehandler.getSuccessResult(
        resp,
        "Training class listed successfully",
        res
      );
    }).catch(error => {
      let errorMessage = Utils.constructErrorMessage(error);
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  filePermissionList(req, res) {
    let userInput = Utils.getReqValues(req);
    let whereConditions = {};
    if (userInput.fileId) {
      whereConditions['fileId'] = userInput.fileId;
    }
    let limit, page, offset;
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    Model.FilePermission.findAndCountAll({
      where: whereConditions,
      include: [
        { model: Model.User, attributes: ['userId', 'userName', 'firstName', 'lastName'] },
        { model: Model.Division, attributes: ['divisionId', 'divisionName'] },
        { model: Model.Department, attributes: ['departmentId', 'departmentName'] }
      ],
      limit: limit,
      offset: offset
    }).then(function (filePermission) {
      responsehandler.getSuccessResult(
        filePermission,
        "File permission listed successfully",
        res
      );
    });
  },
  async trainingClasses(req, res) {
    let userInput = Utils.getReqValues(req);
    let childResortIds = await Utils.getChildResorts(userInput, Model);
    let resorts = [];
    if (childResortIds.status === true) {
      resorts = childResortIds.data;
      resorts.push(userInput.resortId);
    } else {
      resorts.push(userInput.resortId);
    }
    let resortCodn = {};
    if (resorts && userInput.resortId) {
      resortCodn['resortId'] = { $in: resorts };
    }
    async.waterfall([
      function (done) {
        Model.ResortUserMapping.findAll({ where: resortCodn, attributes: ['resortId', 'userId'] }).then(function (resortUsers) {
          done(null, resortUsers);
        })
      },
      function (resortUsers, done) {
        let users = [];
        if (resortUsers) {
          resortUsers.forEach(function (value, key) {
            users.push(value.dataValues.userId);
          });
          let whereConditions = {};
          whereConditions['createdBy'] = { $in: users };
          //whereConditions['draft'] = false;
          whereConditions['isDeleted'] = false;
          Model.TrainingClass.findAndCountAll({
            attributes: ['trainingClassId', 'trainingClassName', 'createdBy'],
            where: whereConditions,
            order: [['trainingClassName', 'ASC']]
          }).then(function (classes) {
            done(null, classes);
          });
        } else {
          done(null, users);
        }
      }
    ], function (err, response) {
      if (err) throw new Error(err);
      responsehandler.getSuccessResult(response, "Classes listed successfully", res);
    });
  },
  trainingClassDelete(req, res) {
    let Data = Utils.getReqValues(req);
    let conditions = {};
    if (Data.trainingClassId) {
      conditions['trainingClassId'] = Data.trainingClassId;
    }
    let itemToUpdate;
    let message;
    if (Data.deleteUndo) {
      itemToUpdate = {
        isDeleted: false
      }
      message = 'Class deleted status undo successfully';
    } else {
      itemToUpdate = {
        isDeleted: true
      }
      message = 'Class deleted successfully';
    }
    Model.TrainingScheduleResorts.findAll({ where: conditions }).then(function (response) {
      if (response.length === 0 || Data.deleteUndo) {
        return Model.TrainingClass
          .findOne({ where: { trainingClassId: Data.trainingClassId } })
          .then(classes => {
            if (!classes) {
              return res.status(400).send({
                "isSucess": false,
                message: 'Class Not Found',
              });
            }
            Model.CourseTrainingClassMap.findOne({ where: conditions }).then(function (courseClass) {
              if (courseClass && courseClass.length) {
                return responsehandler.getErrorResult("The class is already attached in few courses . You cannot do direct delete of class", res);
              } else {


                Model.TrainingClass.update(itemToUpdate, {
                  where: conditions,
                },
                ).then(function (updated) {
                  Model.CourseTrainingClassMap.update(itemToUpdate, { where: conditions }).then(function (upadteds) {
                    Model.TrainingScheduleCourses.update(itemToUpdate, { where: conditions }).then(function (trainingscheduleupdate) {
                      Model.TrainingScheduleFiles.update(itemToUpdate, { where: conditions }).then(function (sdsf) {
                        //Model.Notification.update(itemToUpdate, { where: conditions }).then(function (notify) {
                        Model.NotificationFileMap.update(itemToUpdate, { where: conditions }).then(function (files) {
                          Model.TrainingScheduleResorts.update(itemToUpdate, { where: conditions }).then(function (sdsdfsdff) {
                            Model.FeedbackMapping.update(itemToUpdate, { where: conditions }).then(function (dadfdfs) {
                              res.status(200).send({ "isSuccess": true, message: message });
                            })
                          });
                        })
                        // })
                      })
                    })
                  })
                });
              }

            });
          })
      } else {
        return responsehandler.getErrorResult("The class is already scheduled to few users and is in progress. You cannot make any changes to an ongoing course", res);
      }
    });
  }
};
