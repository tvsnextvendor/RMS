const Resort = require("../models").Resort;
const ResortMapping = require("../models").ResortMapping;

const Division = require("../models").Division;

const Utils = require("./../utils/Utils");
const responsehandler = require("./../utils/responseHandler");

const Model = require("../models");
let async = require("async");

module.exports = {
  async getresortDivision(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    let divisionconditions = {};
    let divisionarray = [];
    if (userInput.resortId) {
      conditions["resortId"] = userInput.resortId;
    }
    let limit, offset, page;
    if (userInput.page && userInput.size) {
      limit = userInput.size;
      page = userInput.page ? userInput.page : 1;
      offset = (page - 1) * userInput.size;
    }

    userInput.parentResort = (userInput.parentResort != null)? userInput.parentResort :"";
    userInput.childResort  = (userInput.childResort != null)? userInput.childResort :"";
    userInput.Resort       = (userInput.Resort != null)? userInput.Resort :"";
    
    if (userInput.parentResort || userInput.childResort || userInput.Resort) {
      if (userInput.parentResort) {
        conditions["resortId"] = userInput.parentResort;
      }
      if (userInput.childResort) {
        conditions["parentId"] = userInput.childResort;
      }
      if (userInput.Resort) {
        conditions.$or = [
          { resortId: userInput.Resort },
          { parentId: userInput.Resort }
        ];
      }
      if (userInput.type == "division" && userInput.parentResort || userInput.type == "division" && userInput.childResort || userInput.type == "division" && userInput.Resort) {
        divisionconditions["resortId"] =
          userInput.Resort || userInput.childResort || userInput.parentResort;

        let response = await module.exports.ResortMappingFunction(
          divisionconditions
        );

        if (response.status === true) {
          divisionarray = response.data;
        }
      }
      var response = async.waterfall(
        [
          function (callback) {
            Resort.findAll({
              where: conditions,
              order: [['resortName', 'ASC']]
            }).then(function (result) {
              callback(null, result);
            });
          },
          function (resort, callback) {
            Division.findAll({
              where: { divisionId: divisionarray },
              order: [['divisionName', 'ASC']]
            }).then(
              function (divisions) {
                callback(null, divisions, resort);
              }
            );
          }
        ],
        function (err, divisions, resort) {
          let resp = { Resort: resort, divisions: divisions };
          return responsehandler.getSuccessResult(resp, "resort list ", res);
        }
      );
    }
  },
  ResortMappingFunction(divisionconditions) {
    const divisionarray = [];

    return new Promise(resolve => {
      try {
        ResortMapping.findAll({ where: divisionconditions })
          .then(resorts => {
            resorts.forEach(function (item) {
              divisionarray.push(item.dataValues.divisionId);
            });
            resolve({ status: true, data: divisionarray });
          })
          .catch(function (e) {
            resolve({ status: false, message: e });
          });
      } catch (error) {
        resolve({ status: false, message: error });
      }
    });
  }
};
