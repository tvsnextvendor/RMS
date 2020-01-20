const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const config = require('./../config/configuration');
const Model = require('../models');
module.exports = {
    login(req, res) {
        let userInput = Utils.getReqValues(req);
        let token = module.exports.createToken(userInput);
        if (!userInput.emailAddress && !userInput.userName) {
            return responsehandler.getErrorResult('Email address or User Name  is mandatory', res);
        }
        else if (!userInput.password) {
            return responsehandler.getErrorResult('Password is mandatory', res);
        }
        else {
            if(userInput.emailAddress){
                userInput.emailAddress = userInput.emailAddress.trim();
            }
            if(userInput.userName){
                userInput.userName     = userInput.userName.trim();
            }
            let whereCondn = {};
            let resortCond = {};
            let cond = {};
            cond['active'] = true;
            let Message;
            if (userInput.emailAddress) {
                let str = userInput.emailAddress;
                userInput.emailAddress = str.toLowerCase();
                whereCondn['email'] = userInput.emailAddress;
                cond['email'] = userInput.emailAddress;
                Message = 'Invalid Email Address';
            }
            if (userInput.userName) {
                let str = userInput.userName;
                userInput.userName = str.toLowerCase();
                whereCondn['userName'] = userInput.userName;
                cond['userName'] = userInput.userName;
                Message = 'Invalid Username';
            }
            if (userInput.emailAddress || userInput.userName) { 
                Model.User.findOne({ where: whereCondn }).then(function (emails) {
                    if (!emails) {
                        return responsehandler.getErrorResult(Message, res);
                    }
                })
            }
            Model.User.findOne({ where: cond }).then((usersss) => {
                if (!usersss) {
                    return responsehandler.getErrorResult('user is inactive', res);
                }
            });
            Model.User.findOne({
                where: whereCondn,
                include: [{
                    model: Model.UserRoleMapping, as: 'UserRole'
                },
                {
                    model: Model.ResortUserMapping,
                    include: [
                        { model: Model.Resort, where: resortCond, attributes: ['resortId', 'resortName', 'status', 'parentId'] },
                        { model: Model.Division }, { model: Model.Designation }, { model: Model.Department }
                    ]
                },
                ],
            }).then(function (result) {
                if (result) {
                    if (result.agreeTerms == false && !userInput.agreeTerms) {
                        return responsehandler.getErrorResult('Check Agree Terms To Continue', res);
                    } else if (result.agreeTerms == false && userInput.agreeTerms == true) {
                        let updateUserTerms = { "agreeTerms": true };
                        let whereUser = { "userId": result.userId };
                        Model.User.update(updateUserTerms, { where: whereUser });
                    }
                    let authenticate = bcrypt.compareSync(userInput.password, result.password);
                    if (!authenticate) {
                        return responsehandler.getErrorResult("Invalid Password", res);
                    } else {
                        let user = {};
                        user = result.dataValues;
                        let statusCheck = user.status;
                        if (statusCheck === 'mobileAdmin') {
                            statusCheck = 'mobile';
                        }
                        let uploadPath = Utils.uploadFilePaths();
                        user['uploadPaths'] = uploadPath;
                        if (user.ResortUserMappings.length > 0) {
                            if (user.ResortUserMappings[0].Resort && user.ResortUserMappings[0].Resort.status === 'InActive') {
                                return responsehandler.getErrorResult('Resort is Inactive', res);
                            } else if (user.ResortUserMappings[0].Resort && user.ResortUserMappings[0].Resort.status === 'Expired') {
                                return responsehandler.getErrorResult('Resort is Expired', res);
                            }
                            let designations = [];
                            user.ResortUserMappings.forEach(function (val, key) {
                                designations.push(val.designationId)
                            });
                            let designationCondn = {};
                            designationCondn['designationId'] = { $in: designations };
                            Model.UserRolePermission.findAll({
                                where: designationCondn,
                                attributes: ['resortId', 'designationId', 'web', 'mobile'],
                                include: [{
                                    model: Model.UserPermission,
                                    as: 'userPermission',
                                    attributes: ['moduleName', 'view', 'upload', 'edit', 'delete']
                                }]

                            }).then(function (rolePerm) {
                                user['rolePermissions'] = rolePerm;

                                if (user.status !== 'web/mobile' && user.status !== 'web/mobileAdmin') {
                                    // Only for web or mobile check below condition
                                    if (statusCheck == userInput.type) {
                                        user = Object.assign({ 'token': token }, user);
                                        return responsehandler.getSuccessResult(user, res);
                                    } else {
                                        return responsehandler.getErrorResult('No access to login', res);
                                    }
                                } else {
                                    user = Object.assign({ 'token': token }, user);
                                    return responsehandler.getSuccessResult(user, res);
                                }
                            });
                        } else {
                            if (user.status !== 'web/mobile' && user.status !== 'web/mobileAdmin') {
                                // Only for web or mobile check below condition
                                if (statusCheck == userInput.type) {
                                    let uploadPath = Utils.uploadFilePaths();
                                    user['uploadPaths'] = uploadPath;
                                    user = Object.assign({ 'token': token }, user);
                                    return responsehandler.getSuccessResult(user, res);
                                } else {
                                    return responsehandler.getErrorResult('No access to login', res);
                                }
                            } else {
                                user = Object.assign({ 'token': token }, user);
                                return responsehandler.getSuccessResult(user, res);
                            }
                        }
                    }
                } else {
                    return responsehandler.getErrorResult("unable to login", res);
                }
            }).catch(function (error) {
                var errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
        }
    },
    createToken(data) {
        let token = jwt.sign({ u: data.username }, config.SECRET_KEY, {
            expiresIn: config.TOKEN_LIFE
        });
        token = token.replace(/\./g, "ar4Jq1V");
        return token;
    },
    register(req, res) {
        let userInput = Utils.getReqValues(req);
        Model.User.findOne({
            order: [
                ['userId', 'DESC'],
            ],
        }).then((userss) => {
            if (userss && userss.employeeId) {
                let response = userss.employeeId.split("R");
                let num = JSON.parse(response[1]) + 1;
                userInput.employeeId = 'R' + num;
            } else {
                userInput.employeeId = 'R1000'
            }
            userInput.UserRole = { roleId: userInput.roleId };
            Model.User
                .create(userInput, {
                    include: [
                        { model: Model.UserRoleMapping, as: 'UserRole' }
                    ]
                }).then((user) => {
                    if (user) {
                        return responsehandler.getCreatedResult(user, res);
                    }
                })
                .catch(function (error) {
                    let errorMessage = Utils.constructErrorMessage(error);
                    return responsehandler.getErrorResult(errorMessage, res);
                });
        });
    },
    mobileforgetPassword(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.emailAddress) {
            return responsehandler.getErrorResult("Email address is required", res);
        } else if (!userInput.phoneNumber) {
            return responsehandler.getErrorResult("Phone no. is required", res);
        } else {
            let passwordGenerated = Utils.generatePassword(8);
            let passwordGeneratedHash = Utils.updatePassword(passwordGenerated);
            let whereCondn = {};
            whereCondn['email'] = userInput.emailAddress;
            let phoneCondn = {};
            phoneCondn['phoneNumber'] = userInput.phoneNumber;
            Model.User.findOne({
                where: whereCondn
            }).then(function (result) {
                if (result) {
                    Model.User.update({ 'password': passwordGeneratedHash }, { where: whereCondn }).then(function (updateResponse) {
                        if (updateResponse) {
                            let subject = 'LMS APP - Forget Password:';
                            let message = '<div>You are receiving this because you (or someone else) have requested the reset of the password for your account.<br><br>' +
                                'Your current reseted password is ' + passwordGenerated;
                            let emails = [];
                            emails.push(userInput.emailAddress);
                            Utils.mailOptions(emails, message, subject);
                            updateResponse['message'] = "Password has been sent to your email ID";
                            return responsehandler.getSuccessResult(updateResponse, res);
                        }
                    });
                } else {
                    let errorMessage = "Invalid Email Address";
                    return responsehandler.getErrorResult(errorMessage, res);
                }
            });
        }
    },
    forgetPassword(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.emailAddress) {
            return responsehandler.getErrorResult("Email address is required", res);
        }
        else {
            let getClientURL = Utils.getClientURL();

            Model.User.findOne({
                where: {
                    email: userInput.emailAddress,
                }
            }).then(function (result) {
                if (result) {
                    let subject = 'LMS APP - Forget Password:';
                    let message = '<div>You are receiving this because you (or someone else) have requested the reset of the password for your account.<br><br>' +
                        'Please click on the following link, or paste this into your browser to complete the process:<br><br>' +
                        getClientURL + '/resetpassword/' + result.dataValues.userId + '<br><br>' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.<br><br></div>';
                    let emails = [];
                    emails.push(userInput.emailAddress);
                    Utils.mailOptions(emails, message, subject);
                    result['message'] = "Password reset link has been sent to your email ID";
                    return responsehandler.getSuccessResult(result, res);
                } else {
                    let errorMessage = "Invalid Email Address";
                    return responsehandler.getErrorResult(errorMessage, res);
                }
            });
        }
    },
    resetpassword(req, res) {
        let userInput = Utils.getReqValues(req);
        if (!userInput.userId) {
            return responsehandler.getErrorResult("userId is required", res);
        } else if (!userInput.password) {
            return responsehandler.getErrorResult("password is required", res);
        } else {
            let whereCondn = {};
            whereCondn['userId'] = userInput.userId;
            let userPassword = {};
            userInput.password = Utils.updatePassword(userInput.password);
            userPassword['password'] = userInput.password;
            Model.User.findOne({ where: whereCondn }).then(function (response) {
                if (response) {
                    Model.User.update(userPassword, { where: whereCondn }).then(function (result) {
                        result['message'] = "Password changed successfully";
                        return responsehandler.getSuccessResult(result, res);
                    });
                } else {
                    let errorMessage = "Invalid userId";
                    return responsehandler.getErrorResult(errorMessage, res);
                }
            });
        }
    }
};