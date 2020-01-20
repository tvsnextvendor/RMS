const Utils = require('./../utils/Utils');
const responsehandler = require('./../utils/responseHandler');
const Model = require('../models/');
const _ = require('lodash');
const config = require("../config/configuration");

module.exports = {
	async createNotification(req, res) {
		let userInput = Utils.getReqValues(req);
		if (!userInput.courseId) {
			return responsehandler.getErrorResult("courseId is required", res);
		} else if (!userInput.trainingClassId) {
			return responsehandler.getErrorResult("trainingClassId is required", res);
		} else if (!userInput.createdBy) {
			return responsehandler.getErrorResult("createdBy is required", res);
		}
		// Resorts Divisions Departments Users validations
		else if (!userInput.resortId && !isArray(userInput.resortId)) {
			return responsehandler.getErrorResult("resortId is required", res);
		} else if (!userInput.divisionId && !isArray(userInput.divisionId)) {
			return responsehandler.getErrorResult("divisionId is required", res);
		} else if (!userInput.departmentId && !isArray(userInput.departmentId)) {
			return responsehandler.getErrorResult("departmentId is required", res);
		} else if (!userInput.userId && !isArray(userInput.userId)) {
			return responsehandler.getErrorResult("userId is required", res);
		}
		else {
			// Resorts Divisions Departments Users mapped responses
			let response = await Utils.getMappingResortDatas(userInput, Model);
			if (response.status === true) {
				userInput.resorts = response.data;
			}
			let scheduleType = userInput.scheduleType;
			let colourCode;
			let scheduleTypeDB;
			if (scheduleType === 'trainingClass') {
				colourCode = config.COLORCODE.class;
				scheduleTypeDB = 'trainingClass';
			} else if (scheduleType === 'notification') {
				colourCode = config.COLORCODE.notification;
				scheduleTypeDB = 'notification';
			} else {
				colourCode = config.COLORCODE.course;
				scheduleTypeDB = 'course';
			}
			let resorts = userInput.resorts;
			let notificationFileMap = [];
			let scheduleResortsMap = [];
			resorts.forEach(function (val, key) {
				let obj = {};
				obj.resortId = val.resortId;
				obj.divisionId = val.divisionId;
				obj.departmentId = val.departmentId;
				obj.userId = val.userId;
				notificationFileMap.push(obj);
			});
			userInput.userId.forEach(function (val, key) {
				let scheduleResorts = {};
				scheduleResorts.resortId = userInput.resortId;
				scheduleResorts.departmentId = userInput.departmentId;
				scheduleResorts.divisionId = userInput.divisionId;
				scheduleResorts.userId = val;
				scheduleResorts.status = 'assigned';
				scheduleResortsMap.push(scheduleResorts);
			});
			if (userInput.description){
				let notificationFile = {
					'courseId': userInput.courseId,
					'trainingClassId': userInput.trainingClassId,
					'description': userInput.description,
					'assignedDate': userInput.assignedDate,
					'scheduleName': userInput.trainingScheduleName,
					'dueDate': userInput.dueDate,
					'type': 'assignedToCourse',
					'status': 'noSignRequired',
					'createdBy': userInput.createdBy,
					'draft': userInput.draft
				};
				notificationFile.NotificationFileMaps = notificationFileMap;
				return Model.sequelize
					.transaction(function (transaction) {
						if (userInput && notificationFile) {
							return Model.NotificationFile.create(notificationFile,
								{
									include: [
										{ model: Model.NotificationFileMap, transaction }
									]
								}, transaction
							).then(function (notificationSchedule) {
								scheduleResortsMap.forEach(function (val, key) {
									val.notificationFileId = notificationSchedule.dataValues.notificationFileId;
								});
								let trainingObject = {
									resortId: userInput.resorts[0].resortId,
									name: userInput.trainingScheduleName,
									colorCode: colourCode,
									scheduleType: scheduleTypeDB,
									assignedDate: userInput.assignedDate || null,
									dueDate: userInput.dueDate || null,
									Resorts: scheduleResortsMap
								}
								return Model.TrainingSchedule.create(trainingObject, {
									include: [
										{ model: Model.TrainingScheduleResorts, as: 'Resorts', transaction }]
								}, transaction).then(function (scheduleNotification) {
									if (scheduleNotification) {
										return { 'notification': notificationSchedule, "scheduleNotification": scheduleNotification };
									} else {
										return false;
									}
								});
							});
						}
					}).then(function (notificationSchedule) {
						responsehandler.getSuccessResult(
							notificationSchedule,
							"Notification Scheduled Successfully",
							res
						);
					})
					.catch(function (error) {
						var errorMessage = Utils.constructErrorMessage(error);
						if (errorMessage === 'lower(name::text) must be unique,\nresortId must be unique') {
							errorMessage = "Training schedule name already taken";
						}
						return responsehandler.getErrorResult(errorMessage, res);
					});
			}
			else {
				if (!userInput.fileName) {
					return responsehandler.getErrorResult("fileName is required", res);
				}
				//  else if (!userInput.fileDescription) {
				//     return responsehandler.getErrorResult("fileDescription is required", res);
				// } 
				else if (!userInput.fileSize) {
					return responsehandler.getErrorResult("fileSize is required", res);
				} else if (!userInput.fileExtension) {
					return responsehandler.getErrorResult("fileExtension is required", res);
				} else if (!userInput.fileType) {
					return responsehandler.getErrorResult("fileType is required", res);
				} else if (!userInput.fileUrl) {
					return responsehandler.getErrorResult("fileUrl is required", res);
				}
				let fileMapping = {
					'courseId': userInput.courseId,
					'trainingClassId': userInput.trainingClassId
				};
				let filesInsert = {
					'fileName': userInput.fileName,
					'fileDescription': userInput.fileDescription,
					'fileSize': userInput.fileSize,
					'fileExtension': userInput.fileExtension,
					'fileType': userInput.fileType,
					'fileUrl': userInput.fileUrl,
					'fileLength': userInput.fileLength,
					'fileImage': userInput.fileImage,
					'jobId': userInput.jobId,
					'inputUrl': userInput.inputUrl,
					'transcodeUrl': userInput.transcodeUrl,
					'FileMappings': fileMapping,
					'createdBy':userInput.createdBy
				};
				return Model.sequelize
					.transaction(function (transaction) {
						return Model.File.create(filesInsert, { include: [{ model: Model.FileMapping, transaction }] }, transaction).then(function (fileRes) {
							if (fileRes) {
								let notificationFile = {
									'courseId': userInput.courseId,
									'trainingClassId': userInput.trainingClassId,
									'fileId': fileRes.dataValues.fileId,
									'assignedDate': userInput.assignedDate,
									'scheduleName': userInput.trainingScheduleName,
									'dueDate': userInput.dueDate,
									'type': 'assignedToCourse',
									'status': 'noSignRequired',
									'createdBy': userInput.createdBy,
									'draft': userInput.draft
								};
								notificationFile.NotificationFileMaps = notificationFileMap;
								if (userInput && notificationFile) {
									return Model.NotificationFile.create(notificationFile,
										{
											include: [
												{ model: Model.NotificationFileMap, transaction }
											]
										}, transaction
									).then(function (notificationSchedule) {
										scheduleResortsMap.forEach(function (val, key) {
											val.notificationFileId = notificationSchedule.dataValues.notificationFileId;
										});
										let trainingObject = {
											resortId: userInput.resorts[0].resortId,
											name: userInput.trainingScheduleName,
											colorCode: colourCode,
											scheduleType: scheduleTypeDB,
											assignedDate: userInput.assignedDate || null,
											dueDate: userInput.dueDate || null,
											Resorts: scheduleResortsMap
										}
										return Model.TrainingSchedule.create(trainingObject, {
											include: [
												{ model: Model.TrainingScheduleResorts, as: 'Resorts', transaction }]
										}, transaction).then(function (scheduleNotification) {
											if (scheduleNotification) {
												return { 'file': fileRes, 'notification': notificationSchedule, 'scheduleNotification': scheduleNotification };
											} else {
												return false;
											}
										});
										// return { 'file': fileRes, 'notification': notificationSchedule }
									});
								} else {
									console.log("userinput empty");
								}
							}
						});
					}).then(function (notificationSchedule) {
						responsehandler.getSuccessResult(
							notificationSchedule,
							"Notification Scheduled Successfully",
							res
						);
					})
					.catch(function (error) {
						var errorMessage = Utils.constructErrorMessage(error);
						if (errorMessage === 'lower(name::text) must be unique,\nresortId must be unique') {
							errorMessage = "Training schedule name already taken";
						}
						return responsehandler.getErrorResult(errorMessage, res);
					});
			}
		}
	},
	async signatureNotification(req, res) {
		let userInput = Utils.getReqValues(req);
		let notificationMsg = await Utils.getNotifications('assignNotification');
		if (!userInput.createdBy) {
			return responsehandler.getErrorResult("createdBy is required", res);
		} else if (!userInput.resortId && !isArray(userInput.resortId)) {
			return responsehandler.getErrorResult("resortId is required", res);
		} else if (!userInput.divisionId && !isArray(userInput.divisionId)) {
			return responsehandler.getErrorResult("divisionId is required", res);
		} else if (!userInput.departmentId && !isArray(userInput.departmentId)) {
			return responsehandler.getErrorResult("departmentId is required", res);
		} else if (!userInput.userId && !isArray(userInput.userId)) {
			return responsehandler.getErrorResult("userId is required", res);
		}
		else {
			let response = await Utils.getMappingResortDatas(userInput, Model);
			if (response.status === true) {
				userInput.resorts = response.data;
			}
			let resorts = userInput.resorts;
			let scheduleType = userInput.scheduleType;
			let colourCode;
			let scheduleTypeDB;
			if (scheduleType === 'trainingClass') {
				colourCode = config.COLORCODE.class;
				scheduleTypeDB = 'trainingClass';
			} else if (scheduleType === 'notification') {
				colourCode = config.COLORCODE.notification;
				scheduleTypeDB = 'notification';
			} else {
				colourCode = config.COLORCODE.course;
				scheduleTypeDB = 'course';
			}
			let statusOption = (userInput.signatureStatus === true) ? 'signRequired' : 'noSignRequired';
			let typeOption = (userInput.signatureStatus === true) ? 'signRequired' : 'general';
			let notificationFileMap = [];
			let scheduleResortsMap = [];
			let departments = [];
			let divisions = [];
			let notifications = [];
			resorts.forEach(function (val, key){
				let obj = {};
				obj.resortId = val.resortId;
				obj.divisionId = val.divisionId;
				obj.departmentId = val.departmentId;
				obj.userId = val.userId;
				notificationFileMap.push(obj);
				let notifyObj = {};
				notifyObj['senderId'] = userInput.createdBy;
				notifyObj['receiverId'] = val.userId;
				if (notificationMsg.status === true)
				{
					let notifyMessage = notificationMsg.data.message;
					let notifyMessage_1 = notifyMessage.replace(new RegExp('{{NOTIFICATION}}', 'g'), userInput.trainingScheduleName);
					notifyObj['notification'] = notifyMessage_1;
				}
				notifyObj['type'] = 'assignNotification';
				notifyObj['notificationType'] = statusOption;
				if(userInput.assignedDate){
					notifyObj['notificationAssignedDate'] = userInput.assignedDate;
				}
				notifications.push(notifyObj);
			});
			
			notifications = _.uniqBy(notifications, 'receiverId');
			userInput.userId.forEach(function (val, key) {
				let scheduleResorts = {};
				scheduleResorts.resortId = userInput.resortId;
				scheduleResorts.departmentId = userInput.departmentId;
				scheduleResorts.divisionId = userInput.divisionId;
				scheduleResorts.userId = val;
				scheduleResorts.status = 'assigned';
				scheduleResortsMap.push(scheduleResorts);
			});
			if (userInput.description) {
				let notificationFile = {
					'scheduleName': userInput.trainingScheduleName,
					'description': userInput.description,
					'assignedDate': userInput.assignedDate,
					'dueDate': userInput.dueDate,
					'status': statusOption,
					'type': typeOption,
					'createdBy': userInput.createdBy,
					'draft': userInput.draft
				};
				notificationFile.NotificationFileMaps = notificationFileMap;
				return Model.sequelize
					.transaction(function (transaction) {
						if (userInput && notificationFile) {
							return Model.NotificationFile.create(notificationFile,
								{
									include: [
										{ model: Model.NotificationFileMap, transaction }
									]
								}, transaction
							).then(function (notificationSchedule) {


								scheduleResortsMap.forEach(function (val, key) {
									val.notificationFileId = notificationSchedule.dataValues.notificationFileId;
								});

								notifications.forEach(function(val,key){
									val.notificationFileId = notificationSchedule.dataValues.notificationFileId;
								});


								let trainingObject = {
									resortId: userInput.resorts[0].resortId,
									name: userInput.trainingScheduleName,
									colorCode: colourCode,
									scheduleType: scheduleTypeDB,
									assignedDate: userInput.assignedDate || null,
									dueDate: userInput.dueDate || null,
									Resorts: scheduleResortsMap
								}

								return Model.TrainingSchedule.create(trainingObject, {
									include: [
										{ model: Model.TrainingScheduleResorts, as: 'Resorts', transaction }]
								}, transaction).then(function (scheduleNotification) {
									if (scheduleNotification) {


										return Model.Notification.bulkCreate(notifications, { individualHooks: true }, transaction).then(function (responseNotify) {
											return { 'notification': notificationSchedule, 'scheduleNotification': scheduleNotification };
										});




									} else {
										return false;
									}
								});
							});
						}
					}).then(function (notificationSchedule) {
						responsehandler.getSuccessResult(
							notificationSchedule,
							"Notification Scheduled Successfully",
							res
						);
					})
					.catch(function (error) {

						var errorMessage = Utils.constructErrorMessage(error);
						if (errorMessage === 'lower(name::text) must be unique,\nresortId must be unique') {
							errorMessage = "Training schedule name already taken";
						}
						return responsehandler.getErrorResult(errorMessage, res);
					});
			}
			else {
				if (!userInput.fileName) {
					return responsehandler.getErrorResult("fileName is required", res);
				}
				// else if (!userInput.fileDescription) {
				//     return responsehandler.getErrorResult("fileDescription is required", res);
				// } 
				else if (!userInput.fileSize) {
					return responsehandler.getErrorResult("fileSize is required", res);
				} else if (!userInput.fileExtension) {
					return responsehandler.getErrorResult("fileExtension is required", res);
				} else if (!userInput.fileType) {
					return responsehandler.getErrorResult("fileType is required", res);
				} else if (!userInput.fileUrl) {
					return responsehandler.getErrorResult("fileUrl is required", res);
				}
				let filesInsert = {
					'fileName': userInput.fileName,
					'fileDescription': userInput.fileDescription,
					'fileSize': userInput.fileSize,
					'fileExtension': userInput.fileExtension,
					'fileType': userInput.fileType,
					'fileUrl': userInput.fileUrl,
					'fileLength': userInput.fileLength,
					'fileImage': userInput.fileImage,
					'jobId': userInput.jobId,
					'inputUrl': userInput.inputUrl,
					'transcodeUrl': userInput.transcodeUrl,
					'createdBy':userInput.createdBy,
					'resortId':userInput.resortId
				};
				return Model.sequelize
					.transaction(function (transaction) {
						return Model.File.create(filesInsert, transaction).then(function (fileResult) {
							if (fileResult) {
								let notificationFileMap = [];
								resorts.forEach(function (val, key) {
									let obj = {};
									obj.resortId = val.resortId;
									obj.divisionId = val.divisionId;
									obj.departmentId = val.departmentId;
									obj.userId = val.userId;
									notificationFileMap.push(obj);
								});
								let notificationFile = {
									'scheduleName': userInput.trainingScheduleName,
									'fileId': fileResult.dataValues.fileId,
									'assignedDate': userInput.assignedDate,
									'dueDate': userInput.dueDate,
									'status': statusOption,
									'type': typeOption,
									'createdBy': userInput.createdBy,
									'draft': userInput.draft
								};
								notificationFile.NotificationFileMaps = notificationFileMap;
								return Model.NotificationFile.create(notificationFile,
									{ include: [{ model: Model.NotificationFileMap, transaction }] }, transaction
								).then(function (notificationSchedule) {
									scheduleResortsMap.forEach(function (val, key) {
										val.notificationFileId = notificationSchedule.dataValues.notificationFileId;
									});
									notifications.forEach(function(val,key){
										val.notificationFileId = notificationSchedule.dataValues.notificationFileId;
									});
									let trainingObject = {
										resortId: userInput.resorts[0].resortId,
										name: userInput.trainingScheduleName,
										colorCode: colourCode,
										scheduleType: scheduleTypeDB,
										assignedDate: userInput.assignedDate || null,
										dueDate: userInput.dueDate || null,
										Resorts: scheduleResortsMap
									}
									return Model.TrainingSchedule.create(trainingObject, {
										include: [
											{ model: Model.TrainingScheduleResorts, as: 'Resorts', transaction }]
									}, transaction).then(function (scheduleNotification) {
										if (scheduleNotification){
											return Model.Notification.bulkCreate(notifications, { individualHooks: true }, transaction).then(function (responseNotify) {
												return { 'file': fileResult, 'notification': notificationSchedule, 'scheduleNotification': scheduleNotification };
											});
										} else {
											return false;
										}
									});
									//  return { 'file': fileResult, 'notification': notificationSchedule }
								});
							}
						});
					}).then(function (notificationSchedule) {
						responsehandler.getSuccessResult(
							notificationSchedule,
							"Notification Scheduled Successfully",
							res
						);
					})
					.catch(function (error) {
						var errorMessage = Utils.constructErrorMessage(error);
						if (errorMessage === 'lower(name::text) must be unique,\nresortId must be unique') {
							errorMessage = "Training schedule name already taken";
						}
						return responsehandler.getErrorResult(errorMessage, res);
					});
			}
		}
	},
	async updateNotification(req, res) {
		let userInput = Utils.getReqValues(req);
		let whereCond = {};
		whereCond['notificationFileId'] = userInput.notificationFileId;
		userInput.scheduleName = userInput.trainingScheduleName;
		let response = await Utils.getMappingResortDatas(userInput, Model);
		if (response.status === true) {
			userInput.resorts = response.data;
		} else {
			userInput.resorts = [];
		}
		let notificationFileMap = [];
		let scheduleResortsMap = [];
		let checkCond = {};
		let newAdded_notificationFileId;
		checkCond['notificationFileId'] = userInput.notificationFileId;
		checkCond['status'] = { $in: ['completed'] };
		Model.NotificationFileMap.findAll({ where: checkCond }).then(function (completedFiles) {
			if (completedFiles.length > 0) {
				return responsehandler.getErrorResult("This notification is already in progress/complete. You cannot make any changes to this notification", res);
			}
			else {
				if (userInput.getUserId && userInput.userId) {
					let alreadyPresentId = userInput.getUserId;
					let allUsers = userInput.userId;
					// To remove deleted users in schedule set update
					let allDifData = _.difference(alreadyPresentId, allUsers);
					// To add additional users in schedule set update
					let newDiffData = _.difference(allUsers, alreadyPresentId);
					userInput.insertUserId = newDiffData;
					let removeCodn = {};
					removeCodn['notificationFileId'] = userInput.notificationFileId;
					if (allDifData.length > 0) {
						removeCodn['userId'] = allDifData;
						Model.NotificationFileMap.destroy({ where: removeCodn });
						Model.TrainingScheduleResorts.destroy({ where: removeCodn });
					}
				}
				if (userInput.insertUserId && userInput.insertUserId.length > 0) {
					userInput.insertUserId.forEach(function (val, key) {
						let scheduleResorts = {};
						scheduleResorts.trainingScheduleId = userInput.trainingScheduleId;
						scheduleResorts.notificationFileId = userInput.notificationFileId;
						scheduleResorts.resortId = userInput.resortId;
						scheduleResorts.departmentId = userInput.departmentId;
						scheduleResorts.divisionId = userInput.divisionId;
						scheduleResorts.userId = val;
						scheduleResorts.status = 'assigned';
						scheduleResortsMap.push(scheduleResorts);
					});
					Model.TrainingScheduleResorts.bulkCreate(scheduleResortsMap, { individualHooks: true });
				}
				if (userInput.trainingScheduleId) {
					let updateSchedule = {
						'name': userInput.trainingScheduleName,
						'assignedDate': userInput.assignedDate,
						'dueDate': userInput.dueDate,
					};
					let scheduleCodn = {};
					scheduleCodn['trainingScheduleId'] = userInput.trainingScheduleId;
					Model.TrainingSchedule.update(updateSchedule, { where: scheduleCodn });
				}
				let statusOption = (userInput.signatureStatus === true) ? 'signRequired' : 'noSignRequired';
				userInput.status = statusOption;
				Model.NotificationFile.findOne({ where: whereCond }).then(async function (notificationFileRes) {
					if (userInput.selectType === 'file') {
						let fileTableId = (notificationFileRes) ? notificationFileRes.dataValues.fileId : '';
						let fileCondn = {};
						fileCondn['fileId'] = fileTableId;
						let filesUpdate = {
							'fileName': userInput.fileName,
							'fileDescription': userInput.fileDescription,
							'fileSize': userInput.fileSize,
							'fileExtension': userInput.fileExtension,
							'fileType': userInput.fileType,
							'fileUrl': userInput.fileUrl,
							'fileLength': userInput.fileLength,
							'fileImage': userInput.fileImage,
							'jobId': userInput.jobId,
							'inputUrl': userInput.inputUrl,
							'transcodeUrl': userInput.transcodeUrl,
							'createdBy':userInput.createdBy,
							'resortId':userInput.resortId
						};
						if (notificationFileRes && fileTableId) {
							Model.File.update(filesUpdate, { where: fileCondn });
						} else {
							let fileSection = await Utils.addNewNotificationFile(filesUpdate, Model);
							let fileCreated;
							if (fileSection.status === true) {
								fileCreated = fileSection.data;
								let fileId = fileCreated.dataValues.fileId;
								userInput.fileId = fileId;
								newAdded_notificationFileId = fileId;
							}
						}
						userInput.description = null;
						
						let updateSetFileId = { 'fileId': newAdded_notificationFileId };
						Model.NotificationFile.update(updateSetFileId, { where: whereCond });
					} else if (userInput.selectType === 'desc') {
						newAdded_notificationFileId = null;
						let updateSetFileId = { 'fileId': newAdded_notificationFileId };
						Model.NotificationFile.update(updateSetFileId, { where: whereCond }).then(function (Updated) {
							let notificationFileId = (notificationFileRes) ? notificationFileRes.dataValues.fileId : null;
							let fileCondn = {};
							if (notificationFileId) {
								fileCondn['fileId'] = notificationFileId;
								Model.File.destroy({ where: fileCondn });
								userInput['fileId'] = null;
							}
						});

					}
					else {
						return responsehandler.getErrorResult("selectType is required", res);
					}
					if (userInput.resorts && userInput.resorts.length > 0) {
						// Old Info of notifications removal
						let removeCodn = {};
						removeCodn['notificationFileId'] = userInput.notificationFileId;
						Model.NotificationFileMap.destroy({ where: removeCodn });
						userInput.resorts.forEach(function (val, key) {
							let obj = {};
							obj.resortId = val.resortId;
							obj.notificationFileId = userInput.notificationFileId;
							obj.divisionId = val.divisionId;
							obj.departmentId = val.departmentId;
							obj.userId = val.userId;
							notificationFileMap.push(obj);
						});
					}

					Model.NotificationFile.update(userInput, { where: whereCond }).then(function (notifyRes) {


						Model.NotificationFileMap.bulkCreate(notificationFileMap, { individualHooks: true }).then(function (fileMapRes) {
							let notificationSchedule = { 'notify': notifyRes, 'notification': fileMapRes };
							responsehandler.getSuccessResult(
								notificationSchedule,
								"Notification Updated Successfully",
								res
							);
						});
					});
				});
			}
		});
	},
	requiredValidations(userInput) {
	},
	listMobileNotification(req, res) {
	},
	getScheduleExpireList(req, res) {
		let userInput = Utils.getReqValues(req);
		let whereCond = {};
		let statusCodn = {};
		if (userInput.status) {
			statusCodn['status'] = userInput.status;
		}
		if (userInput.userId) {
			statusCodn['userId'] = userInput.userId;
		}
		if (userInput.resortId) {
			statusCodn['resortId'] = userInput.resortId;
		}
		let limit, page, offset;
		if (userInput.page && userInput.size) {
			limit = userInput.size;
			page = userInput.page ? userInput.page : 1;
			offset = (page - 1) * userInput.size;
		}
		// last seven days schedules list outs 
		if (userInput.status === 'assigned') {
			let currentSectDate = new Date();
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 7);
			whereCond['assignedDate'] = { $lte: currentSectDate, $ne: null };
			whereCond['dueDate'] = { $lte: currentDate, $gte: currentSectDate, $ne: null };
		}

		whereCond['isExpired'] = false;
		Model.TrainingSchedule.findAndCountAll({
			attributes: ['trainingScheduleId', 'name', 'assignedDate', 'dueDate', 'scheduleType', 'colorCode'],
			where: whereCond,
			limit: limit,
			offset: offset,
			include: [{
				model: Model.TrainingScheduleResorts, as: 'Resorts',
				where: statusCodn,
				attributes: ['trainingScheduleId', 'status', 'courseId', 'trainingClassId', 'userId'],
				include: [{
					model: Model.Course, attributes: ['courseId', 'courseName'],
					include: [{ model: Model.CourseTrainingClassMap, attributes: ['courseId', 'trainingClassId'] }]
				}, {
					model: Model.TrainingClass, attributes: ['trainingClassId', 'trainingClassName']
				}, {
					model: Model.NotificationFile,
					attributes: ['fileId', "description", "type"],
					include: [{ model: Model.File }]
				}]
			}],
			order: [['dueDate', 'ASC']],
		}).then(function (response) {
			responsehandler.getSuccessResult(
				response,
				"Last 7 days scheduled listed successfully",
				res
			);
		}).catch(function (error) {
			var errorMessage = Utils.constructErrorMessage(error);
			return responsehandler.getErrorResult(errorMessage, res);
		});
	},
	async getNotificationFile(req, res) {

		let userInput = Utils.getReqValues(req);
		let whereCond = {};
		let resortCondn = {};
		let departUsers = [];
		let divUsers = [];

		let childResortIds = await Utils.getChildResorts(userInput, Model);
		let resorts = [];
		if (childResortIds.status === true) {
			resorts = childResortIds.data;
			resorts.push(userInput.resortId);
		} else {
			resorts.push(userInput.resortId);
		}
		if (userInput.departmentId) {
			let departData = await Utils.getParticularDepartUsers(userInput, Model);
			if (departData.status === true) {
				departUsers = departData.data;
				whereCond['createdBy'] = { $in: departUsers };
			}
		} else if (userInput.divisionId) {
			let divData = await Utils.getParticularDivUsers(userInput, Model);
			if (divData.status === true) {
				divUsers = divData.data;
				whereCond['createdBy'] = { $in: divUsers };
			}
		}
		if (userInput.notificationFileId) {
			whereCond['notificationFileId'] = userInput.notificationFileId;
		}
		if (userInput.courseId) {
			whereCond['courseId'] = userInput.courseId;
		}
		if (userInput.trainingClassId) {
			whereCond['trainingClassId'] = userInput.trainingClassId;
		}
		// if (userInput.resortId) {
		// 	resortCondn['resortId'] = userInput.resortId;
		// }
		// if (userInput.userId) {
		// 	resortCondn['userId'] = userInput.userId;
		// }
		// if (userInput.divisionId) {
		// 	resortCondn['divisionId'] = userInput.divisionId;
		// }
		// if (userInput.departmentId) {
		// 	resortCondn['departmentId'] = userInput.departmentId;
		// }
		if (userInput.status) {
			whereCond['status'] = userInput.status;
		}
		if (userInput.status === 'noSignRequired') {
			whereCond['type'] = { $ne: 'assignedToCourse' };
		}


		if (userInput.createdBy && departUsers.length > 0) {
			whereCond['createdBy'] = { $in: departUsers };
		}
		else if (userInput.createdBy && divUsers.length > 0) {
			whereCond['createdBy'] = { $in: divUsers };
		}
		else if (userInput.createdBy) {
			whereCond['createdBy'] = userInput.createdBy;
		}
		else if (userInput.subResortId) {
			resortCondn['resortId'] = userInput.subResortId;
		}
		else {
			resortCondn['resortId'] = resorts;
		}

		if (whereCond.draft === 'true') {
			whereCond['draft'] = true;
		} else if (userInput.draft === 'false') {
			whereCond['draft'] = false;
		} else {
			whereCond['draft'] = false;
		}

		if (userInput.allDrafts === '1') {
			whereCond['draft'] = { $in: [true, false] };
		}
		if (userInput.isDeleted) {
			whereCond['isDeleted'] = true;
		} else {
			whereCond['isDeleted'] = false;
		}

		console.log("whereCond", whereCond)

		let limit, page, offset;
		if (userInput.page && userInput.size) {
			limit = userInput.size;
			page = userInput.page ? userInput.page : 1;
			offset = (page - 1) * userInput.size;
		}
		if (userInput.mobile === '1') {
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate());
			whereCond['assignedDate'] = { $lte: currentDate, $ne: null };
			whereCond['dueDate'] = { $gte: currentDate, $ne: null };
		}
		let searchCodn = {};
		if (userInput.search) {
			let search = userInput.search;
			searchCodn = {
				$or: [
					{
						"$File.fileName$": {
							$iLike: "%" + (search ? search : "") + "%"
						}
					}
				],
				$and: whereCond
			};
		} else {
			searchCodn = whereCond;
		}

		Model.NotificationFile.findAndCountAll({
			attributes: ['notificationFileId', 'courseId', 'trainingClassId', 'fileId', 'assignedDate', 'dueDate', 'status', 'type', 'description', 'created', 'updated', 'draft', 'approvedStatus','scheduleName'],
			include: [
				{
					model: Model.File,
					required: false
				},
				{
					model: Model.User,
					attributes: ['userId', 'userName', 'firstName', 'lastName'],
					required: false
				},
				{
					model: Model.TrainingScheduleResorts,
					where: resortCondn,
					required: false,
					attributes: [],
				}
			],
			where: searchCodn,
			limit: limit,
			offset: offset,
			order: [['created', 'DESC']],
			subQuery: false,
			distinct: true,
			group: ["NotificationFile.notificationFileId", "File.fileId", "User.userId"],
		}).then(function (response) {
			response['uploadPath'] = Utils.uploadFilePaths();
			if (response) {
				response.count = response.count.length;
				responsehandler.getSuccessResult(
					response,
					"Notifications listed successfully",
					res
				);
			} else {
				responsehandler.getSuccessResult(
					response,
					"No Course Found in this Status",
					res
				);
			}
		}).catch(function (error) {
			var errorMessage = Utils.constructErrorMessage(error);
			return responsehandler.getErrorResult(errorMessage, res);
		});

	},
	async getNotification(req, res) {
		let userInput = Utils.getReqValues(req);
		let whereCond = {};
		let resortCondn = {};

		let childResortIds = await Utils.getChildResorts(userInput, Model);
		let resorts = [];
		if (childResortIds.status === true) {
			resorts = childResortIds.data;
			resorts.push(userInput.resortId);
		} else {
			resorts.push(userInput.resortId);
		}
		if (userInput.notificationFileId) {
			whereCond['notificationFileId'] = userInput.notificationFileId;
		}
		if (userInput.courseId) {
			whereCond['courseId'] = userInput.courseId;
		}
		if (userInput.trainingClassId) {
			whereCond['trainingClassId'] = userInput.trainingClassId;
		}
		if (userInput.resortId) {
			resortCondn['resortId'] = userInput.resortId;
		}
		if (userInput.userId) {
			resortCondn['userId'] = userInput.userId;
		}
		if (userInput.divisionId) {
			resortCondn['divisionId'] = userInput.divisionId;
		}
		if (userInput.departmentId) {
			resortCondn['departmentId'] = userInput.departmentId;
		}
		if (userInput.status) {
			whereCond['status'] = userInput.status;
		}
		if (userInput.status === 'noSignRequired') {
			whereCond['type'] = { $ne: 'assignedToCourse' };
		}
		if (userInput.createdBy) {
			whereCond['createdBy'] = userInput.createdBy;
		} else {
			resortCondn['resortId'] = resorts;
		}
		if (whereCond.draft === 'true') {
			whereCond['draft'] = true;
		} else if (userInput.draft === 'false') {
			whereCond['draft'] = false;
		} else {
			whereCond['draft'] = false;
		}
		if (userInput.allDrafts === '1') {
			whereCond['draft'] = { $in: [true, false] };
		}
		if (userInput.isDeleted) {
			whereCond['isDeleted'] = true;
		} else {
			whereCond['isDeleted'] = false;
		}
		let limit, page, offset;
		if (userInput.page && userInput.size) {
			limit = userInput.size;
			page = userInput.page ? userInput.page : 1;
			offset = (page - 1) * userInput.size;
		}
		if (userInput.mobile === '1') {
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate());
			whereCond['assignedDate'] = { $lte: currentDate, $ne: null };
			whereCond['dueDate'] = { $gte: currentDate, $ne: null };
		}
		let searchCodn = {};
		if (userInput.search) {
			let search = userInput.search;
			searchCodn = {
				$or: [
					{
						"$File.fileName$": {
							$iLike: "%" + (search ? search : "") + "%"
						}
					}
				],
				$and: whereCond
			};
		} else {
			searchCodn = whereCond;
		}

		Model.NotificationFile.findAndCountAll({
			attributes: ['notificationFileId', 'courseId', 'trainingClassId', 'fileId', 'assignedDate', 'dueDate', 'status', 'type', 'description', 'created', 'updated', 'draft', 'approvedStatus'],
			include: [
				{
					model: Model.File,
					required: false
				},
				{
					model: Model.User,
					attributes: ['userId', 'userName', 'firstName', 'lastName'],
					required: false
				},
				{
					model: Model.NotificationFileMap,
					where: resortCondn,
					// attributes:[]

					// required:false
				},
				{
					model: Model.TrainingScheduleResorts,
					where: resortCondn,
					required: false,

					include: [{
						model: Model.TrainingSchedule,
						attributes: ['trainingScheduleId', 'name']
					}]
				}
			],
			where: searchCodn,
			limit: limit,
			offset: offset,
			order: [['created', 'DESC']],
			subQuery: false,
			distinct: true,
			//  group: ["NotificationFile.notificationFileId","File.fileId","User.userId"],
		}).then(function (response) {
			response['uploadPath'] = Utils.uploadFilePaths();
			if (response.rows.length > 0) {
				response.rows.forEach(function (value, key) {
					let assigned = [];
					let completed = [];
					if (value.NotificationFileMaps) {
						value.NotificationFileMaps.forEach(function (valSet, keySet) {
							if (valSet.status === 'assigned') {
								assigned.push(valSet);
							}
							if (valSet.status === 'completed') {
								completed.push(valSet);
							}
						});
					}
					value.dataValues['totalCount'] = value.NotificationFileMaps.length;
					if (!value.dataValues.hasOwnProperty('assignedCount')) {
						value.dataValues['assignedCount'] = {};
					}
					let arrayassignedSum = _.uniq(assigned);
					value.dataValues['assignedCount'] = arrayassignedSum.length;
					if (!value.dataValues.hasOwnProperty('completedCount')) {
						value.dataValues['completedCount'] = {};
					}
					let arraycompletedSum = _.uniq(completed);
					value.dataValues['completedCount'] = arraycompletedSum.length;
				});
				responsehandler.getSuccessResult(
					response,
					"Notifications listed successfully",
					res
				);
			} else {
				responsehandler.getSuccessResult(
					response,
					"No Course Found in this Status",
					res
				);
			}
		}).catch(function (error) {
			var errorMessage = Utils.constructErrorMessage(error);
			return responsehandler.getErrorResult(errorMessage, res);
		});
	},
	completedNotification(req, res) {
		let userInput = Utils.getReqValues(req);
		let whereCond = {};
		if (!userInput.notificationFileId) {
			return responsehandler.getErrorResult("notificationFileId is required", res);
		} else if (!userInput.userId) {
			return responsehandler.getErrorResult("userId is required", res);
		} else if (!userInput.resortId) {
			return responsehandler.getErrorResult("resortId is required", res);
		} else {
			whereCond['notificationFileId'] = userInput.notificationFileId;
			whereCond['userId'] = userInput.userId;
			whereCond['resortId'] = userInput.resortId;
			let statusUpdate = {};
			statusUpdate['status'] = 'completed';
			Model.NotificationFileMap.findOne(whereCond).then(function (response) {
				if (response) {
					Model.NotificationFileMap.update(statusUpdate, { where: whereCond }).then(function (response) {
						Model.TrainingScheduleResorts.findOne(whereCond).then(function (scheduleNotification) {
							if (scheduleNotification) {
								Model.TrainingScheduleResorts.update(statusUpdate, { where: whereCond }).then(function (res) {
									responsehandler.getSuccessResult(
										response,
										"Notifications completed successfully",
										res
									);
								});
							} else {
								responsehandler.getSuccessResult(
									response,
									"Notifications completed successfully",
									res
								);
							}
						});
					}).catch(function (error) {
						var errorMessage = Utils.constructErrorMessage(error);
						return responsehandler.getErrorResult(errorMessage, res);
					});
				} else {
					return responsehandler.getErrorResult("notification not found", res);
				}
			});
		}

	},
	getDashboardCount(req, res) {
		let userInput = Utils.getReqValues(req);
		let currentSectDate = new Date();
		let expireProgressCodn = {};
		let currentDate = new Date();
		currentDate.setDate(currentDate.getDate() + 7);
		let notifyCondn = {};
		notifyCondn['status'] = 'signRequired';

		// current date must be with in assigned and due date

		// new added
		let newcurrentDate = new Date();
		newcurrentDate.setDate(newcurrentDate.getDate());
		notifyCondn['assignedDate'] = { $lte: newcurrentDate, $ne: null };
		notifyCondn['dueDate'] = { $gte: newcurrentDate, $ne: null };
		// new added

		// notifyCondn['assignedDate'] = { $lte: currentSectDate, $ne: null };
		// notifyCondn['dueDate'] = { $lte: currentDate, $gte: currentSectDate, $ne: null };
		notifyCondn['type'] = 'signRequired';

		let notifyUserCond = {};
		let unnotifyUserCond = {};
		let unnotifyCondn = {};
		unnotifyCondn['status'] = 'noSignRequired';

		// new added
		unnotifyCondn['assignedDate'] = { $lte: newcurrentDate, $ne: null };
		unnotifyCondn['dueDate'] = { $gte: newcurrentDate, $ne: null };
		// new added

		// unnotifyCondn['assignedDate'] = { $lte: currentSectDate, $ne: null };
		// unnotifyCondn['dueDate'] = { $lte: currentDate, $gte: currentSectDate, $ne: null };
		unnotifyCondn['type'] = 'general';

		let userCondn = {};
		if (userInput.userId) {
			userCondn['userId'] = userInput.userId;
			notifyUserCond['userId'] = userInput.userId;
			unnotifyUserCond['userId'] = userInput.userId;
		}
		if (userInput.resortId) {
			userCondn['resortId'] = userInput.resortId;
			notifyUserCond['resortId'] = userInput.resortId;
			unnotifyUserCond['resortId'] = userInput.resortId;
		}
		userCondn['status'] = 'assigned';
		notifyUserCond['status'] = 'signRequired';
		unnotifyUserCond['status'] = 'noSignRequired';
		// course expiry condns 
		let whereCond = {};
		let statusCodn = {};
		if (userInput.status) {
			statusCodn['status'] = userInput.status;
		} else {
			statusCodn['status'] = { $in: ['assigned'] };
		}
		if (userInput.userId) {
			statusCodn['userId'] = userInput.userId;
		}
		if (userInput.resortId) {
			statusCodn['resortId'] = userInput.resortId;
		}
		//statusCodn['notificationFileId'] = {$ne: null};
		// last seven days schedules list outs 

		// whereCond['assignedDate'] = { $lte: currentSectDate, $ne: null };
		// whereCond['dueDate'] = { $lte: currentDate, $gte: currentSectDate, $ne: null };
		whereCond['isExpired'] = false;
		whereCond['scheduleType'] = { $ne: 'notification' };


		expireProgressCodn['assignedDate'] = { $lte: currentSectDate, $ne: null };
		expireProgressCodn['dueDate'] = { $lte: currentDate, $gte: currentSectDate, $ne: null };
		expireProgressCodn['isExpired'] = false;
		expireProgressCodn['scheduleType'] = { $ne: 'notification' };

		let responseCount = {};
		Model.NotificationFile.findAndCountAll({
			where: notifyCondn,
			include: [{
				model: Model.NotificationFileMap,
				where: userCondn,
				attributes: ['userId', 'notificationFileId', 'resortId']
			}],
			distinct: true
		}).then(function (notifyRes) {
			Model.NotificationFile.findAndCountAll({
				where: unnotifyCondn,
				include: [{
					model: Model.NotificationFileMap,
					where: userCondn,
					attributes: ['userId', 'notificationFileId', 'resortId']
				}],
				distinct: true
			}).then(function (unnotifyRes) {
				Model.TrainingScheduleResorts.findAndCountAll({
					attributes: [
						"userId",
						"courseId",
						"trainingClassId",
						"status",
						"completedDate",
						"trainingScheduleId",
						"notificationFileId"
					],
					include: [{
						model: Model.TrainingSchedule,
						attributes: [
							"name",
							"assignedDate",
							"dueDate",
							"notificationDays",
							"trainingScheduleId",
							"scheduleType",
							"colorCode"
						],
						where: whereCond
					}],
					required: true,
					where: statusCodn,

				}).then(function (courseExpireCount) {
					Model.TrainingScheduleResorts.findAndCountAll({
						attributes: [
							"userId",
							"courseId",
							"trainingClassId",
							"status",
							"completedDate",
							"trainingScheduleId",
							"notificationFileId"
						],
						include: [{
							model: Model.TrainingSchedule,
							attributes: [
								"name",
								"assignedDate",
								"dueDate",
								"notificationDays",
								"trainingScheduleId",
								"scheduleType",
								"colorCode"
							],
							where: expireProgressCodn,
						}],
						required: true,
						where: { 'status': 'assigned', 'userId': userInput.userId, 'resortId': userInput.resortId },

					}).then(function (courseExpireAssignedCount) {

						Model.TrainingScheduleResorts.findAndCountAll({
							attributes: [
								"userId",
								"courseId",
								"trainingClassId",
								"status",
								"completedDate",
								"trainingScheduleId",
								"notificationFileId"
							],
							include: [{
								model: Model.TrainingSchedule,
								attributes: [
									"name",
									"assignedDate",
									"dueDate",
									"notificationDays",
									"trainingScheduleId",
									"scheduleType",
									"colorCode"
								],
								where: whereCond,
							}],
							required: true,
							where: { 'status': 'inProgress', 'userId': userInput.userId, 'resortId': userInput.resortId },

						}).then(function (courseExpireInprogressCount) {
							responseCount.inProgressCount = courseExpireInprogressCount.count;
							responseCount.assignedCount = courseExpireAssignedCount.count;
							responseCount.courseExpire = courseExpireCount.count;
							responseCount.signatureReq = notifyRes.count;
							responseCount.generalNotification = unnotifyRes.count;
							responsehandler.getSuccessResult(
								responseCount,
								"Dashboard counts listed successfully",
								res
							);
						});
					});
				});
			});
		});
	}
}