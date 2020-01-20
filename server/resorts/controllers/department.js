const Department = require('../models').Department;
let Utils = require('./../utils/Utils');
let responsehandler = require('./../utils/responseHandler');
//const Sequelize = require('Sequelize');
const Model = require('../models/');
module.exports = {
  list(req, res) {
    var userInput = Utils.getReqValues(req);
    var conditions = {};
    if (userInput.departmentId) {
      conditions['departmentId'] = userInput.departmentId;
    }
    if (userInput.divisionId) {
      conditions['divisionId'] = userInput.divisionId;
    }
    if (userInput.page && userInput.size) {
      var limit = userInput.size;
      var page = userInput.page ? userInput.page : 1;
      var offset = (page - 1) * userInput.size;
    }
    Department.findAndCountAll({
      where: conditions,
      offset: offset,
      limit: limit,
      order: [['created', 'DESC']],
    }).then((result) => {
      if (result.rows.length > 0) {
        return responsehandler.getSuccessResult(result, res);
      } else {
        return responsehandler.getNotExistsResult(result, res)
      }
    }).catch(function (error) {
      var errorMessage = Utils.constructErrorMessage(error);
      return responsehandler.getErrorResult(errorMessage, res);
    });
  },
  add(req, res) {
    var userInput = Utils.getReqValues(req);
    if (userInput.departmentName) {
      Department
        .create(userInput)
        .then((department) => {
          return responsehandler.getSuccessResult(department, res);
        })
        .catch(function (error) {
          var errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      res.status(400).send({
        message: 'Department Name is mandatory',
      });
    }

  },

  update(req, res) {
    let Data = Utils.getReqValues(req);
    Department
      .findOne({
        where: {
          departmentId: Data.departmentId
        }
      })
      .then(dept => {
        if (!dept) {
          return res.status(400).send({
            message: 'Department Not Found',
          });
        }
        Department.update(Data, { where: { departmentId: Data.departmentId } })
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
        var errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      })
  },
  delete(req, res) {
    let Data = Utils.getReqValues(req);
    let departArray = [];
    departArray.push(Data.departmentId);

    let whereCodn = {};
    whereCodn['departmentId'] = { $overlap: departArray };

    Model.TrainingScheduleResorts.findAll({ where: whereCodn }).then(function (response) {

      if (response.length === 0) {
        return Department
          .findOne({ where: { departmentId: Data.departmentId } })
          .then(department => {
            if (!department) {
              return res.status(400).send({
                message: 'Department Not Found',
              });
            }
            return Department
              .destroy({ where: { departmentId: Data.departmentId } })
              .then(() => res.status(200).send({ message: 'Department deleted successfully' }))
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      } else {
        return responsehandler.getErrorResult("Departments are assigned/scheduled ,Unable to delete department.", res);
      }
    }).catch((error) => res.status(400).send(error));
  },
  checkDepartment(req, res) {
    let userInput = Utils.getReqValues(req);
    let innerCodn = {};
    if (userInput.resortId) {
      innerCodn['resortId'] = userInput.resortId;
    }
    if (userInput.departmentName) {
      let whereCodn = {};
      whereCodn['departmentName'] = { $in: userInput.departmentName };
      Model.ResortMapping.findAll({ where: innerCodn }).then(function (resorts) {
        let divisions = [];
        resorts.forEach(function (val, key) {
          divisions.push(val.dataValues.divisionId);
        });
        whereCodn['divisionId'] = divisions;
        Department
          .findAll({
            where: whereCodn
          })
          .then(department => {
            if (department.length === 0) {
              return res.status(200).send({
                isSuccess: true,
                message: 'Department Not Found',
              });
            } else {
              let departments = [];
              department.forEach(function (val, key) {
                departments.push(val.dataValues.departmentName);
              });
              let joinDepart = departments.join() + ' - ';
              return res.status(200).send({
                isSuccess: false,
                message: joinDepart + 'Department names already exists ',
              });
            }
          })
          .catch((error) => res.status(400).send(error));
      });
    } else {
      return responsehandler.getErrorResult('Department name is mandatory', res);
    }
  }
};