const UserPermission = require('../models').UserPermission;
const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const UserRolePermission = require('../models').UserRolePermission;
const _ = require('lodash');
const Model = require('../models');

module.exports = {
  list(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};
    if (userInput.page && userInput.size) {
      var limit = userInput.size;
      var page = userInput.page ? userInput.page : 1;
      var offset = (page - 1) * userInput.size;
    }
    if (userInput.departmentId) {
      conditions['departmentId'] = userInput.departmentId;
    }
    if (userInput.divisionId) {
      conditions['divisionId'] = userInput.divisionId;
    }
    if (userInput.resortId) {
      conditions['resortId'] = userInput.resortId;
    }
    if (userInput.designationId) {
      conditions['designationId'] = userInput.designationId;
    }
    if (userInput.userPermissionId) {
      conditions['userPermissionId'] = userInput.userPermissionId;
    }
    if (!userInput.departmentId && !userInput.divisionId && !userInput.resortId && !userInput.designationId) {
      return responsehandler.getErrorResult('Department or division or resort fields are mandatory', res);
    }
    if (userInput.web == 'true' && userInput.mobile == 'true') {
      conditions.$or = [
        { web: userInput.web },
        { mobile: userInput.mobile }
      ];
    } else if (userInput.web == 'true') {
      conditions['web'] = userInput.web;
    } else if (userInput.mobile == 'true') {
      conditions['mobile'] = userInput.mobile;
    } else {
      conditions['web'] = false;
      conditions['mobile'] = false;
    }
    Model.UserRolePermission.findAndCountAll({
      where: conditions,
      include: [{ model: Model.UserPermission, as: 'userPermission' },
      { model: Model.Division, required: false },
      { model: Model.Resort, required: false },
      { model: Model.User, attributes: ['userName'], required: false },
      { model: Model.Designation, required: false }],
      order: [
        ['created', 'DESC']
      ],
      //subQuery:false,
      offset: offset,
      limit: limit
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

  async add(req, res) {
    let userInput = Utils.getReqValues(req);
    let arr = [];
    let menuarray = [];
    let conditions = {};
    let mobile;
    let web;
    if (userInput.mobile) {
      mobile = userInput.mobile;
    } else {
      mobile = false
    }
    if (userInput.web) {
      web = userInput.web;
    } else {
      web = false
    }

    if (userInput.allDepartments === 1) {
      let allInputs = await Utils.loopForAllDepartments(userInput, Model);

      let userPermissionData;
      if (allInputs.status === true) {
        userPermissionData = allInputs.data;
      }
      Model.UserRolePermission.findOne({
        where: {
          designationId: userInput.designationId,
          mobile: mobile,
          web: web
        }
      }).then(function (users) {
        if (!users) {


          if (userInput.web || userInput.mobile || userInput.web && userInput.mobile) {
            if (userPermissionData.length > 0) {
              userPermissionData.forEach(function (valPermission, valKey) {
                Model.UserRolePermission.create(valPermission)
                  .then((userpermission) => {
                    if (userInput.web) {
                      arr = userInput.menu;
                      arr.map((element) => {
                        return element.userRolePerid = userpermission.userRolePerid;
                      });
                      arr.forEach(function (ele) {
                        menuarray.push(ele);
                      })
                    } if (userInput.mobile) {
                      arr = userInput.menuMobile;
                      arr.map((element) => {
                        return element.userRolePerid = userpermission.userRolePerid;
                      });
                      arr.forEach(function (ele) {
                        menuarray.push(ele);
                      })
                    }

                    Model.UserPermission.bulkCreate(menuarray).then((userss) => {
                      return responsehandler.getSuccessResult(userpermission, res);
                    }).catch(function (error) {
                      var errorMessage = Utils.constructErrorMessage(error);
                      return responsehandler.getErrorResult(errorMessage, res);
                    });
                  })
                  .catch(function (error) {
                    var errorMessage = Utils.constructErrorMessage(error);
                    return responsehandler.getErrorResult(errorMessage, res);
                  });
              });
            } else {
              return responsehandler.getErrorResult('userPermissionData is empty', res);
            }
          } else {
            return responsehandler.getErrorResult('Either mobile or web key must be choosen', res);
          }
        } else {
          if (!userInput.departmentId && (userInput.allDepartments !== 1)) {
            module.exports.update(userInput, res);
          } else {
            return responsehandler.getErrorResult('Please update departments individually', res);
          }
        }
      });
    }
    else {
      Model.UserRolePermission.findOne({
        where: {
          designationId: userInput.designationId,
          mobile: mobile,
          web: web
        }
      }).then(function (users) {
        if (!users) {
          if (userInput.web || userInput.mobile || userInput.web && userInput.mobile) {
            Model.UserRolePermission.create(userInput)
              .then((userpermission) => {
                if (userInput.web) {
                  arr = userInput.menu;
                  arr.map((element) => {
                    return element.userRolePerid = userpermission.userRolePerid;
                  });
                  arr.forEach(function (ele) {
                    menuarray.push(ele);
                  });
                } if (userInput.mobile) {
                  arr = userInput.menuMobile;
                  arr.map((element) => {
                    return element.userRolePerid = userpermission.userRolePerid;
                  });
                  arr.forEach(function (ele) {
                    menuarray.push(ele);
                  })
                }
                Model.UserPermission.bulkCreate(menuarray).then((userss) => {
                  return responsehandler.getSuccessResult(userpermission, res);
                }).catch(function (error) {
                  var errorMessage = Utils.constructErrorMessage(error);
                  return responsehandler.getErrorResult(errorMessage, res);
                });
              })
              .catch(function (error) {
                var errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
              });
          } else {
            return responsehandler.getErrorResult('Either mobile or web key must be choosen', res);
          }
        } else {
          module.exports.update(userInput, res);
        }
      });
    }
  },
  buildRowPromises(requestObject, roleid) {
    const promises = _.map(requestObject, (value, key) =>
      Promise.resolve().then((Res) => {
        module.exports.updateRoleSet(roleid, value)
      }));
    return promises;
  },
  updateRoleSet(roleId, value) {
    return UserPermission.update(value, {
      where: { userPermissionId: value.userPermissionId }
    }).then((users) => {
    })
  },
  update(req, res) {
    let Data = req;
    UserRolePermission
      .findOne({
        where: {
          designationId: Data.designationId
        }
      })
      .then(users => {
        if (!users) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        UserRolePermission.update(Data, { where: { userRolePerid: users.dataValues.userRolePerid } })
          .then((result) => {
            if (Array.isArray(Data.menu) || Array.isArray(Data.menuMobile) || Array.isArray(Data.menu) && Array.isArray(Data.menuMobile)) {
              let array = [];
              if (Array.isArray(Data.menuMobile)) {
                array = Data.menuMobile;
              } if (Array.isArray(Data.menu)) {
                array = Data.menu;
              }
              return Promise.all(module.exports.buildRowPromises(array, users.dataValues.userRolePerid))
                .then(setting => UserPermission.findAll({ where: { userRolePerid: users.dataValues.userRolePerid } }).then(Result => {
                  return responsehandler.getUpdateResult(Result, res);
                }))
            }
            else {
              responsehandler.getErrorResult('Array of objects is mandatory', res);
            }
            return responsehandler.getUpdateResult(result, res);
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
    return UserPermission
      .findOne({ where: { userPermissionId: Data.userPermissionId } })
      .then(userpermission => {
        if (!userpermission) {
          return res.status(400).send({
            message: 'userPermission Not Found',
          });
        }
        return DepartMent
          .destroy({ where: { userPermissionId: Data.userPermissionId } })
          .then(() => res.status(200).send({ message: 'user permission deleted successfully' }))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  getRolePermissions(req, res) {
    let userInput = Utils.getReqValues(req);
    let userCondn = {};
    if (userInput.userId) {
      userCondn['userId'] = userInput.userId;
    }
    let mappingCond = {};
    mappingCond['designationId'] = { $ne: null };
    let designationIds = [];
    let designationCondn = {};
    Model.User.findAll({
      include: [{ model: Model.ResortUserMapping, where: mappingCond }],
      where: userCondn
    }).then(function (response) {

     
      if (response.length > 0) {
        let userData = response[0].dataValues;

        console.log(userData);
        let userDataMap = userData.ResortUserMappings;
        let resortId;
        userDataMap.forEach(function (val, key) {
          designationIds.push(val.designationId);
          resortId = val.resortId;
        });

        console.log(designationIds);
        designationCondn['designationId'] = { $in: designationIds };
        if (userInput.web == 1) {
          designationCondn['web'] = true;
        } else if (userInput.mobile == 1) {
          designationCondn['mobile'] = true;
        }
        designationCondn['resortId'] = resortId;

        console.log(designationCondn);

        // if (userInput.userId) {
        // designationCondn['userId'] = userInput.userId;
        // }
        // else{
        //   designationCondn['web'] = true;
        //   designationCondn['mobile'] = true;
        // }
        Model.UserRolePermission.findAndCountAll({
          where: designationCondn,
          include: [{ model: Model.UserPermission, as: 'userPermission' }],
          order: [
            ['created', 'DESC']
          ]
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
      } else {
        return responsehandler.getNotExistsResult(response, res);
      }
    });
  }
};