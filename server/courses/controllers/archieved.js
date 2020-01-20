const Archieved = require("../models").Archieved;
const Resort = require("../models").Resort;
const Utils = require("./../utils/Utils");
const responseHandler = require("./../utils/responseHandler");
module.exports = {
    createArchieved(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.resortId) {
            responseHandler.getErrorResult('resortId is mandatory', res);
            return false;
        }
        if (!userInput.archievedDays) {
            responseHandler.getErrorResult('archievedDays is mandatory', res);
            return false;
        }
        // if (!userInput.deletedDays) {
        //     responseHandler.getErrorResult('deletedDays is mandatory', res);
        //     return false;
        // }
        Archieved.create(userInput).then((newArchieved) => {
            if (newArchieved) {
                responseHandler.getSuccessResult(
                    newArchieved,
                    "Archieved added successfully",
                    res
                );
            } else {
                responseHandler.getErrorResult('unable to add archieved', res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    //Update Specific archieved
    updateArchieved(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.archievedId) {
            responseHandler.getErrorResult('archieved id is mandatory', res);
            return false;
        }
        Archieved.update(userInput, {
            where: { archievedId: userInput.archievedId }
        }).then(function (updatedArchieved) {
            if (updatedArchieved && updatedArchieved[0]) {
                responseHandler.getSuccessResult(
                    updatedArchieved,
                    "Archieved updated successfully",
                    res
                );
            } else {
                responseHandler.getErrorResult('unable to update archieved settings', res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    //Delete Specific Archieved in a Forum
    deleteArchieved(req, res) {
        let userInput = Utils.getReqValues(req);;
        if (!userInput.archievedId) {
            responseHandler.getErrorResult('archievedId is mandatory', res);
            return false;
        }
        Archieved.destroy({
            where: { archievedId: userInput.archievedId }
        }).then(function (deletedArchieved, status) {
            if (deletedArchieved) {
                res.status(200).send({ "isSuccess": true, message: 'archieved deleted successfully' });
            } else {
                responseHandler.getErrorResult('unable to delete archieved', res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    getArchieved(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (userInput.archievedId) {
            conditions['archievedId'] = userInput.archievedId;
        }
        if (userInput.resortId) {
            conditions['resortId'] = userInput.resortId;
        }
        if (userInput.type) {
            conditions['type'] = userInput.type;
        }
        Archieved.findAndCountAll({
            where: conditions,
            include: [{ model: Resort, attributes: ['resortId', 'resortName'] }],
            order: [['created', 'ASC']]
        }).then(function (archievedRes) {
            responseHandler.getSuccessResult(
                archievedRes,
                "Archieved listed successfully",
                res
            );
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    }
}