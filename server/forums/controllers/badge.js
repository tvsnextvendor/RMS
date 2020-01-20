const model = require('../models');
let Utils = require('./../utils/Utils');
let responseHandler = require('./../utils/responseHandler');
const resources = require('./../utils/constant.json');
const settings = require('../config/configuration');
const Model = require('../models/');
const Sequelize = require('sequelize');
module.exports = {
    createBadge(req, res) {
        let userInput = Utils.getReqValues(req);
        let badgeUpdate = [];
        let badgeCreate = [];
        if (userInput.badges) {
            userInput.badges.forEach(function (item) {
                item.table = "Badges";
                if (item.badgeId) {
                    badgeUpdate.push(item);
                } else {
                    badgeCreate.push(item);
                }
            });
        }
        console.log("badgeUpdate");
        console.log(badgeUpdate);
        console.log("badgeCreate");
        console.log(badgeCreate);
        return Model.Sequelize
            .transaction(function (t) {
                return Sequelize.Promise.map(badgeUpdate, function (
                    itemToUpdate
                ) {
                    let Id = "badgeId";
                    let conditions = {};
                    conditions[Id] = itemToUpdate[Id];
                    return Model[itemToUpdate.table].update(itemToUpdate, {
                        where: conditions,
                        transaction: t
                    });
                }).then(function (updatedResult) {
                    if (badgeCreate && badgeCreate.length > 0) {
                        return Model.Badges.bulkCreate(
                            badgeCreate,
                            { transaction: t }

                        ).then(function (addedResult) {
                            responseHandler.getSuccessResult("created successfully", res);
                        }, function (err) {
                            let errorMessage = Utils.constructErrorMessage(err);
                            return responseHandler.getErrorResult(errorMessage, res);
                        }).catch(function (err) {
                            let errorMessage = Utils.constructErrorMessage(err);
                            return responseHandler.getErrorResult(errorMessage, res);
                        });
                    } else {
                        responseHandler.getSuccessResult("saved successfully", res);
                    }
                });
            });
    },

    //Update Specific Comment in a Post
    updateBadge(req, res) {
        let userInput = Utils.getReqValues(req);
        //Validate Comment Object
        if (!userInput.badgeId) {
            responseHandler.getErrorResult("Badge Id is mandatory", res);
            return false;
        }

        model.Badges.update(userInput, {
            where: { badgeId: userInput.badgeId }
        }).then(function (updatedBadge) {
            if (updatedBadge && updatedBadge[0]) {
                responseHandler.getSuccessResult('Badge updated successfully', res);
            } else {
                responseHandler.getErrorResult('Unable to update badge', res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    deleteBadge(req, res) {
        let userInput = Utils.getReqValues(req);
        //Validate Comment Object
        if (!userInput.badgeId) {
            responseHandler.getErrorResult('badge od is mandatory', res);
            return false;
        }
        model.Badges.destroy({
            where: { badgeId: userInput.badgeId }
        }).then(function (deletedBadge, status) {
            if (deletedBadge) {
                responseHandler.getSuccessResult('Badge deleted successfully', res);
            } else {
                responseHandler.getErrorResult('unable to delete badge', res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    getBadge(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (userInput.badgeId) {
            conditions['badgeId'] = userInput.badgeId;
        }
        if (userInput.resortId) {
            conditions['resortId'] = userInput.resortId;
        }
        model.Badges.findAll({ where: conditions }).then(function (badges) {
            if (badges.length > 0) {
                responseHandler.getSuccessResult(badges, res);
            } else {
                return responseHandler.getNotExistsResult(badges, res);
            }
        })
    }
};