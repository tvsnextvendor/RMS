const _ = require('lodash');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const CONFIG = require('../config/configuration');
const saltRounds = 10;
const generator = require('generate-password');
const settings = require('../config/configuration');
// used to create, sign, and verify tokens
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
	getClientPort() {
		return CONFIG.CLIENT_PORT;
	},

	getAPIURL() {
		return CONFIG.SITE_URL;
	},
	getClientURL() {
		return CONFIG.CLIENT_URL;
	},
	generatePassword(length) {
		let password = generator.generate({
			length: length,
			numbers: true
		});
		return password;
	},
	password(user) {
		const salt = bcrypt.genSaltSync(saltRounds);
		const pwd = '12345678';
		const hash = bcrypt.hashSync(pwd, salt);
		return hash;
	},
	updatePassword(pass) {
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(pass, salt);
		return hash;
	},
	comparePassword(pw, hash) {
		var pass = bcrypt.compareSync(pw, hash);
		return pass;
	},
	uploadFilePaths() {
		let basePath = settings.SITE_URL + ':' + 8103;
		let uploadFilePaths = {};
		uploadFilePaths['uploadPath'] = basePath + '/uploads/';
		return uploadFilePaths;
	},
	mailOptions: function (mails, message, subject) {
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
			html: message // html body
		}
		maillist.forEach(function (to, i, array) {
			msg.to = to;
			smtpTransport.sendMail(msg, function (err) {
				if (err) {
					console.log('Email error');
					console.log('Sending to ' + to + ' failed: ' + err);
					return;
				} else {
					console.log('Sent to ' + to);
				}
				if (i === maillist.length - 1) { msg.transport.close(); }
			});
		});
	},
	loopForAllDepartments(userInput, Model) {
		let divCondn = {};
		if (userInput.divisionId) {
			divCondn['divisionId'] = userInput.divisionId;
		}
		return new Promise(resolve => {
			try {
				Model.Department.findAll({
					attributes: ['divisionId', 'departmentId'],
					where: divCondn
				}).then(function (departments) {
					let userPermissions = [];
					departments.forEach(function (val, key) {
						userInput.departmentId = val.dataValues.departmentId;
						userPermissions.push(userInput);
					});
					resolve({ status: true, data: userPermissions });
				});
			} catch (error) {
				resolve({ status: false, message: error });
			}
		});
	},
	getAllDropDowns(userInput, Model) {
		let resortCond = {};
		if (userInput.resortId) {
			resortCond['resortId'] = userInput.resortId;
		}
		let divisionsArray = [];
		return new Promise(resolve => {
			try {
				Model.Division.findAll({
					attributes: ['divisionId', 'divisionName'],
					include: [{ model: Model.ResortMapping, where: resortCond, required: true, attributes: [] }],
				}).then(function (divisions) {
					divisions.forEach(function (value, key) {
						divisionsArray.push(value.dataValues.divisionId);
					});
					let divCondn = {};
					divCondn['divisionId'] = { $in: divisionsArray };
					Model.Department.findAll({
						attributes: ['departmentId', 'departmentName'],
						include: [{ model: Model.Division, where: divCondn, required: true, attributes: [] }],
					}).then(function (departments) {
						Model.Designation.findAll({
							attributes: ['designationId', 'designationName'],
							include: [{ model: Model.ResortMapping, where: resortCond, required: true, attributes: [] }],
						}).then(function (designations) {
							let finalresponse = { "divisions": divisions, "departments": departments, "designations": designations };
							resolve({ status: true, data: finalresponse });
						});
					});

				});
				// Model.Resort.fineOne({where:resortCond,attributes:['resortId','parentId','resortName']}).then(function(parent){
				//     console.log(parent);
				//     // let parentSet = parent[0].dataValues.resortId;
				//     // childResorts = [parentSet,userInput.resortId];
				//     resolve({ status: true, data:  parent.dataValues.parentId });
				// });  
			} catch (error) {
				resolve({ status: false, message: error });
			}
		});
	},
	getAssignedUsers(userInput, Model) {
        return new Promise(resolve => {
            try {
                Model.TrainingScheduleResorts.findOne({where :{ 'userId': userInput.userId ,'resortId':userInput.resortId}}).then(function (userAssigned) {
                    console.log(userAssigned)
                    if (userAssigned) {
                        resolve({ status: true, data: userAssigned ,result : 'present' });
                    }else{
                        resolve({ status: true, data: [] ,result:'absent'}); 
                    }
                });
            } catch (error) {
                resolve({ status: false, message: error });
            }
        });
    },
	getMappingResortDatas: function (resortArray, Model) {
		let resortId = resortArray.resortId;
		let divisionIds = resortArray.divisionId;
		let departmentIds = resortArray.departmentId;
		return new Promise(resolve => {
			try {
				if (departmentIds.length > 0) {
					let whereCondn = {};
					whereCondn['departmentId'] = departmentIds;
					Model.Department.findAll({ where: whereCondn }).then(function (valRes) {
						if (valRes) {
							let resortTree = [];
							valRes.forEach(function (val, key) {
								if (val.dataValues.departmentId && val.dataValues.divisionId) {
									let newObj = {};
									newObj['departmentId'] = val.dataValues.departmentId;
									newObj['divisionId'] = val.dataValues.divisionId;
									newObj['resortId'] = resortId;
									resortTree.push(newObj);
								}
							});
							resolve({ status: true, data: resortTree });
						}
					});
				} else if (divisionIds.length > 0) {
					let whereCondn = {};
					whereCondn['divisionId'] = divisionIds;
					Model.Department.findAll({ where: whereCondn }).then(function (valRes) {
						if (valRes) {
							let resortTree = [];
							valRes.forEach(function (val, key) {
								if (val.dataValues.departmentId && val.dataValues.divisionId) {
									let newObj = {};
									newObj['departmentId'] = val.dataValues.departmentId;
									newObj['divisionId'] = val.dataValues.divisionId;
									newObj['resortId'] = resortId;
									resortTree.push(newObj);
								}
							});
							resolve({ status: true, data: resortTree });
						}
					});
				} else {
					resolve({ status: false, message: error });
				}
			} catch (error) {
				resolve({ status: false, message: error });
			}
		});
	},
	getMappingUserDatas: function (userArray, Model) {
		let divIds = userArray.divisionId;
		let depIds = userArray.departmentId;
		let designationIds = userArray.designationId;
		let resortId = userArray.resortId;
		let userId = userArray.userId;
		return new Promise(resolve => {
			try {
				if (divIds.length > 0) {
					let whereCondn = {};
					whereCondn['departmentId'] = depIds;
					Model.Department.findAll({ where: whereCondn }).then(function (response) {
						//console.log(response);
						if (response) {
							let departmentsTree = response;
							let divDepartTree = [];
							departmentsTree.forEach(function (val, key) {
								divIds.forEach(function (divVal, divKey) {
									if (divVal == val.dataValues.divisionId) {
										let Obj = {};
										// Div with departments
										Obj['departmentId'] = val.dataValues.departmentId;
										Obj['divisionId'] = val.dataValues.divisionId;
										Obj['designationId'] = null;
										Obj['resortId'] = resortId;
										//Obj['userId'] = userId;
										divDepartTree.push(Obj);
									} else {
										// Only Divisions
										console.log(divVal);
										// Obj['departmentId'] = null;
										// Obj['divisionId'] = divVal;
										// Obj['designationId'] = null;
										// Obj['resortId'] = resortId;
										//Obj['userId'] = userId;
									}

								});
							});

							let designationTree = [];
							designationIds.forEach(function (desVal, key) {
								let newObj = {};
								newObj['departmentId'] = null;
								newObj['divisionId'] = null;
								newObj['designationId'] = desVal;
								newObj['resortId'] = resortId;
								designationTree.push(newObj);
							});
							divDepartTree = divDepartTree.concat(designationTree);
							resolve({ status: true, data: divDepartTree });
						}
					});
				} else {
					resolve({ status: false, message: "empty divIds" });
				}
			} catch (error) {
				resolve({ status: false, message: error });
			}
		});
	}
};
