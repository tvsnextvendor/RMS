const _ = require('lodash');
const bcrypt = require('bcrypt');
const fs = require('fs');
const saltRounds = 10;
const settings = require('../config/configuration');
const path = require('path');
const async = require('async');
const nodemailer = require('nodemailer');
const CONFIG = require('../config/configuration');
module.exports = {
    constructErrorMessage(error) {
        var errMessage = '';
        if (error.message) {
            errMessage = error.message;
        }
        if (error.errors && error.errors.length > 0) {
            errMessage = error.errors.map(function (err) {
                return err.message;
            }).join(',\n');
        }
        return errMessage;
    },
    getReqValues(req) {
        return _.pickBy(_.extend(req.body, req.params, req.query), _.identity);
    },
    getAPIPort() {
        return CONFIG.API_PORT;
    },
    password(user) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(user.password, salt);
        return hash;
    },
    updatePassword(pass) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pass, salt);
        return hash;
    },
    comparePassword(pw, hash) {
        let pass = bcrypt.compareSync(pw, hash);
        return pass;
    },
    uploadFilePath(filename) {
        let basePath = settings.SITE_URL + ':' + settings.SERVER_PORT;
        let uploadFilePaths = {};
        uploadFilePaths['uploadPath'] = basePath + '/uploads/' + filename[0].filename;
        return uploadFilePaths;
    },
    uploadFilePaths() {
        let basePath = settings.SITE_URL + ':' + settings.SERVER_PORT;
        let uploadFilePaths = {};
        uploadFilePaths['uploadPath'] = basePath + '/uploads/';
        return uploadFilePaths;
    },
    getNotifications: function (notify) {
        return new Promise(resolve => {
            try {
                const filePath = path.join(__dirname, 'notifications.json');
                fs.readFile(filePath, 'utf8', (err, res) => {
                    if (err) {
                        resolve({ status: false, message: err });
                    } else {
                        let notifyInfo = JSON.parse(res);
                        resolve({ status: true, data: notifyInfo[notify] });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getDefaultTemplate: function () {
        return new Promise(resolve => {
            try {
                const filePath = path.join(__dirname, 'default-certificate.html');
                fs.readFile(filePath, 'utf8', (err, res) => {
                    if (err) {
                        resolve({ status: false, message: err });
                    } else {
                        resolve({ status: true, data: res });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getMappingResortDatas: function (resortArray, Model) {
        let resortId = resortArray.resortId;
        // let divisionIds   = resortArray.divisionId;
        // let departmentIds = resortArray.departmentId;
        let employeeIds = resortArray.userId;
        let status = resortArray.status;
        return new Promise(resolve => {
            try {
                if (employeeIds.length > 0) {
                    let whereCondn = {};
                    whereCondn['userId'] = employeeIds;
                    Model.ResortUserMapping.findAll({ where: whereCondn }).then(function (valRes) {
                        if (valRes.length > 0) {
                            let resortTree = [];
                            valRes.forEach(function (val, key) {
                                if (val.dataValues.departmentId && val.dataValues.divisionId) {
                                    let newObj = {};
                                    newObj['departmentId'] = val.dataValues.departmentId;
                                    newObj['divisionId'] = val.dataValues.divisionId;
                                    newObj['userId'] = val.dataValues.userId;
                                    newObj['resortId'] = resortId;
                                    resortTree.push(newObj);
                                }
                            });
                            resolve({ status: true, data: resortTree });
                        } else {
                            resolve({ status: false, data: [] });
                        }
                    });
                }
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getFileRestrictions: function (userInput, Model) {
        let filePermissionCondn = {};
        if (userInput.resortId) {
            filePermissionCondn['resortId'] = userInput.resortId;
        }
        if (userInput.userId) {
            filePermissionCondn['userId'] = userInput.userId;
        }
        filePermissionCondn['filePermissionType'] = 'Restricted';
        return new Promise(resolve => {
            try {
                Model.FilePermission.findAll({ where: filePermissionCondn, attributes: ['fileId'] }).then(function (response) {
                    resolve({ status: true, data: response });
                });

            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getChildResorts: function (userInput, Model) {
        let resortCond = {};
        let childCodn = {};
        if (userInput.resortId) {
            resortCond['parentId'] = userInput.resortId;// get Kids 
            childCodn['resortId'] = userInput.resortId;// get mother 
            childCodn['parentId'] = { $ne: null };
        }
        let childResorts = [];
        return new Promise(resolve => {
            try {
                Model.Resort.findAll({ where: resortCond, attributes: ['resortId', 'parentId', 'resortName'] }).then(function (response) {
                    if (response.length > 0) {
                        // For Parent Resort show that group
                        response.forEach(function (val, key) {
                            childResorts.push(val.dataValues.resortId);
                        });
                        resolve({ status: true, data: childResorts });
                    }
                    else {
                        // For Child Resort show parent as too
                        Model.Resort.findAll({ where: childCodn, attributes: ['resortId', 'parentId', 'resortName'] }).then(function (parent) {
                            if (parent.length > 0) {
                                childResorts.push(parent[0].dataValues.parentId);
                                resolve({ status: true, data: childResorts });
                            } else {
                                resolve({ status: false, data: childResorts });
                            }
                        });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getParticularDivUsers(userInput, Model) {
        let divCodn = {};
        if (userInput.divisionId) {
            divCodn['divisionId'] = userInput.divisionId;
        }
        if (userInput.resortId) {
            divCodn['resortId'] = userInput.resortId;
        }
        return new Promise(resolve => {
            try {
                Model.ResortUserMapping.findAll({ where: divCodn, attributes: ['divisionId', 'userId'] }).then(function (divisionUsers) {
                    let userSetId = [];
                    if (divisionUsers) {
                        divisionUsers.forEach(function (divVal, divKey) {
                            userSetId.push(divVal.dataValues.userId);
                        });
                    }
                    resolve({ status: true, data: userSetId });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
   
    checkScheduledCourses(userInput, Model) {
        let scheduleCodn = {};
        if (userInput.courseId) {
            scheduleCodn['courseId'] = userInput.courseId;
        }
        if (userInput.resortId) {
            scheduleCodn['resortId'] = userInput.resortId;
        }
        scheduleCodn['status'] = { $in: ['inProgress', 'completed'] };
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleResorts.findAll({ where: scheduleCodn, attributes: ['trainingClassId', 'userId', 'status'] }).then(function (scheduleSets) {
                    console.log(scheduleSets);
                    if (scheduleSets && scheduleSets.length > 0) {
                        resolve({ status: true, data: scheduleSets });
                    } else {
                        resolve({ status: false, data: [] });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    checkCourseAssigned(userInput, Model) {
        let classCodn = {};
        if (userInput.fileId) {
            classCodn['fileId'] = userInput.fileId;
        }
        if (userInput.resortId) {
            classCodn['resortId'] = userInput.resortId;
        }
        //classCodn['isDeleted'] = false;
        classCodn['courseId'] = { $ne: null };
        classCodn['trainingClassId'] = { $ne: null };
        console.log(classCodn);

        return new Promise(resolve => {
            try {
                Model.FileMapping.findAll({ where: classCodn, attributes: ['trainingClassId', 'courseId', 'fileId'] }).then(function (files) {
                    console.log(files);
                    if (files && files.length > 0) {
                        resolve({ status: false, data: files });
                    } else {
                        resolve({ status: true, data: [] });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    checkScheduledItems(userInput, Model) {
        let scheduleCodn = {};
        let classCodn = {};
        if (userInput.trainingClassId) {
            classCodn['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.resortId) {
            scheduleCodn['resortId'] = userInput.resortId;
        }
        scheduleCodn['status'] = { $in: ['inProgress', 'completed'] }
        return new Promise(resolve => {
            try {
                Model.CourseTrainingClassMap.findAll({ where: classCodn }).then(function (courses) {
                    if (courses) {
                        let courseIds = [];
                        courses.forEach(function (valCourse, valKey) {
                            courseIds.push(valCourse.courseId);
                        });
                        scheduleCodn['courseId'] = { $in: courseIds };
                    } else {
                        scheduleCodn['trainingClassId'] = userInput.trainingClassId;
                    }
                    Model.TrainingScheduleResorts.findAll({ where: scheduleCodn, attributes: ['trainingClassId', 'userId', 'status'] }).then(function (scheduleSets) {
                        if (scheduleSets.length > 0) {
                            resolve({ status: true, data: scheduleSets });
                        } else {
                            resolve({ status: false, data: [] });
                        }
                    });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    checkFileScheduled(userInput, Model) {
        let scheduleCodn = {};
        if (userInput.fileId) {
            scheduleCodn['fileId'] = userInput.fileId;
        }
        if (userInput.resortId) {
            scheduleCodn['resortId'] = userInput.resortId;
        }
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleFiles.findAll({ where: scheduleCodn, attributes: ['fileId', 'status'] }).then(function (scheduleSets) {
                    console.log(scheduleSets);
                    if (scheduleSets.length > 0) {
                        resolve({ status: true, data: scheduleSets });
                    } else {
                        resolve({ status: false, data: [] });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getParticularDepartUsers(userInput, Model) {
        let departCodn = {};
        if (userInput.departmentId) {
            departCodn['departmentId'] = userInput.departmentId;
        }
        if (userInput.resortId) {
            departCodn['resortId'] = userInput.resortId;
        }

        return new Promise(resolve => {
            try {
                Model.ResortUserMapping.findAll({ where: departCodn, attributes: ['departmentId', 'userId'] }).then(function (departUsers) {
                    let userSetId = [];
                    if (departUsers) {
                        departUsers.forEach(function (departVal, departKey) {
                            userSetId.push(departVal.dataValues.userId);
                        });

                    }
                    resolve({ status: true, data: userSetId });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getAllDivisionUsers(userInput, Model) {
        let userCodn = {};
        if (userInput.userId) {
            userCodn['userId'] = userInput.userId;
        } else if (userInput.createdBy) {
            userCodn['userId'] = userInput.createdBy;
        }
        userCodn['divisionId'] = { $ne: null };
        userCodn['departmentId'] = { $ne: null };
        return new Promise(resolve => {
            try {
                Model.ResortUserMapping.findAll({ where: userCodn, attributes: ['divisionId', 'userId', 'departmentId'] }).then(function (division) {

                    let departmentIds = [];
                    division.forEach(function (val, key) {
                        departmentIds.push(val.dataValues.departmentId);
                    });

                    let divisionCodn = {};
                    if (departmentIds.length > 0) {
                        divisionCodn['departmentId'] = { $ne: null, $in: departmentIds };

                        Model.ResortUserMapping.findAll({ where: divisionCodn, attributes: ['userId'] }).then(function (divisionUsers) {
                            let userSetId = [];
                            divisionUsers.forEach(function (divVal, divKey) {
                                userSetId.push(divVal.dataValues.userId);
                            });
                            resolve({ status: true, data: userSetId });
                        });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getParentId(userInput, Model) {
        let resortCond = {};
        if (userInput.resortId) {
            resortCond['resortId'] = userInput.resortId;
        }
        return new Promise(resolve => {
            try {
                Model.Resort.findOne({ where: resortCond, attributes: ['resortId', 'parentId', 'resortName'] }).then(function (parent) {
                    resolve({ status: true, data: parent.dataValues.parentId });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getTrainingClassFiles(userInput, Model) {
        let courseCondn = {};
        if (userInput.courseId) {
            courseCondn['courseId'] = userInput.courseId;
        }
        return new Promise(resolve => {
            try {
                Model.Course.findOne({
                    where: courseCondn,
                    attributes: ['courseId', 'courseName'],
                    include: [{
                        model: Model.FileMapping,
                        attributes: ['trainingClassId', 'courseId', 'fileId'],
                    }]
                }).then(function (courses) {
                    resolve({ status: true, data: courses });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    addNewNotificationFile(userInput, Model) {
        return new Promise(resolve => {
            try {
                Model.File.create(userInput).then(function (fileCreated) {
                    resolve({ status: true, data: fileCreated });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getTrainingClassIds(userInput, Model) {
        let courseCondn = {};
        if (userInput.courseId) {
            courseCondn['courseId'] = userInput.courseId;
        }
        let classIds = [];
        return new Promise(resolve => {
            try {
                Model.CourseTrainingClassMap.findAll({
                    where: courseCondn
                }).then(function (courses) {
                    courses.forEach(function (val, key) {
                        classIds.push(val.trainingClassId);
                    });
                    resolve({ status: true, data: classIds });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getClassOnlyFiles(userInput, Model) {
        let courseCondn = {};
        if (userInput.trainingClassId) {
            courseCondn['trainingClassId'] = userInput.trainingClassId;
        }
        return new Promise(resolve => {
            try {
                Model.FileMapping.findAll({
                    where: courseCondn,
                    attributes: ['trainingClassId', 'courseId', 'fileId']
                }).then(function (filesSet) {
                    resolve({ status: true, data: filesSet });
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getCourseOrTrainingClass(userInput, Model) {
        let courseCondn = {};
        if (userInput.courseId) {
            courseCondn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId) {
            courseCondn['trainingClassId'] = userInput.trainingClassId;
        }
        return new Promise(resolve => {
            try {
                if (userInput.courseId) {
                    Model.Course.findOne({
                        where: courseCondn,
                        attributes: ['courseId', 'courseName']
                    }).then(function (course) {
                        resolve({ status: true, data: course.dataValues.courseName });
                    });
                } else {
                    Model.TrainingClass.findOne({
                        where: courseCondn,
                        attributes: ['trainingClassId', 'trainingClassName']
                    }).then(function (course) {
                        resolve({ status: true, data: course.dataValues.trainingClassName });
                    });
                }
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    statusCheckProgressSchedules: function (userInput, Model) {
        let courseCondn = {};
        if (userInput.userId) {
            courseCondn['userId'] = userInput.userId;
        }
        if (userInput.status) {
            courseCondn['status'] = userInput.status;
        }
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleResorts.findAll({
                    where: courseCondn,
                    attributes: ['trainingClassId', 'courseId', 'trainingClassId', 'userId', 'status', 'resortId']
                }).then(function (schedules) {
                    if (schedules.length > 0) {
                        resolve({ status: true, data: schedules });
                    } else {
                        resolve({ status: false, data: schedules });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    scheduledUsersForCourse: function (userInput, Model) {
        let courseCondn = {};
        if (userInput.courseId) {
            courseCondn['courseId'] = userInput.courseId;
        }
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleResorts.findAll({
                    where: courseCondn,
                    attributes: ['trainingClassId', 'courseId', 'trainingClassId', 'userId', 'status', 'resortId']
                }).then(function (schedules) {
                    if (schedules.length > 0) {
                        let usersSet = [];
                        schedules.forEach(function (val, key) {
                            usersSet.push(val.dataValues.userId);
                        });
                        resolve({ status: true, data: usersSet });
                    } else {
                        resolve({ status: false, data: [] });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    completedClassesCount: function (userInput, Model) {
        let completedClassCodn = {};
        if (userInput.courseId) {
            completedClassCodn['courseId'] = userInput.courseId;
        }
        completedClassCodn['status'] = 'Completed';
        completedClassCodn['userId'] = userInput.userId;
        completedClassCodn['fileId'] = { $eq: null };
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleFiles.findAll({
                    where: completedClassCodn,
                    distinct: true
                }).then(function (courseCompletedClasses) {

                    if (courseCompletedClasses.length > 0) {
                        resolve({ status: true, data: courseCompletedClasses.length });
                    } else {
                        resolve({ status: true, data: courseCompletedClasses.length });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    coursePassPercentage: function (userInput, Model) {
        let passPercentCodn = {};
        if (userInput.courseId && userInput.typeSet === 'Course') {
            passPercentCodn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId && userInput.typeSet === 'Class') {
            passPercentCodn['trainingClassId'] = userInput.trainingClassId;
        }
        if (userInput.trainingScheduleId) {
            passPercentCodn['trainingScheduleId'] = userInput.trainingScheduleId;
        }
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleCourses.findAll({
                    where: passPercentCodn,
                    attributes: ['passPercentage', 'courseId', 'trainingClassId']
                }).then(function (passPercentStatus) {
                    if (passPercentStatus.length > 0) {
                        resolve({ status: true, data: passPercentStatus });
                    } else {
                        resolve({ status: true, data: passPercentStatus });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getAllReporters: function (userInput, Model) {
        let whereCodn = {};
        if (userInput.createdBy) {
            whereCodn['userId'] = userInput.createdBy;
        }
        whereCodn['accessSet'] = 'FullAccess';
        return new Promise(resolve => {
            try {
                Model.User.findAll({
                    where: whereCodn,
                    attributes: ['reportingTo', 'userId']
                }).then(function (users) {

                    //console.log(users);
                    // if (users.length > 0) {
                    //     //console.log(users[0].dataValues.userId);
                    //     resolve({ status: true, data: users[0].dataValues.userId });
                    // } else {
                    resolve({ status: true, data: (users[0]) ? users[0].dataValues.userId : null });
                    //  }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getCertificate: function (userInput, Model) {
        let certificateCodn = {};
        if (userInput.courseId && userInput.typeSet === 'Course') {
            certificateCodn['courseId'] = userInput.courseId;
        }
        if (userInput.trainingClassId && userInput.typeSet === 'Class') {
            certificateCodn['trainingClassId'] = userInput.trainingClassId;
        }
        return new Promise(resolve => {
            try {
                Model.CertificateMapping.findOne({
                    where: certificateCodn,
                    include: [{ model: Model.Certificate }]
                }).then(function (certificates) {
                    if (certificates && certificates.length > 0) {
                        resolve({ status: true, data: certificates });
                    } else {
                        resolve({ status: true, data: null });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    updateDraftForAllFiles: function (type, Model, id) {
        let setCourses = {};
        if (type === 'course') {
            setCourses['courseId'] = id;
        }
        if (type === 'class') {
            setCourses['trainingClassId'] = id;
        }

        return new Promise(resolve => {
            try {
                Model.FileMapping.findAll({
                    where: setCourses
                }).then(function (FileMappings) {



                    if (FileMappings && FileMappings.length > 0) {
                        let fileIds = [];
                        FileMappings.forEach(function (val, key) {
                            fileIds.push(val.dataValues.fileId);
                        });
                        if (fileIds.length > 0) {
                            let fileCodn = {};
                            fileCodn['fileId'] = { $in: fileIds };
                            Model.File.update({ draft: false }, { where: fileCodn }).then(function (filesUpdates) {
                                resolve({ status: true, data: filesUpdates });
                            });
                        } else {
                            resolve({ status: true, data: FileMappings });
                        }
                    } else {
                        resolve({ status: true, data: null });
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    getCourseInfos: function (courses, Model) {
        return new Promise(resolve => {
            try {
                if (courses.length > 0) {
                    let i = 0;
                    async.map(courses, function (item, done) {
                        i = parseInt(i) + parseInt(1);

                        item.Courses.forEach(function (value, key) {

                            let courseCondn = {};
                            courseCondn['courseId'] = value.courseId;
                            Model.Course.findAll({
                                attributes: ['courseName', 'courseId'],
                                where: courseCondn,
                                include: [{
                                    model: Model.CourseTrainingClassMap,
                                    attributes: ['courseId', 'trainingClassId'
                                    ]
                                }
                                ]
                            }).then(function (innerCourse) {
                                if (!item.hasOwnProperty('courseSect')) {
                                    item['courseSect'] = [];
                                }
                                item['courseSect'] = innerCourse;
                                let childsetKey = parseInt(key) + parseInt(1);

                                if (courses.length == i && childsetKey == item.Courses.length) {
                                    done(null, courses);
                                }
                            }, function (err) {
                                console.log(err);
                            });
                        });
                    },
                        function (err, results) {
                            resolve({ status: true, data: results });
                        });
                } else {
                    resolve({ status: false, data: [] });
                }
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
    mailOptions: function (mails, message, subject, attachments) {
        var userAdminEmail = CONFIG.adminEmail;
        var userAdminPassword = CONFIG.adminPassword;
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            auth: {
                user: userAdminEmail,
                pass: userAdminPassword
            }
        });
        var maillist = mails;
        var msg = {
            from: "******",
            subject: subject,
            //text: message, 
            cc: "*******",
            html: message,// html body
            attachments: attachments
        }
        maillist.forEach(function (to, i, array) {
            msg.to = to;
            smtpTransport.sendMail(msg, function (err) {
                if (err) {
                    console.log('Email error');
                    console.log('Sending to ' + to + ' failed: ' + err);
                    return false;
                } else {
                    console.log('Sent to ' + to);
                }
                if (i === maillist.length - 1) { msg.transport.close(); }
            });
        });
    },
    addTimes(startTime, endTime) {
        var times = [0, 0, 0]
        var max = times.length
        var a = (startTime || '').split(':')
        var b = (endTime || '').split(':')
        for (var i = 0; i < max; i++) {
            a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
            b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
        }
        for (var i = 0; i < max; i++) {
            times[i] = a[i] + b[i]
        }
        let hours = times[0]
        let minutes = times[1]
        let seconds = times[2]
        if (seconds >= 60) {
            let m = (seconds / 60) << 0
            minutes += m
            seconds -= 60 * m
        }
        if (minutes >= 60) {
            let h = (minutes / 60) << 0
            hours += h
            minutes -= 60 * h
        }
        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
    }
};
