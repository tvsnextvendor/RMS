const Resort = require('../models').Resort;
const ResortMapping = require('../models').ResortMapping;
const ResortUserMapping = require('../models').ResortUserMapping;
const User = require('../models').User;
const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models');
const Division = require("../models").Division;
const Department = require("../models").Department;
const rolessql = require('../utils/roles.json');
const allBadges = rolessql.badges;
const Sequelize = require('sequelize');
module.exports = {
  list(req, res) {
    let userInput = Utils.getReqValues(req);
    let conditions = {};

    if (userInput.resortId) {
      conditions['resortId'] = userInput.resortId;
    }
    if (userInput.createdBy) {
      conditions['createdBy'] = userInput.createdBy;
    }
    if (userInput.Resort) {
      conditions.$or = [
        { resortId: userInput.Resort },
        { parentId: userInput.Resort }
      ];
    }
    if (userInput.page && userInput.size) {
      var limit = userInput.size;
      var page = userInput.page ? userInput.page : 1;
      var offset = (page - 1) * userInput.size;
    }
    let newcondn = {};
    newcondn['divisionId'] = { $eq: null };
    newcondn['departmentId'] = { $eq: null };
    newcondn['designationId'] = { $eq: null };
    let searchCondn = {};
    if (userInput.search) {
      let search = userInput.search;
      searchCondn = {
        $or: [
          {
            resortName: {
              $iLike: "%" + (search ? search : "") + "%"
            }
          },
          {
            location: {
              $iLike: "%" + (search ? search : "") + "%"
            }
          },
          {
            '$ResortUserMappings.User.email$': {
              $iLike: "%" + (search ? search : "") + "%"
            }
          },
          {
            '$ResortUserMappings.User.phoneNumber$': {
              $iLike: "%" + (search ? search : "") + "%"
            }
          },
          {
            allocatedSpace: {
              $iLike: "%" + (search ? search : "") + "%"
            }
          }
        ],
        $and: conditions
      };
    } else {
      searchCondn = conditions;
    }
    let orderBy;
    if(userInput.order === 1){
      orderBy = [['resortName', 'ASC']]
    }else{
      orderBy = [['created', 'DESC']]
    }
    Resort.findAndCountAll({
      where: searchCondn,
      include: [{
        model: Model.ResortUserMapping,
        where: newcondn,
        include: [{
          model: User,
          attributes: ['email', 'phoneNumber', 'userName', 'firstName', 'lastName']
        }]
      }],
      offset: offset,
      limit: limit,
      order: orderBy
    }).then((result) => {
      if (result.count > 0) {
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
    const userInput = Utils.getReqValues(req);
    const getClientURL = Utils.getClientURL();
    const designations = await Utils.getDefaultRoles(userInput, Model);
    let designationData;
    if (designations.status === true) {
      designationData = designations.data;
    }
    if (userInput.resortName) {
      return Model.sequelize
        .transaction(function (t) {
          return User.findOne({
            order: [
              ['userId', 'DESC'],
            ],
          }, { transaction: t }).then((userss) => {
            if (userss.employeeId) {
              let response = userss.employeeId.split("R");
              let num = JSON.parse(response[1]) + 1;
              userInput.employeeId = 'R' + num;
            } else {
              userInput.employeeId = 'R1000'
            }
            userInput.resortName = userInput.resortName.trim();
            userInput.location = userInput.location.trim();
            if (userInput.email) {
              userInput.email = userInput.email.trim();
              let response = userInput.email.split("@");
              let username = response[0];
              userInput.resortMapping = { divisionId: userInput.divisionId };

              // Old Code modifications
              // let uniqueUserName = userInput.resortName + '-' + username;
              // let randomNo  = Math.floor(10 + Math.random() * 90);
              // uniqueUserName = uniqueUserName.replace(/\s/g, '')+ randomNo;
               // Old Code modifications

               let uniqueUserName = username;
               let randomNo  = Math.floor(1000 + Math.random() * 9000);
               uniqueUserName = uniqueUserName.replace(/\s/g, '')+ randomNo;



              userInput.userName = uniqueUserName.toLowerCase();
              userInput.User = { userName: userInput.userName, firstName: username, email: userInput.email, phoneNumber: userInput.phoneNumber, password: '123456', employeeId: userInput.employeeId };
              userInput.User.UserRole = { roleId: userInput.roleId };
            }
            return Resort
              .create(userInput, { transaction: t })
              .then((resort) => {
                return User.create(
                  userInput.User,
                  {
                    include: [
                      { model: Model.UserRoleMapping, as: 'UserRole' },
                    ]
                  },
                  { transaction: t }).then(function (users) {
                    let obj = {};
                    obj.userId = users.dataValues.userId;
                    obj.resortId = resort.dataValues.resortId;
                    let resortMap = [];
                    designationData.forEach(function (val, key) {
                      let obj = {};
                      obj.designationId = val.dataValues.designationId;
                      obj.resortId = resort.dataValues.resortId;
                      resortMap.push(obj);
                    });
                    let setBadge = [];
                    allBadges.forEach(function (val, key) {
                      let object = {};
                      object = val;
                      object['resortId'] = resort.dataValues.resortId;
                      setBadge.push(object);
                    });
                    return Model.ResortMapping.bulkCreate(resortMap, { transaction: t }).then(function (resortMap) {
                      return Model.Badges.bulkCreate(setBadge, { transaction: t }).then(function (badges) {
                        return Model.ResortUserMapping.create(obj, { transaction: t }).then(function (resortsmapping) {
                          return { "resort": resort, "resortMapping": resortsmapping }
                        });
                      });
                    });
                  })
              })
          });
        }).then(function (resultfinal) {
          let resortSubject = 'Welcome to LMS Application';
          let resortMessage = 'Dear ' + userInput.resortName + ',' + '<br><br>' +
            'Welcome to Our new and enhanced Site Application. We are thrilled to have you on board!' + '<br><br>' +
            'Please click ' + '<a href=' + getClientURL + '>here</a>' + ' to log into your  account. Below are your account credentials:' + '<br><br>' +
            'User Name: <strong>' + userInput.userName + '</strong><br><br>' +
            'Email Address: ' + userInput.email + '<br><br>' +
            'Password: ' + "12345678" + '<br><br>' +
            'You can go to settings and change your password after your first login.';

          let emails = [];
          emails.push(userInput.email);
          Utils.mailOptions(emails, resortMessage, resortSubject);
          resultfinal['message'] = "Site saved successfully";
          return responsehandler.getSuccessResult(
            resultfinal,
            res
          );
        }).catch(function (error) {
          var errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage, res);
        });
    } else {
      res.status(400).send({
        message: 'Site Name is mandatory',
      });
    }
  },
  update(req, res) {
    let Data = Utils.getReqValues(req);
    let message;
    if (Data.active == '1') {
      message = 'Site activated successfully';
    } else if (Data.active == '0') {
      message = 'Site de-activated successfully';
    } else {
      message = "Site updated successfully";
    }
    Resort
      .findByPk(Data.resortId, {
        include: [
          { model: ResortMapping, as: 'resortMapping' }, { model: ResortUserMapping, attributes: ['userId'] }
        ],
        order: [['created', 'ASC']]
      })
      .then((product) => {
        if (!product) {
          throw new Error(`Product with id ${resortId} not found`);
        }
        let userId;
        if (product.ResortUserMappings.length > 0) {
          userId = product.ResortUserMappings[0].dataValues.userId;
        } else {
          userId = '';
        }
        return Model.sequelize.transaction().then(t => {
          return Resort.update(Data, { where: { resortId: Data.resortId } }, { transaction: t }).then((resorts) => {
            return User.update(Data.User, { where: { userId: userId } }, { transaction: t }).then((users) => {
            })
          }).then(() => {
            return t.commit();
          }).catch((err) => {
          
            return t.rollback();
          });
        });
      })
      .then(() => {
        Resort
          .findByPk(Data.resortId, {
            include: [
              { model: ResortMapping, as: 'resortMapping' }
            ]
          })
          .then((products) => {
            products['message'] = message;
            return responsehandler.getSuccessResult(products, res);
          })
      });
  },
  delete(req, res) {
    let Data = Utils.getReqValues(req);
    let resortCodn = { resortId: Data.resortId };
    return Resort
      .findOne({ where: resortCodn })
      .then(resort => {
        if (!resort) {
          return res.status(400).send({
            isSuccess: false,
            message: 'Site Not Found',
          });
        }
        return ResortUserMapping.findAll({ where: resortCodn }).then(function (resortUsers) {
          let userIds = []
          resortUsers.forEach(function (val, key) {
            userIds.push(val.dataValues.userId);
          });
          let userCodn = {};
          userCodn['userId'] = { $in: userIds };
          return ResortUserMapping.destroy({ where: userCodn }).then(function (userDel) {
            return User.destroy({ where: userCodn }).then(function (delUser) {
              return Resort
                .destroy({ where: resortCodn })
                .then(() => {
                  res.status(200).send({ isSuccess: true, message: 'Site deleted successfully' });
                });
            });
          });
        })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  getResortDetails(req, res) {
    let conditions = {};
    let userInput = Utils.getReqValues(req);
    if (userInput.resortId) {
      conditions['resortId'] = userInput.resortId;
    }
    Resort.findAll({
      where: conditions,
      attributes: ['resortId', 'resortName'],
      include: [{
        model: ResortMapping, as: 'resortMapping',
        where: { divisionId: { $ne: null } },
        attributes: ['resortId'],
        include: [{
          model: Division,
          attributes: ['divisionId', 'divisionName',
          [Sequelize.literal('COUNT(DISTINCT("resortMapping->Division->ResortUserMappings"."userId"))'), 'divisionEmployees'],
           // [Sequelize.fn('COUNT', Sequelize.col('"resortMapping->Division->ResortUserMappings"."userId"')), 'divisionEmployees']
          ],
          required: true,
          include: [{
            model: ResortUserMapping,
            attributes: [],
          },
          {
            model: Department,
            attributes: ['departmentId', 'departmentName',
            [Sequelize.literal('COUNT(DISTINCT("resortMapping->Division->Departments->ResortUserMappings"."userId"))'), 'departmentemployees'],
             // [Sequelize.fn('COUNT', Sequelize.col('"resortMapping->Division->Departments->ResortUserMappings"."userId"')), 'departmentemployees']
            ],
            include: [{
              model: ResortUserMapping,
              attributes: [],
            }]
          }]
        }]
      }],
      group: [
       "Resort.resortId",
       "resortMapping.resortMappingId", 
       "resortMapping->Division.divisionId", 
       "resortMapping->Division->Departments.departmentId"],
      order: [['resortMapping', 'Division', 'created', 'DESC']]
    }).then((resorts) => {
      return responsehandler.getSuccessResult(resorts, res);
    })
  },
  getAllResorts(req, res) {
    let conditions = {};
    let userInput = Utils.getReqValues(req);
    if (userInput.resortId) {
      conditions['resortId'] = userInput.resortId;
    }
    if (userInput.parentId) {
      conditions['parentId'] = userInput.parentId;
    } else if (userInput.parents) {
      conditions['parentId'] = { $eq: null };
    }
    Model.Resort.findAll({
      where: conditions, 
      attributes: ['resortId', 'resortName', 'parentId'],
      order:[['resortName','ASC']]
     }).then(function (allresorts) {
      return responsehandler.getSuccessResult(allresorts, res);
    });
  }
};