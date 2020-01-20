const model = require('../models');
let Utils = require('./../utils/Utils');
let responseHandler = require('./../utils/responseHandler');
const resources = require('./../utils/constant.json');
const settings = require('../config/configuration');
const _ = require('lodash');
const Sequelize = require('sequelize');

module.exports = {
    //Create New Forum
    async createNewForum(req, res) {
        let userInput = Utils.getReqValues(req);
        let notificationMsg = await Utils.getNotifications('assignForum');
        //Validate Forum Object
        if (!userInput.forum || !userInput.forum.forumName) {
            responseHandler.getErrorResult(resources.errors.noForumName, res);
            return false;
        } else if (userInput.forum && !userInput.forum.forumAdmin) {
            responseHandler.getErrorResult(resources.errors.noForumAdmin, res);
            return false;
        }
        let departDiv = [];
        //Create New Object with its Associations 
        let forumObject = userInput.forum;
        forumObject['Divisions'] = [];
        forumObject['Topics'] = [];
        forumObject['Notifications'] = [];

        if (userInput.divisions && userInput.divisions.length && userInput.departments && userInput.departments.length) {
            let div = userInput.divisions;
            userInput.departments.forEach(function (item) {
                departDiv.push(item.divisionId);
            });
            let resp = _.difference(div, departDiv);
            resp.forEach(function (item) {
                let newDiv = {};
                newDiv['divisionId'] = item;
                forumObject['Divisions'].push(newDiv);
            });
        }
        if (userInput.divisions && userInput.divisions.length && !userInput.departments) {
            userInput.divisions.forEach(function (item) {
                let newDiv = {};
                newDiv['divisionId'] = item;
                forumObject['Divisions'].push(newDiv);
            });
        }
        if (userInput.departments && userInput.departments.length) {
            userInput.departments.forEach(function (item) {
                let newDept = {};
                newDept['departmentId'] = item.departmentId;
                newDept['divisionId'] = item.divisionId;
                forumObject['Divisions'].push(newDept);
            });
        }
        userInput.topics.forEach(function (item) {
            let newTopic = {};
            newTopic['topics'] = item;
            forumObject['Topics'].push(newTopic);
        });

        let userArray = [];
        userArray = userInput.forum.assignedTo;
        userArray.push(userInput.forum.forumAdmin);

        userArray.forEach(function (val, key) {
            // notifications object for forum creation
            let notifyObj = {};
            notifyObj['senderId'] = userInput.forum.forumAdmin;
            notifyObj['receiverId'] = val;
            if (notificationMsg.status === true) {
                let notifyMessage = notificationMsg.data.message;
                let notifyMessage_1 = notifyMessage.replace(new RegExp('{{FORUM}}', 'g'), userInput.forum.forumName);
                notifyObj['notification'] = notifyMessage_1;
            }
            notifyObj['type'] = 'assignForum';
            forumObject['Notifications'].push(notifyObj);
        });
        return model.sequelize.transaction(transaction => {
            return model.Forum.create(forumObject, transaction).then(function (response) {
                if (response) {
                    forumObject['Topics'].forEach(function (value, key) {
                        value['forumId'] = response.dataValues.forumId;
                    });
                    return model.ForumTopics.bulkCreate(forumObject['Topics'], { individualHooks: true }, transaction).then(function (forumRes) {
                        forumObject['Divisions'].forEach(function (value, key) {
                            value['forumId'] = response.dataValues.forumId;
                        });
                        return model.ForumMapping.bulkCreate(forumObject['Divisions'], { individualHooks: true }, transaction).then(function (forumMapResult) {
                            forumObject['Notifications'].forEach(function (value, key) {
                                value['forumId'] = response.dataValues.forumId;
                            });
                            return model.Notification.bulkCreate(forumObject['Notifications'], { individualHooks: true }, transaction).then(function (forumMapResult) {
                                return { "forum": response, "forumMapResult": forumMapResult }
                            }).catch(function (err) {
                                console.log(err);
                                return err;
                            });
                        }).catch(function (err) {
                            console.log(err);
                            return err;
                        });
                    }).catch(function (err) {
                        console.log(err);
                        return err;
                    });
                }
            });
            // return model.Forum
            //         .findOrCreate({
            //             where: { forumName: userInput.forum.forumName}, 
            //             defaults: forumObject, 
            //             include: [
            //                 { model: model.ForumTopics, as:'Topics',transaction},
            //                 { model: model.ForumMapping, as:'Divisions',transaction},
            //                 { model: model.Notification, as:'Notifications',transaction}
            //             ],
            //         transaction
            //     }).spread((newForum, created) => {
            //     return { "newForum": newForum , "created":created }
            // }).catch(function(result){
            //     return responseHandler.getErrorResult(result,res );
            // });
        }).then(function (result) {
            // Transaction has been committed
            if (result) {
                responseHandler.getSuccessResult(resources.labels.forumCreate, res);
            } else {
                responseHandler.getExistsResult(resources.errors.forumExists, res);
            }
            // result is whatever the result of the promise chain returned to the transaction callback
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            return responseHandler.getErrorResult(errorMessage, res);
            throw new Error(errorMessage);
            // Transaction has been rolled back
            // err is whatever rejected the promise chain returned to the transaction callback
        });
    },
    buildRowPromises(requestObject, roleid) {
        const promises = _.map(requestObject, (value, key) =>
            Promise.resolve().then((Res) => {

                module.exports.updateRoleSet(value)
            }));
        return promises;
    },
    updateRoleSet(value) {
        return model.ForumMapping.update(value, {
            where: { forumMappingId: value.forumMappingId }
        }).then((users) => {

        }).catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            return errorMessage;
        });
    },
    update(req, res) {
        let userInput = Utils.getReqValues(req);
        let newForumDetails = [];
        let updatedData = [];
        let divisionCreate = [];
        let divisionUpdate = [];
        if (userInput.topics) {
            userInput.topics.forEach(function (item, key) {
                item.table = "ForumTopics";
                if (!item.forumTopicId) {
                    newForumDetails.push(item);
                } else {
                    updatedData.push(item);
                }
            });
        }
        if (userInput.Divisions) {
            userInput.Divisions.forEach(function (item) {
                if (item.forumMappingId) {
                    divisionUpdate.push(item);
                } else {
                    divisionCreate.push(item);
                }
            });
        }
        if (userInput.divisions && userInput.divisions.length > 0) {
            userInput.divisions.forEach(function (item) {
                let newDiv = {};
                newDiv['divisionId'] = item;
                newDiv['forumId'] = userInput.forumId;
                divisionCreate.push(newDiv);
            });
        }
        return model.sequelize.transaction(transaction => {
            return model.Forum.update(userInput.forum, { where: { forumId: userInput.forumId } }, transaction).then(function (forumss) {
                if (divisionUpdate.length > 0) {
                    return Promise.all(module.exports.buildRowPromises(divisionUpdate, userInput.forumId))
                        .then(setting =>
                            model.Forum.findAll({ where: { forumId: userInput.forumId } }, transaction).then(Result => {
                                if (divisionCreate.length > 0) {

                                    model.ForumMapping.bulkCreate(divisionCreate, transaction, { returning: true }).then(function (results) {

                                        return results;

                                    })

                                }

                                return Result;
                            })).then(function (result) {
                                if (result) {
                                    model.ForumMapping.destroy({ where: { departmentId: null, divisionId: null } }).then(function (forummmmsss) {
                                    })
                                    if (userInput.topics) {
                                        if (updatedData.length > 0) {
                                            return Sequelize.Promise.map(updatedData, function (
                                                itemToUpdate
                                            ) {
                                                let Id = "forumTopicId";

                                                let conditions = {};
                                                conditions[Id] = itemToUpdate[Id];

                                                return model[itemToUpdate.table].update(itemToUpdate, {
                                                    where: conditions,
                                                    transaction
                                                });
                                            }).then(function (updatedResult) {
                                                if (newForumDetails.length > 0) {
                                                    return model.ForumTopics.bulkCreate(
                                                        newForumDetails,
                                                    ).then(function (resp) {

                                                        if (userInput.forum.active == '1') {
                                                            res.status(200).send({ "isSuccess": true, message: 'Forum is changed to Active successfully' });
                                                        } else if (userInput.forum.active == '0') {
                                                            res.status(200).send({ "isSuccess": true, message: 'Forum is changed to InActive successfully' });
                                                        }
                                                        else {
                                                            responseHandler.getSuccessResult('forum updated successfully', res);
                                                        }
                                                    })
                                                } else {

                                                    if (userInput.forum.active == '1') {
                                                        res.status(200).send({ "isSuccess": true, message: 'Forum is changed to Active successfully' });
                                                    } else if (userInput.forum.active == '0') {
                                                        res.status(200).send({ "isSuccess": true, message: 'Forum is changed to InActive successfully' });
                                                    }
                                                    else {
                                                        responseHandler.getSuccessResult('forum updated successfully', res);
                                                    }
                                                }


                                            });
                                        } else {
                                            if (userInput.forum.active == '1') {
                                                res.status(200).send({ "isSuccess": true, message: 'Forum is changed to Active successfully' });
                                            } else if (userInput.forum.active == '0') {
                                                res.status(200).send({ "isSuccess": true, message: 'Forum is changed to InActive successfully' });
                                            }
                                            else {
                                                responseHandler.getSuccessResult('forum updated successfully', res);
                                            }
                                        }


                                    }


                                }
                                else {

                                }

                                //  }  
                                // result is whatever the result of the promise chain returned to the transaction callback
                            }).catch(function (err) {
                                let errorMessage = err;
                                if (err.errors) {
                                    errorMessage = Utils.constructErrorMessage(err);
                                }

                                return responseHandler.getErrorResult(errorMessage, res);
                                //  throw new Error(errorMessage);
                                // Transaction has been rolled back
                                // err is whatever rejected the promise chain returned to the transaction callback
                            });
                    // })




                } else {
                    if (userInput.forum.active == '1') {
                        res.status(200).send({ "isSuccess": true, message: 'Forum is changed to Active successfully' });
                    } else if (userInput.forum.active == '0') {
                        res.status(200).send({ "isSuccess": true, message: 'Forum is changed to InActive successfully' });
                    }
                    else {
                        responseHandler.getSuccessResult('forum updated successfully', res);
                    }
                }
            })
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            return responseHandler.getErrorResult(errorMessage, res);
            // Transaction has been rolled back;
            // err is whatever rejected the promise chain returned to the transaction callback
        });
    },

    //Create New Forum
    getForumList(req, res) {
        let userInput = Utils.getReqValues(req);
        var limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        let forumWhere = {};
        let andWhere = {};
        let currentDate = new Date();
        if (userInput.type === 'mobile') {
            forumWhere['startDate'] = { $lte: currentDate };
            forumWhere['endDate'] = { $gte: currentDate };
            andWhere['startDate'] = { $lte: currentDate };
            andWhere['endDate'] = { $gte: currentDate };
        } else {
            forumWhere['endDate'] = { $gte: currentDate };
        }
        if (userInput.forumId) {
            forumWhere['forumId'] = userInput['forumId'];
        }
        // Mobile used as userId
        let userArray = [];
        userArray.push(userInput.userId);
        if (userInput.userId) {
            forumWhere.$or = [
                { forumAdmin: userArray },
                { assignedTo: { $overlap: userArray } }
            ];
        }
        if (userInput.isActive == 1) {
            forumWhere['isActive'] = true;
            andWhere['isActive'] = true;
        }
        // Web used as createdBy
        if (userInput.createdBy) {
            let createArray = [];
            createArray.push(userInput.createdBy);
            forumWhere.$or = [
                { forumAdmin: createArray },
                { assignedTo: { $overlap: createArray } },
                { createdBy: userInput.createdBy }
            ];
            // forumWhere['createdBy'] = userInput.createdBy;
        }
        //search with Forum Name only for mobile user
        if (userInput.search) {
            andWhere.$or =
                [
                    { forumAdmin: userArray },
                    { assignedTo: { $overlap: userArray } }
                ];
            let search = userInput.search;
            forumWhere = {
                $or: [
                    {
                        forumName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },

                ],
                $and: andWhere
            };
        }
     
        // forumWhere['isActive'] = true;
        model.Forum.findAndCountAll({
            where: forumWhere,
            // attributes: { exclude: [''] },
            include: [{
                model: model.ForumMapping, as: 'Divisions', attributes: ['forumId', 'divisionId', 'departmentId', 'forumMappingId'],
                required: false,
                include: [{
                    model: model.Division, attributes: ['divisionId', 'divisionName'],
                    required: false

                    // include:[
                    //     {model: model.User, attributes:['userId']}
                    // ]
                },
                {
                    model: model.Department,
                    attributes: ['departmentId', 'departmentName'],
                    required: false
                    // include:[{model: model.User, attributes:['userId']}]
                },
                ]
            }, { model: model.ForumTopics, as: 'Topics', attributes: { exclude: ['created', 'updated'], required: false } }],
            order: [['created', 'DESC']],
            offset: offset,
            limit: limit,
            distinct: true,
            subQuery: false,
            // raw:true
        }).then((allForums) => {
            if (allForums && allForums.rows) {
                let forumList = [];
                JSON.parse(JSON.stringify(allForums.rows)).forEach(function (forumItem) {
                    let newItem = Object.assign({}, forumItem);
                    let userCount = 0;
                    if (forumItem) {
                        if (forumItem.assignedTo) {
                            userCount = forumItem.assignedTo.length;
                        }
                        // 
                    }
                    // if(forumItem.Divisions  &&  forumItem.Divisions.length){

                    //     forumItem.Divisions.forEach(function(divMap) { 
                    //         if(divMap.Department && divMap.Department.Users && divMap.Department.Users.length){
                    //             userCount =  userCount + divMap.Department.Users.length;
                    //         }else if(divMap.Division && divMap.Division.Users && divMap.Division.Users.length){
                    //             userCount =  userCount + divMap.Division.Users.length;
                    //         }
                    //     });
                    // }
                    newItem['employeesCount'] = userCount;
                    forumList.push(newItem);
                });
                allForums.rows = forumList;
                responseHandler.getSuccessResult(allForums, res);
            } else {
                responseHandler.getNotExistsResult(resources.labels.noForum, res)
            }
        }).catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            responseHandler.getErrorResult(errorMessage, res);
        });

    },
    //Get Specific Forum
    getSpecificForum(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.forumId) {
            responseHandler.getErrorResult(resources.errors.noForumId, res);
            return false;
        }
        model.Forum.findOne({
            where: { forumId: userInput.forumId },
            include: [
                {
                    model: model.ForumMapping, as: 'Divisions', attributes: ['forumMappingId', 'forumId', 'divisionId', 'departmentId'], required: false,
                    include: [{
                        model: model.Division, attributes: ['divisionId'],
                        //include:[{model: model.User, attributes:['userId']}]
                    },
                    {
                        model: model.Department, attributes: ['departmentId'],
                        //  include:[{model: model.User, attributes:['userId']}] 
                    },
                    ]
                },
                { model: model.ForumTopics, as: 'Topics', attributes: { exclude: ['created', 'updated'], required: false } },
                {
                    model: model.Post, include: [{
                        model: model.Comments, attributes: {
                            exclude: ['created', 'updated'], required: false,

                        }
                    }], attributes: { exclude: ['created', 'updated'], required: false }
                }]

        }).then((result) => {
            if (result) {
                responseHandler.getSuccessResult(result, res);
            } else {
                responseHandler.getNotExistsResult(result, res)
            }
        }).catch(function (error) {
            var errorMessage = Utils.constructErrorMessage(error);
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    //Delete Specific Forum
    deleteForum(req, res) {
        let userInput = Utils.getReqValues(req);;
        //Validate Forum Object
        if (!userInput.forumId) {
            responseHandler.getErrorResult(resources.errors.noForumId, res);
            return false;
        }
        model.Forum.findOne({ where: { forumId: userInput.forumId, isPinned: true } }).then(function (forums) {
            if (forums) {
                responseHandler.getErrorResult('please unpin forum so that you can delete', res);
            } else {
                model.Forum.destroy({
                    where: { forumId: userInput.forumId }
                }).then(function (deletedForum, status) {
                    if (deletedForum) {
                        responseHandler.getSuccessResult(resources.labels.forumDelete, res);
                    } else {
                        responseHandler.getErrorResult(resources.errors.errorForumDelete, res);
                    }
                }).catch(function (err) {
                    let errorMessage = err;
                    if (err.errors) {
                        errorMessage = Utils.constructErrorMessage(err);
                    }
                    responseHandler.getErrorResult(errorMessage, res);
                });
            }
        });
    }
};