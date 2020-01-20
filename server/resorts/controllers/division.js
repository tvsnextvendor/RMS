const Division = require('../models').Division;
const Department = require('../models').Department;
var Utils = require('./../utils/Utils');
var responsehandler = require('./../utils/responseHandler');
const ResortMapping = require('../models').ResortMapping;
const Model = require('../models/');
const _ = require('lodash');
module.exports = {
  list(req, res) {
    var userInput = Utils.getReqValues(req);
    var conditions = {};
    if (userInput.divisionId) {
      conditions['divisionId'] = userInput.divisionId;
    }
    if (userInput.page && userInput.size) {
      var limit = userInput.size;
      var page = userInput.page ? userInput.page : 1;
      var offset = (page - 1) * userInput.size;
    }
    Model.Division.findAndCountAll({
      where: conditions,
      offset: offset,
      limit: limit,
      order: [['created', 'DESC']]
    }).then((result) => {
      if (result.rows.length > 0) {
        return responsehandler.getSuccessResult(result, res);
      } else {
        return responsehandler.getNotExistsResult(result, res)
      }
    })
      .catch(function (error) {
        var errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },

  async  add(req, res) {
    const arrayDivision = [];
    const resortMappingarray = [];
    const userInput = Utils.getReqValues(req);
    const divArray = userInput.division;
    const departmentArray = [];
    let resp = {};
    let divisionarr = [];

    if (!userInput.resortId) {
      return responsehandler.getErrorResult('resort Id is mandatory', res);
    }
    else {
      return Model.sequelize
        .transaction(function (t) {
          return Model.Division.bulkCreate(userInput.division, { returning: true }, { transaction: t })
            .then((division) => {
              division.map((element) => {
                arrayDivision.push(element.divisionId);
                divArray.map((value) => {
                  if (element.divisionName == value.divisionName) {
                    var arr = value.departments;
                    arr.map((elements) => {
                      return elements.divisionId = element.divisionId;
                    });
                    arr.map((val) => {
                      departmentArray.push(val);
                    });
                  }
                })

              });
              divisionarr = division;
            }).then(updatedTraining => {
              return Model.Department.bulkCreate(departmentArray, { returning: true }, { transaction: t }).then((departments) => {

              }).then(function (updatedResult) {
                let div = divisionarr;
                div.map((ele) => {
                  let resortObj = {};
                  resortObj.resortId = userInput.resortId,
                    resortObj.divisionId = ele.divisionId;
                  resortMappingarray.push(resortObj);
                });
                return ResortMapping.bulkCreate(resortMappingarray, { transaction: t }).then((response) => {
                }).then(function (addedResult) {

                });
              });
            });
        })
        .then(
          function (updatedTrainingDetail) {

            // This happens after the transaction has commited / rolled back
            return responsehandler.getSuccessResult(updatedTrainingDetail, res);
          },
          function (err) {
            var errorMessage = Utils.constructErrorMessage(err);
            return responsehandler.getErrorResult(errorMessage, res);
            // This is called if an error occurs within the transaction
          }
        )
        .catch(function (err) {
        
          var errorMessage = Utils.constructErrorMessage(err);
          return responsehandler.getErrorResult(errorMessage, res);
          // Transaction has been rolled back
          // err is whatever rejected the promise chain returned to the transaction callback
        });
    }
  },

  update(req, res) {
    let Data = Utils.getReqValues(req);
   
    Division
      .findOne({
        where: {
          divisionId: Data.divisionId
        }
      })
      .then(division => {
        if (!division) {
          return res.status(404).send({
            message: 'Division Not Found',
          });
        }
        Division.update(Data, { where: { divisionId: Data.divisionId } })
          .then((result) => {
            return responsehandler.getUpdateResult(result, res);
          })
          .catch((error) => {
            var errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          }
          );
      })
      .catch((error) => {
        return responsehandler.getErrorResult(error, res);
      })
  },

  buildRowPromises(requestObject, roleid) {
    let departmentarray = [];
    const promises = _.map(requestObject, (value, key) =>
      Promise.resolve().then((Res) => {
        module.exports.updateRoleSet(value)
      }));
    return promises;
  },

  updateRoleSet(value) {
    return Department.update(value, {
      where: { departmentId: value.departmentId }
    }).then((users) => {

    })
  },
  userHierarchyUpdate(req, res) {
    let Data = Utils.getReqValues(req);
    Division
      .findOne({
        where: {
          divisionId: Data.divisionId
        }
      })
      .then(Divisions => {
        if (!Divisions) {
          return res.status(404).send({
            message: 'Division Not Found',
          });
        }
        Division.update(Data, { where: { divisionId: Data.divisionId } })
          .then((result) => {
            if (Array.isArray(Data.Departments)) {
              let updatedFileList = Data.Departments.filter(function (x) {
                return !x.departmentId;
              });
              let insertFileList = Data.Departments.filter(function (x) {
                return x.departmentId;
              });
              Department.bulkCreate(updatedFileList).then(function (dept) {
              });
              if (Data.removeDepartmentIds) {
                Department.destroy({ where: { departmentId: Data.removeDepartmentIds } }).then(function (remove) {

                });
              }
              return Promise.all(module.exports.buildRowPromises(insertFileList, Data.divisionId))
                .then(setting => Department.findAll({ where: { divisionId: Data.divisionId } }).then(Result => {
                  return responsehandler.getUpdateResult(Result, res);
                }))
            }
            else {
              responsehandler.getErrorResult('Array Of Objects is Mandatory', res);
            }
            return responsehandler.getUpdateResult(result, res);
            // res.status(200).send({message :'User Permission Updated successfully'})
          })
          .catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          })
          .catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
          });
      });
  },

  delete(req, res) {
    let Data = Utils.getReqValues(req);
    let divArray = [];
    divArray.push(Data.divisionId);
    let whereCodn = {};
    whereCodn['divisionId'] = { $overlap: divArray };
    Model.TrainingScheduleResorts.findAll({ where: whereCodn }).then(function (response) {
      if (response.length === 0) {
        return Division
          .findOne({ where: { divisionId: Data.divisionId } })
          .then(division => {
            if (!division) {
              return res.status(400).send({
                message: 'Division Not Found',
              });
            }
            return Division
              .destroy({ where: { divisionId: Data.divisionId } })
              .then(() => res.status(200).send({ "isSuccess": true, message: 'Division deleted successfully' }))
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      } else {
        return responsehandler.getErrorResult("Divisions are assigned/scheduled ,Unable to delete division.", res);
      }
    }).catch(function (error) {
  
      var errorMessage = Utils.constructErrorMessage(error);
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  checkDivision(req, res) {
    let userInput = Utils.getReqValues(req);
    let innerCodn = {};
    if (userInput.resortId) {
      innerCodn['resortId'] = userInput.resortId;
    }
    if (userInput.divisionName) {
      let whereCodn = {};
      whereCodn['divisionName'] = { $in: userInput.divisionName };
      return Division
        .findAll({
          where: whereCodn,
          include: [{
            model: ResortMapping,
            where: innerCodn,
            required: true
          }]
        })
        .then(division => {
          if (division.length === 0) {
            return res.status(200).send({
              isSuccess: true,
              message: 'Division Not Found',
            });
          } else {
            let divisions = [];
            division.forEach(function (val, key) {
              divisions.push(val.dataValues.divisionName);
            });
            let joinDepart = divisions.join() + ' - ';
            return res.status(200).send({
              isSuccess: false,
              message: joinDepart + ' Division names already exists',
            });
          }
        })
        .catch((error) => res.status(400).send(error));
    } else {
      return responsehandler.getErrorResult('Division name is mandatory', res);
    }
  }
};