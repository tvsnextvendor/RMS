const Role = require('../models').Role;
const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models');

module.exports = {
  list(req, res) {
    var userInput = Utils.getReqValues(req);
    var conditions = {};

    if (userInput.roleId) {
      conditions['roleId'] = userInput.roleId;
    }
    Role.findAll({
      where: conditions
    }).then((result) => {
      if (result.length > 0) {
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
  add(req, res) {
    var userInput = Utils.getReqValues(req);
    if (userInput.roleName) {
      Role
        .create(userInput)
        .then((role) => {
          return responsehandler.getSuccessResult(result, res);
        })
        .catch(function (error) {
          var errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      res.status(400).send({
        message: 'Role Name is mandatory',
      });
    }

  },
  update(req, res) {
    let Data = Utils.getReqValues(req);
    Role
      .findOne({
        where: {
          roleId: Data.roleId
        }
      })
      .then(role => {
        if (!role) {
          return res.status(404).send({
            message: 'role Not Found',
          });
        }
        Role.update(Data, { where: { roleId: Data.roleId } })
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
  delete(req, res) {
    let Data = Utils.getReqValues(req);
    return Role
      .findOne({ where: { roleId: Data.roleId } })
      .then(role => {
        if (!role) {
          return res.status(400).send({
            message: 'Role Not Found',
          });
        }
        return Role
          .destroy({ where: { roleId: Data.roleId } })
          .then(() => res.status(200).send({ message: 'Role Deleted successfully' }))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  defaultRoles(req, res) {
    let Data = Utils.getReqValues(req);
    if (!Data.resortId) {
      return responsehandler.getErrorResult("resortId is mandatory", res);
    }
    let resortMapping = [];
    for (let i = 1; i <= 10; i++) {
      let resortObj = {};
      resortObj.resortId = Data.resortId;
      resortObj.designationId = i;
      resortMapping.push(resortObj);
    }
    Model.ResortMapping.bulkCreate(resortMapping).then(function (resorts) {
      return responsehandler.getSuccessResult(resorts, res);
    }).catch((error) => res.status(400).send(error));
  }
};