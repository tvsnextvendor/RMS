const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models');
const sequelize = require('sequelize');
const async = require('async');
const _ = require('lodash');

module.exports = {
    addCertificate(req, res) {
        var userInput = Utils.getReqValues(req);
        if (!userInput.certificateName) {
            return responsehandler.getErrorResult("certificateName is required", res);
        }
        else if (!userInput.resortId) {
            return responsehandler.getErrorResult("resortId is required", res);
        }
        else if (!userInput.certificateHtml) {
            return responsehandler.getErrorResult("certificateHtml is required", res);
        }
        else if (!userInput.certificateHtmlPath) {
            return responsehandler.getErrorResult("certificateHtmlPath is required", res);
        }
        else {
            Model.Certificate.create(userInput).then(function (response) {
                responsehandler.getSuccessResult("Certificate created successFully", res);
            }).catch(function (err) {
                let errorMessage = Utils.constructErrorMessage(err);
                return responsehandler.getErrorResult(errorMessage, res);
            });
        }
    },
    getCertificate(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (userInput.certificateId) {
            conditions['certificateId'] = userInput.certificateId;
        }
        if (userInput.resortId) {
            conditions['resortId'] = userInput.resortId;
        }
        Model.Certificate.findAll({ where: conditions, include: [{ model: Model.CertificateMapping }] }).then(function (certificates) {
            if (certificates.length > 0) {
                let uploadPaths = Utils.uploadFilePaths();
                uploadPaths;
                let resp = { "certificates": certificates, "path": uploadPaths }
                responsehandler.getSuccessResult(resp, res);
            } else {
                return responsehandler.getNotExistsResult(certificates, res);
            }
        });
    },
    courseCertificateAssign(req, res) {
        let userInput = Utils.getReqValues(req);
        let newDetails = [];
        let updatedData = [];
        userInput.certificateCourses.forEach(function (item, key) {
            item.table = "CertificateMapping";
            if (!item.certificateMappingId) {
                newDetails.push(item);
            } else {
                updatedData.push(item);
            }
        });
        if (userInput.removeCertificateIds) {
            Model.CertificateMapping.destroy({
                where: { certificateMappingId: userInput.removeCertificateIds }
            });
        }
        async.waterfall(
            [
                function (callback) {
                    Model.CertificateMapping.bulkCreate(newDetails, { individualHooks: true }).then(function (certificateMapRes) {
                        callback(null, certificateMapRes);
                    }).catch(function (err) {
                        let errorMessage = err;
                        if (err.errors) {
                            errorMessage = Utils.constructErrorMessage(err);
                        }
                        responsehandler.getErrorResult(errorMessage, res);
                    });
                },
                function (arg1, callback) {
                    if (updatedData.length > 0) {
                        sequelize.Promise.map(updatedData, function (
                            itemToUpdate
                        ) {
                            let Id = "certificateMappingId";
                            let conditions = {};
                            conditions[Id] = itemToUpdate[Id];
                            Model.CertificateMapping.update(itemToUpdate, {
                                where: conditions,
                            }).then(function (users) {

                            })
                        });
                        callback(null, arg1);
                    } else {
                        callback(null, arg1);
                    }
                }
            ],
            function (err, caption, arg1) {
                responsehandler.getSuccessResult('Created or Updated Successfully', res);
            }
        );
    },

    CourseAssign(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (!userInput.resortId) {
            return responsehandler.getErrorResult('resortId is mandatory', res);
        } else {
            conditions['resortId'] = userInput.resortId;
        }
        Model.CertificateMapping.findAll({
            include: [{ model: Model.Certificate, where: conditions, attributes: [] }]
        }).then((courses) => {
            responsehandler.getSuccessResult(courses, res);
        });
    },
    update(req, res) {
        let Data = Utils.getReqValues(req);
        Model.Certificate
            .findOne({
                where: {
                    certificateId: Data.certificateId
                }
            })
            .then(cert => {
                if (!cert) {
                    return res.status(400).send({
                        message: 'Certificate Not Found',
                    });
                }
                Model.Certificate.update(Data, { where: { certificateId: Data.certificateId } })
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
    deleteCertificate(req, res) {
        let userInput = Utils.getReqValues(req);
        return Model.Certificate
            .findOne({ where: { certificateId: userInput.certificateId } })
            .then(certificate => {
                if (!certificate) {
                    return res.status(400).send({
                        "isSucess": false,
                        message: 'Certificate Not Found',
                    });
                }
                return Model.Certificate
                    .destroy({ where: { certificateId: userInput.certificateId } })
                    .then(() => res.status(200).send({ "isSuccess": true, message: 'Certificate deleted successfully' }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    getUserCertificates(req, res) {
        let userInput = Utils.getReqValues(req);
        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        let conditions = {};
        if (!userInput.userId) {
            return responsehandler.getErrorResult('userId is mandatory', res);
        } else {
            conditions['userId'] = userInput.userId;
        }
        let badgeCodn = {};
        let required = false;
        if (userInput.badge) {
            badgeCodn['badgeId'] = { $ne: null };
            required = true;
        }
     //   conditions['certificateGenerated'] = {$ne : null};
        Model.CertificateUserMapping.findAndCountAll({
            where: conditions,
            include: [{
                model: Model.Badges,
                attributes: ['badgeName', 'percentage'],
                where: badgeCodn,
                required: required
            },
            { model: Model.Course, attributes: ['courseName'] },
            { model: Model.TrainingClass, attributes: ['trainingClassName'] }
            ],
            order: [['created', 'DESC']],
            limit: limit,
            offset: offset
        }).then(function (certificates) {
            responsehandler.getSuccessResult(certificates, res);
        }).catch((error) => res.status(400).send(error));
    }
}