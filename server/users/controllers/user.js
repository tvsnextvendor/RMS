
const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const userJson = require('./../utils/userPermission.json');
const constant = require('./../utils/constant.json');
const Model = require('../models');
const _ = require('lodash');
// Require library
const xl = require('excel4node');
const path = require('path');
module.exports = {
    list(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let whereconditions = {};
        let resortconditions = {};
        let searchCondn = {};
        if (userInput.userId) {
            conditions['userId'] = userInput.userId;
        }
        if (userInput.createdBy) {
            conditions['createdBy'] = userInput.createdBy;
        }
        let limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        if (userInput.resortId) {
            resortconditions['resortId'] = userInput.resortId;
        }
        if (userInput.divisionId) {
            resortconditions['divisionId'] = userInput.divisionId;
        }
        if (userInput.departmentId) {
            resortconditions['departmentId'] = userInput.departmentId;
        }
        whereconditions['roleId'] = 4;
        if(userInput.reportingTo === '1'){
            conditions['accessSet'] = {$eq : 'FullAccess'};
            conditions['status'] = {$in : ['web','web/mobile','web/mobileAdmin']};
        }
        if (userInput.search) {
            let search = userInput.search;
            searchCondn = {
                $or: [
                    {
                        userName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        firstName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        lastName: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        employeeNo: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        '$ResortUserMappings.Division.divisionName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        '$ResortUserMappings.Department.departmentName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        '$ResortUserMappings.Designation.designationName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        '$UserRole.Role.roleName$': {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        phoneNumber: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        email: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    },
                    {
                        homeNumber: {
                            $iLike: "%" + (search ? search : "") + "%"
                        }
                    }
                ],
                $and: conditions
            };
        } else {
            searchCondn = conditions;
        }
        let uploadPath = Utils.uploadFilePaths();
        Model.User
            .findAndCountAll({
                where: searchCondn,
                attributes: [
                    'employeeNo',
                    'userName',
                    'firstName',
                    'lastName',
                    'email',
                    'phoneNumber',
                    'homeNumber',
                    'isDefault',
                    'active',
                    'employeeId',
                    'createdBy',
                    'userId',
                    'status',
                    'userImage',
                    'accessSet'
                ],
                include: [{
                    model: Model.UserRoleMapping, as: 'UserRole',
                    where: whereconditions,
                    include: [{ model: Model.Role, attributes: ['roleName'] }],
                },
                {
                    model: Model.ResortUserMapping,
                    include: [
                        { model: Model.Division, attributes: ['divisionId', 'divisionName'] },
                        { model: Model.Designation, attributes: ['designationId', 'designationName'] },
                        { model: Model.Department, attributes: ['departmentId', 'departmentName'] },
                    ],
                    where: resortconditions,

                },
                {
                    model: Model.User, as: 'reportDetails'
                },
                ],
                order: [
                    ['created', 'DESC']
                ],
                subQuery: false,
                offset: offset,
                limit: limit
            })
            .then((result) => {
                result['uploadPath'] = uploadPath;
                if (result.count > 0) {
                    return responsehandler.getSuccessResult(result, res);
                } else {
                    return responsehandler.getNotExistsResult(result, res);
                }
            })
            .catch(function (error) {
                let errorMessage = Utils.constructErrorMessage(error);
                return responsehandler.getErrorResult(errorMessage, res);
            });
    },
    //create user as per role
    async add(req, res) {
        let userInput = Utils.getReqValues(req);
        let response = await Utils.getMappingUserDatas(userInput, Model);
        userInput.status = userInput.accessTo;
        if (userInput.email) {
            let str = userInput.email;
            userInput.email = userInput.email.trim();
            userInput.email = str.toLowerCase();
        }
        Model.User.findOne({
            order: [
                ['userId', 'DESC'],
            ],
        }).then((userss) => {
            if (userss.employeeId) {
                let response = userss.employeeId.split("R");
                let num = JSON.parse(response[1]) + 1;
                userInput.employeeId = 'R' + num;
            } else {
                userInput.employeeId = 'R1000'
            }
            if (!userInput.resortId) {
                return responsehandler.getErrorResult('resort Id is mandatory', res);
            }
            userInput.UserRole = { roleId: constant.EmployeeRoleId };
            if (response.status === true) {
                userInput.ResortUserMapping = response.data;
            }
            delete userInput['departmentId'];
            delete userInput['designationId'];
            delete userInput['divisionId'];
            let resortCodn = {};
            resortCodn['resortId'] = userInput.resortId;
            let firstName = (userInput.firstName) ? userInput.firstName : userInput.userName;
            let lastName = userInput.lastName;
            Model.Resort.findOne({ where: resortCodn, attributes: ['resortId', 'resortName'] }).then(function (resort) {
                let resortName = resort.dataValues.resortName;

                // Old Code Setup modifications

                // let uniqueUserName = resortName + '-' + ((userInput.firstName) ? userInput.firstName : userInput.userName);
                // let randomNo = Math.floor(10 + Math.random() * 90);
                // uniqueUserName = uniqueUserName.replace(/\s/g, '') + randomNo;

                 // Old Code Setup modifications


                let uniqueUserName = ((userInput.firstName) ? userInput.firstName : userInput.userName);
                let randomNo = Math.floor(1000 + Math.random() * 9000);
                uniqueUserName = uniqueUserName.replace(/\s/g, '') + randomNo;
                userInput.userName = uniqueUserName.toLowerCase();
                Model.User.create(userInput, {
                    include: [
                        { model: Model.UserRoleMapping, as: 'UserRole' },
                    ]
                }).then((user) => {
                    if (user) {
                        let emails = [user.dataValues.email];
                        // let userName = user.dataValues.userName;
                        let setName = firstName + ' ' + lastName;
                        let message = 'Hi ' + setName + ',<br> Welcome To LMS , <br> Your user credentials are <br><br>User Name :' + user.dataValues.userName + '<br>Email Address : ' + user.dataValues.email + ' <br> password : 12345678';
                        let subject = 'LMS - Warm Welcome';
                        Utils.mailOptions(emails, message, subject);
                        userInput.ResortUserMapping.forEach(function (val, key) {
                            val.userId = user.dataValues.userId;
                        });
                        if (userInput.childResortIds && userInput.childResortIds.length > 0) {
                            let resortMapping = [];
                            userInput.childResortIds.forEach(function (resortVal, resortKey) {
                                let resortObject = {};
                                resortObject['resortId'] = resortVal;
                                resortObject['userId'] = user.dataValues.userId;
                                resortMapping.push(resortObject);
                            });
                            userInput.ResortUserMapping = userInput.ResortUserMapping.concat(resortMapping);
                        }
                        Model.ResortUserMapping.bulkCreate(userInput.ResortUserMapping, { individualHooks: true }).then(function (resortMappingResponse) {
                        });
                        let wherecondition = {};
                        wherecondition['resortId'] = userInput.resortId;
                        Model.ResortUserMapping.findAll({ attributes: ['userId'], where: wherecondition, group: ['userId'] }).then(function (usersCount) {
                            let totalOnlyUsersCount = parseInt(usersCount.length);// Remove N/A user or Peer User or Child Resort user.
                            let usersCountData = { 'totalNoOfUsers': totalOnlyUsersCount };
                            Model.Resort.update(usersCountData, { where: wherecondition });
                        });
                        if (user.isDefault) {
                            Model.UserRolePermission.create(user.dataValues)
                                .then((userpermission) => {
                                    var arr = userJson.mobileMenu;
                                    arr.map((element) => {
                                        return element.userRolePerid = userpermission.userRolePerid;
                                    });
                                    Model.UserPermission.bulkCreate(arr).then((userss) => {
                                        //  return responsehandler.getSuccessResult(userpermission, res);
                                    })
                                });
                        }
                        return responsehandler.getCreatedResult(user, res);
                    }

                }).catch(function (error) {
                    let errorMessage = Utils.constructErrorMessage(error);
                    return responsehandler.getErrorResult(errorMessage, res);
                });
            });
        }).catch(function (error) {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage, res);
        });
    },
    async update(req, res) {
        let Data = Utils.getReqValues(req);

        let userAssignedResponse = await Utils.getAssignedUsers(Data, Model);
        let userAssignedDatas;

        if(userAssignedResponse.status === true){
            userAssignedDatas = userAssignedResponse.result;
        }
        console.log("userAssignedDatas");
        console.log(userAssignedDatas);


        if (Data.departmentId) {
            let response = await Utils.getMappingUserDatas(Data, Model);
            if (response.status === true) {
                Data.ResortUserMapping = response.data;
            }
        } else {
            Data.ResortUserMapping = [];
        }
        if(userAssignedDatas === 'absent'){
            let resortMapIds = Data.resortUserMappingId;
            if (resortMapIds && resortMapIds.length > 0) {
                Model.ResortUserMapping.destroy({ where: { resortUserMappingId: resortMapIds } });
            }
        }
        
        if (Data.email) {
            let str = Data.email;
            Data.email = Data.email.trim();
            Data.email = str.toLowerCase();
        }
        if (Data.userName) {
            let str = Data.userName;
            Data.userName = str.toLowerCase();
        }
        Data.status = Data.accessTo;
        Model.User
            .findOne({
                where: {
                    userId: Data.userId
                }
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                Model.User.update(Data,
                    { where: { userId: Data.userId } })
                    .then((result) => {
                        Model.ResortUserMapping.findAll({
                            where: {
                                userId: Data.userId
                            }
                        }).then(function (resortmapsResult) {
                            let formResults = [];
                            resortmapsResult.forEach(function (mapval, mapKey) {
                                let formObj = {};
                                formObj['departmentId'] = mapval.dataValues.departmentId;
                                formObj['divisionId'] = mapval.dataValues.divisionId;
                                formObj['resortId'] = mapval.dataValues.resortId;
                                formObj['designationId'] = mapval.dataValues.designationId;
                                formResults.push(formObj);
                            });
                            let a = formResults;
                            let b = Data.ResortUserMapping;
                            if (a && b && a.length > 0 && b.length > 0) {
                                var onlyInA = a.filter(module.exports.comparer(b));
                                var onlyInB = b.filter(module.exports.comparer(a));
                                finalResult = onlyInA.concat(onlyInB);
                            } else {
                                finalResult = [];
                            }
                            if(userAssignedDatas == 'present'){
                                finalResult = [];
                            }
                            Model.User.findOne({ where: { userId: Data.userId } }).then(function (userupdated) {
                                let uploadPath = Utils.uploadFilePaths();
                                let userRes = {};
                                if (finalResult && finalResult.length > 0) {
                                    finalResult.forEach(function (val, key) {
                                        val.userId = Data.userId;
                                    });
                                    finalResult = _.uniqWith(finalResult, _.isEqual);
                                    Model.ResortUserMapping.bulkCreate(finalResult).then(function (resortMappingResponse) {
                                        if (req.query.active == 'true') {
                                            res.status(200).send({ "isSuccess": true, message: 'User is changed to Active successfully' });
                                        } else if (req.query.active == 'false') {
                                            res.status(200).send({ "isSuccess": true, message: 'User is changed to InActive successfully' });
                                        } else {
                                            userRes['user'] = userupdated;
                                            userRes['uploadPaths'] = uploadPath;
                                            if(userAssignedDatas == 'present'){
                                                userRes['message'] = "User updated successfully.Div,Depart Unchangeable user scheduled with courses/classes";
                                            }else{
                                                userRes['message'] = "User updated successfully";
                                            }
                                            return responsehandler.getSuccessResult(userRes, res);
                                        }
                                    });
                                } else {
                                    if (req.query.active == 'true') {
                                        res.status(200).send({ "isSuccess": true, message: 'User is changed to Active successfully' });
                                    } else if (req.query.active == 'false') {
                                        res.status(200).send({ "isSuccess": true, message: 'User is changed to InActive successfully' });
                                    } else {
                                        userRes['user'] = userupdated;
                                        userRes['uploadPaths'] = uploadPath;
                                        if(userAssignedDatas == 'present'){
                                            userRes['message'] = "User updated successfully. Div,Depart Unchangeable user scheduled with courses/classes";
                                        }else{
                                            userRes['message'] = "User updated successfully";
                                        }
                                        return responsehandler.getSuccessResult(userRes, res);
                                    }
                                }
                            });
                        });
                    }).catch((error) => {
                        var errorMessage = Utils.constructErrorMessage(error);
                        return responsehandler.getErrorResult(errorMessage, res);
                    });
            })
            .catch((error) => {
                return responsehandler.getErrorResult(error, res);
            })
    },
    //delete user
    delete(req, res) {
        let Data = Utils.getReqValues(req);
        let wherecondition = {};
        wherecondition['userId'] = Data.userId;
        let newcondn = {};
        newcondn['userId'] = Data.userId;
        Model.ResortUserMapping.findOne({ where: newcondn }).then(function (resortUsers) {
            let resortId = resortUsers.dataValues.resortId;
            let resortCodn = {};
            resortCodn['resortId'] = resortId;
            Model.Resort.findOne({ where: resortCodn }).then(function (resort) {
                let totalNoOfUsers = resort.dataValues.totalNoOfUsers - parseInt(1);
                Model.Resort.update({ 'totalNoOfUsers': totalNoOfUsers }, { where: resortCodn }).then(function (updateUser) {
                    Model.TrainingScheduleResorts.findAll({ where: wherecondition }).then(function (response) {
                        if (response.length === 0) {
                            return Model.User
                                .findOne({ where: wherecondition })
                                .then(user => {
                                    if (!user) {
                                        return res.status(400).send({
                                            message: 'User Not Found',
                                        });
                                    }
                                    return Model.User.destroy({ where: { userId: Data.userId } })
                                        .then(() => {
                                            res.status(200).send({ "isSuccess": true, message: 'User Deleted successfully' })
                                        })
                                        .catch((error) => res.status(400).send(error));
                                })
                                .catch((error) => res.status(400).send(error));
                        } else {
                            return responsehandler.getErrorResult("Users are assigned/scheduled with courses,Unable to delete user.", res);
                        }
                    });
                });
            });
        });
    },
    settings(req, res) {
        let Data = Utils.getReqValues(req);
        if (!Data.userId) {
            return responsehandler.getErrorResult("userId is mandatory", res);
        }
        else if (!Data.oldPassword) {
            return responsehandler.getErrorResult("oldPassword is mandatory", res);
        }
        else if (!Data.newPassword) {
            return responsehandler.getErrorResult("newPassword is mandatory", res);
        }
        else {
            let wherecondition = {};
            wherecondition['userId'] = Data.userId;
            let updateData = {};
            updateData.password = Utils.updatePassword(Data.newPassword);
            Model.User.findOne({ where: wherecondition }).then(function (valRes) {
                if (valRes) {
                    let autenticate = Utils.comparePassword(Data.oldPassword, valRes.dataValues.password);
                    if (autenticate) {
                        Model.User.update(updateData, { where: wherecondition }).then(function (newPassword) {
                            newPassword.message = "Password changed successfully";
                            return responsehandler.getSuccessResult(newPassword, res);
                        });
                    } else {
                        return responsehandler.getErrorResult("old password is wrong", res);
                    }
                } else {
                    return responsehandler.getErrorResult("userId is not found", res);
                }
            });
        }
    },
    comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return other.departmentId == current.departmentId && other.divisionId == current.divisionId && other.resortId == current.resortId && other.designationId == current.designationId
            }).length == 0;
        }
    },
    contentEmail(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if (!userInput.userId) {
            return responsehandler.getErrorResult("userId is mandatory", res);
        } else {
            let getAPIURL = Utils.getClientURL();
            let Port = Utils.getClientPort();
            conditions['userId'] = userInput.userId;
            Model.User.findOne({
                where: conditions
            }).then(function (result) {
                if (result) {
                    let subject = 'LMS - Upload Content';
                    let message = '<div>You are receiving this because you (or someone else) have requested the upload the content.Please connect web browser with below link to continue with same access login.<br><br>' +
                        getAPIURL;
                    let emails = [];
                    emails.push(result.dataValues.email);
                    Utils.mailOptions(emails, message, subject);
                    result['message'] = 'Email sent successfully to "' + result.dataValues.email + '"';
                    return responsehandler.getSuccessResult(result, res);
                } else {
                    let errorMessage = "Invalid User ID";
                    return responsehandler.getErrorResult(errorMessage, res);
                }
            });
        }
    },
    createXLS(req, res) {
        var wb = new xl.Workbook();
        // Add Worksheets to the workbook
        var ws = wb.addWorksheet('Sheet 1');

        // Create a reusable style
        var style = wb.createStyle({
            font: {
                bold: true,
                color: '#000000',
                size: 12,
            },
            //numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        // Headings Labels
        ws.cell(1, 1)
            .string("Emp ID")
            .style(style);
        ws.cell(1, 2)
            .string("firstName")
            .style(style);
        ws.cell(1, 3)
            .string("lastName")
            .style(style);
        ws.cell(1, 4)
            .string("email")
            .style(style);
        ws.cell(1, 5)
            .string("phoneNumber")
            .style(style);
        ws.cell(1, 6)
            .string("homeNumber")
            .style(style);
        // Second line for example values
        ws.cell(2, 1)
            .string("1000")
            .style(style);
        ws.cell(2, 2)
            .string("abcde")
            .style(style);
        ws.cell(2, 3)
            .string("fghij")
            .style(style);
        ws.cell(2, 4)
            .string("abcde@gmail.com")
            .style(style);
        ws.cell(2, 5)
            .string("916587655567")
            .style(style);
        ws.cell(2, 6)
            .string("916387655527")
            .style(style);
        const filePath = path.join(__dirname, '/../views/lms-usertemplate.xlsx');
        wb.write(filePath, function (err, stats) {
            if (err) {
                console.error(err);
                let errorMessage = err;
                return responsehandler.getErrorResult(errorMessage, res);
            } else {
                console.log(stats);// Prints out an instance of a node.js fs.Stats object
                const filePath = path.join(__dirname, '/../views/lms-usertemplate.xlsx');
                console.log(filePath);
                const file = `${__dirname}/../views/lms-usertemplate.xlsx`;
                console.log(file);
                res.download(filePath); // Set disposition and send it.
            }
        });

    },
    async createExcelTemplate(req, res) {
        let userInput = Utils.getReqValues(req);
        let result = await Utils.getAllDropDowns(userInput, Model);
        let divisions;
        let departments;
        let designations;
        if (result.status === true) {
            divisions = result.data.divisions;
            departments = result.data.departments;
            designations = result.data.designations;
        }
        if (divisions.length > 0 && departments.length > 0 && designations.length > 0) {
            let divSet = [];
            let divValues;
            if (divisions.length > 0) {
                divisions.forEach(function (value, key) {
                    let divString = value.dataValues.divisionId + '~' + value.dataValues.divisionName;
                    divSet.push(divString);
                });
                divValues = divSet.join(',');
            }
            let departSet = [];
            let departValues;
            if (departments.length > 0) {
                departments.forEach(function (value, key) {
                    let departString = value.dataValues.departmentId + '~' + value.dataValues.departmentName;
                    departSet.push(departString);
                });
                departValues = departSet.join(',');
            }

            let designationSet = [];
            let designationValues;
            if (designations.length > 0) {
                designations.forEach(function (value, key) {
                    let desiString = value.dataValues.designationId + '~' + value.dataValues.designationName;
                    designationSet.push(desiString);
                });
                designationValues = designationSet.join(',');
            }


            // return false;

            var wb = new xl.Workbook();
            // Add Worksheets to the workbook
            var ws = wb.addWorksheet('Sheet 1');
            var ws2 = wb.addWorksheet('Sheet 2');
            // Create a reusable style
            var style = wb.createStyle({
                font: {
                    bold: true,
                    color: '#000000',
                    size: 12,
                },
                //numberFormat: '$#,##0.00; ($#,##0.00); -',
            });
            // Headings Labels
            ws.cell(1, 1)
                .string("employeeNo")
                .style(style);
            ws.cell(1, 2)
                .string("userName")
                .style(style);
            ws.cell(1, 3)
                .string("lastName")
                .style(style);
            ws.cell(1, 4)
                .string("email")
                .style(style);
            ws.cell(1, 5)
                .string("phoneNumber")
                .style(style);
            ws.cell(1, 6)
                .string("accessTo")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'F2:F100',
                formulas: ['web,web/mobile,mobile'],
            });

            // Divisions
            ws.cell(1, 7)
                .string("divisionId1")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'G2:G100',
                formulas: [divValues],
            });

            ws.cell(1, 8)
                .string("divisionId2")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'H2:H100',
                formulas: [divValues],
            });

            ws.cell(1, 9)
                .string("divisionId3")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'I2:I100',
                formulas: [divValues],
            });

            ws.cell(1, 10)
                .string("divisionId4")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'J2:J100',
                formulas: [divValues],
            });

            ws.cell(1, 11)
                .string("divisionId5")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'K2:K100',
                formulas: [divValues],
            });

            // Departments

            ws.cell(1, 12)
                .string("departmentId1")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'L2:L100',
                formulas: [departValues],
            });
            ws.cell(1, 13)
                .string("departmentId2")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'M2:M100',
                formulas: [departValues],
            });
            ws.cell(1, 14)
                .string("departmentId3")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'N2:N100',
                formulas: [departValues],
            });
            ws.cell(1, 15)
                .string("departmentId4")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'O2:O100',
                formulas: [departValues],
            });
            ws.cell(1, 16)
                .string("departmentId5")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'P2:P100',
                formulas: [departValues],
            });
            // Designations
            ws.cell(1, 17)
                .string("designationId1")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'Q2:Q100',
                formulas: [designationValues],
            });
            ws.cell(1, 18)
                .string("designationId2")
                .style(style);
            ws.addDataValidation({
                type: 'list',
                allowBlank: true,
                prompt: 'Choose from dropdown',
                error: 'Invalid choice was chosen',
                showDropDown: true,
                sqref: 'R2:R100',
                formulas: [designationValues],
            });
            // Second line for example values
            ws.cell(2, 1)
                .string("1000")
                .style(style);
            ws.cell(2, 2)
                .string("abcde")
                .style(style);
            ws.cell(2, 3)
                .string("fghij")
                .style(style);
            ws.cell(2, 4)
                .string("abcde@gmail.com")
                .style(style);
            ws.cell(2, 5)
                .string("916587655567")
                .style(style);
            const filePath = path.join(__dirname, '/../views/lms-usertemplate.xlsx');
            wb.write(filePath, function (err, stats) {
                if (err) {
                    console.error(err);
                    let errorMessage = err;
                    return responsehandler.getErrorResult(errorMessage, res);
                } else {
                    console.log(stats);// Prints out an instance of a node.js fs.Stats object
                    const filePath = path.join(__dirname, '/../views/lms-usertemplate.xlsx');
                    console.log(filePath);
                    const file = `${__dirname}/../views/lms-usertemplate.xlsx`;
                    console.log(file);
                    res.download(filePath); // Set disposition and send it.
                }
            });
        } else {
            let errorMessage = "Departments or Divisions or Designations are empty, Please add and continue download excel template";
            return responsehandler.getErrorResult(errorMessage, res);
        }
    },
    getResortMappings(req, res) {
        let userInput = Utils.getReqValues(req);
        let resortCodn = {};
        if (userInput.userId) {
            resortCodn['userId'] = userInput.userId;
        }
        Model.ResortUserMapping.findAll({
            where: resortCodn,
            attributes: ['resortId'],
            group: ['resortId']
        }).then(function (resorts) {
            return responsehandler.getSuccessResult(resorts, res);
        });
    }
};