const Designation = require('../models').Designation;
const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const ResortMapping = require('../models').ResortMapping;
const async = require('async');
const Model = require('../models/');
module.exports = {
  async list(req, res) {
    let userInput = Utils.getReqValues(req);
    let designationarray;
    let conditions = {};
    if (userInput.designationId) {
      conditions['designationId'] = userInput.designationId;
    }
    let limit, page, offset;
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }
    let designationconditions = {
      resortId: userInput.resortId,
      designationId: {
        $ne: null
      }
    }
    let response = await module.exports.ResortMappingFunction(
      designationconditions
    );
    if (response.status === true) {
      designationarray = response.data;
    }
    if (userInput.resortId) {
      conditions['designationId'] = designationarray
    }
    Designation.findAndCountAll({
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
        let errorMessage = Utils.constructErrorMessage(error);
        return responsehandler.getErrorResult(errorMessage, res);
      });
  },
  add(req, res) {
    let userInput = Utils.getReqValues(req);
    const resortMappingarray = [];
    if (userInput.designation) {
      Designation.bulkCreate(userInput.designation, { returning: true })
        .then((designations) => {
          designations.map((ele) => {
            let resortObj = {};
            resortObj.resortId = userInput.resortId,
              resortObj.designationId = ele.designationId;
            resortMappingarray.push(resortObj);
          });
          ResortMapping.bulkCreate(resortMappingarray).then((response) => {
            return responsehandler.getSuccessResult(designations, res);
          });
        })
        .catch(function (error) {
          var errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      res.status(400).send({
        message: 'Designation  is mandatory',
      });
    }

  },
  update(req, res) {
    let Data = Utils.getReqValues(req);
    Designation
      .findOne({
        where: {
          designationId: Data.designationId
        }
      })
      .then(designation => {
        if (!designation) {
          return res.status(404).send({
            message: 'Designation Not Found',
          });
        }
        Designation.update(Data, { where: { designationId: Data.designationId } })
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
    return Designation
      .findOne({ where: { designationId: Data.designationId } })
      .then(designation => {
        if (!designation) {
          return res.status(400).send({
            message: 'Designation Not Found',
          });
        }
        return Designation
          .destroy({ where: { designationId: Data.designationId } })
          .then(() => res.status(200).send({ "isSuccess": true, message: 'Designation Deleted successfully' }))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  ResortMappingFunction(designationconditions) {
    const designationarray = [];
    return new Promise(resolve => {
      try {
        ResortMapping.findAll({ where: designationconditions })
          .then(resorts => {
            resorts.forEach(function (item) {
              designationarray.push(item.dataValues.designationId);
            });
            resolve({ status: true, data: designationarray });
          })
          .catch(function (e) {
            resolve({ status: false, message: e });
          });
      } catch (error) {
        resolve({ status: false, message: error });
      }
    });
  },
  checkDesignation(req, res) {
    let userInput = Utils.getReqValues(req);
    let innerCodn = {};
    if (userInput.resortId) {
      innerCodn['resortId'] = userInput.resortId;
    }
    if (userInput.designationName) {
      let whereCodn = {};
      whereCodn['designationName'] = { $in: userInput.designationName };
      return Designation
        .findAll({
          where: whereCodn,
          include: [{
            model: Model.ResortMapping,
            where: innerCodn,
            required:true
          }]
        })
        .then(designation => {
          if (designation.length === 0) {
            return res.status(200).send({
              isSuccess: true,
              message: 'Designation Not Found',
            });
          } else {
            let designations = [];
            designation.forEach(function (val, key) {
              designations.push(val.dataValues.designationName);
            });
            let joinDepart = designations.join() + ' - ';
            return res.status(200).send({
              isSuccess: false,
              message: joinDepart + ' Designation names already exists',
            });
          }
        })
        .catch((error) => res.status(400).send(error));
    } else {
      return responsehandler.getErrorResult('Designation name is mandatory', res);
    }
  }
};