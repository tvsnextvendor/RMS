const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const compression = require("compression");
const cors = require("cors");
const models = require("./models");
const indexRouter = require("./routes/index");
const multer = require("multer");
const fs = require("fs");
const swig = require("swig");
const sequelize = require("sequelize");

const Utils = require("./utils/Utils");
const socketio = require("./utils/socketio");
const config = require("./config/configuration");
const cron = require("node-cron");
//will run every day at 12:00 AM
cron.schedule("0 0 0 * * *", function () {
  console.log("running a task every day");
  courseExpire();
  courseAssign();
  courseExpireAlert();
  failedCourseAlert();
  courseRemainderAlert();
  purgeSettings("Course");
  purgeSettings("contentUpload");
});
// cron.schedule('*/1 * * * *', () => {
//   console.log('running a task every one minutes');
//   // courseExpire();
//   // courseAssign();
//   // courseExpireAlert();
//   // failedCourseAlert();
//   // courseRemainderAlert();
//   // purgeSettings("Course");
//   purgeSettings("contentUpload");
// });
//To mark expired all training schedules
function courseExpire() {
  let conditions = {};
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  conditions["dueDate"] = { $eq: currentDate };
  models.TrainingSchedule.findAll({ where: conditions }).then(function (
    listSchedules
  ) {
    if (listSchedules) {
      let scheduledIds = [];
      listSchedules.forEach(value => {
        scheduledIds.push(value.dataValues.trainingScheduleId);
      });
      let scheduleCondn = {};
      scheduleCondn["trainingScheduleId"] = { $in: scheduledIds };
      scheduleCondn["status"] = {
        $notIn: ["inProgress", "signRequired", "completed", "failed"]
      };
      models.TrainingSchedule.update(
        { isExpired: true },
        { where: conditions }
      ).then(function (resp) {
        models.TrainingScheduleResorts.update(
          { status: "expired" },
          { where: scheduleCondn }
        ).then(function (ResortResp) { });
      });
    }
  });
}
// unAssigned Schedules To make Schedules assigned
function courseAssign() {
  let conditions = {};
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  conditions["dueDate"] = { $eq: currentDate };
  models.TrainingSchedule.findAll({ where: conditions }).then(function (
    listSchedules
  ) {
    if (listSchedules) {
      let scheduledIds = [];
      listSchedules.forEach(value => {
        scheduledIds.push(value.dataValues.trainingScheduleId);
      });
      let scheduleCondn = {};
      scheduleCondn["trainingScheduleId"] = { $in: scheduledIds };
      scheduleCondn["status"] = "unAssigned";
      models.TrainingScheduleResorts.update(
        { status: "assigned" },
        { where: scheduleCondn }
      ).then(function (ResortResp) { });
    }
  });
}
async function courseRemainderAlert() {
  let conditions = {};
  let notificationMsg = await Utils.getNotifications("remainderToEmployees");
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  conditions["dueDate"] = { $gte: currentDate };
  conditions['scheduleType'] = { $in: ["course", "trainingClass"] };
  conditions['lastNotifiedStatus'] = false;
  let statusCodn = {};
  statusCodn['status'] = { $in: ["assigned"] };
  models.TrainingSchedule.findAll({
    where: conditions,
    attributes: ['notificationDays', 'trainingScheduleId', 'name', 'dueDate'],
    include: [{
      model: models.TrainingScheduleResorts, as: 'Resorts',
      attributes: ["userId", "resortId"],
      where: statusCodn,
      required: true
    }]
  }).then(function (listSchedules) {
    let notifications = [];
    listSchedules.forEach(function (setval, setkey) {
      let dueDateSet = new Date(setval.dataValues.dueDate);
      //console.log(dueDateSet);
      let timeDifference = Math.abs(dueDateSet.getTime() - currentDate.getTime());
      let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
      let notificationDays = setval.dataValues.notificationDays;
      if (differentDays <= notificationDays) {
        setval.dataValues.Resorts.forEach(function (val, key) {
          let notifyObj = {};
          notifyObj["senderId"] = val.dataValues.userId;
          notifyObj["receiverId"] = val.dataValues.userId;
          notifyObj["courseId"] = val.dataValues.courseId;
          if (notificationMsg.status === true) {
            let notifyMessage = notificationMsg.data.message;
            let notifyMessage_1 = notifyMessage.replace(new RegExp("{{COURSE}}", "g"), setval.dataValues.name);
            notifyObj["notification"] = notifyMessage_1;
          }
          notifyObj["type"] = "remainderToEmployees";
          notifications.push(notifyObj);
        })
      }
      let scheduleCodn = {};
      scheduleCodn['trainingScheduleId'] = setval.dataValues.trainingScheduleId;
      models.TrainingSchedule.update({ 'lastNotifiedTime': new Date(), 'lastNotifiedStatus': true }, { where: scheduleCodn });
    });
    models.Notification.bulkCreate(notifications, {
      individualHooks: true
    }).then(function (responseNotify) { });
  });
}
async function courseExpireAlert() {
  let conditions = {};
  let notificationMsg = await Utils.getNotifications("expireCourse");
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  conditions["dueDate"] = { $gte: currentDate };
  models.TrainingSchedule.findAll({ where: conditions }).then(function (
    listSchedules
  ) {
    if (listSchedules) {
      let scheduledIds = [];
      listSchedules.forEach(value => {
        scheduledIds.push(value.dataValues.trainingScheduleId);
      });
      let scheduleCondn = {};
      scheduleCondn["trainingScheduleId"] = { $in: scheduledIds };
      scheduleCondn["status"] = { $in: ["assigned", "inProgress"] };
      models.TrainingScheduleResorts.findAll({
        where: scheduleCondn,
        include: [
          { model: models.Course, attributes: ["courseId", "courseName"] }
        ]
      }).then(function (scheduleRes) {
        let notifications = [];
        if (scheduleRes) {
          scheduleRes.forEach(function (val, key) {
            console.log(val);
            let notifyObj = {};
            notifyObj["senderId"] = val.dataValues.userId;
            notifyObj["receiverId"] = val.dataValues.userId;
            notifyObj["courseId"] = val.dataValues.courseId;
            if (notificationMsg.status === true) {
              let notifyMessage = notificationMsg.data.message;
              let notifyMessage_1 = notifyMessage.replace(
                new RegExp("{{COURSE}}", "g"),
                val.Course.courseName
              );
              notifyObj["notification"] = notifyMessage_1;
            }
            notifyObj["type"] = "expireCourse";
            notifications.push(notifyObj);
          });
          models.Notification.bulkCreate(notifications, {
            individualHooks: true
          }).then(function (responseNotify) { });
        }
      });
    }
  });
}
async function failedCourseAlert() {
  let conditions = {};
  let notificationMsg = await Utils.getNotifications("failedCourse");
  models.FeedbackMapping.findAll({ where: { status: "passed" } }).then(function (
    passedClasses
  ) {
    let passClassArray = [];
    if (passedClasses) {
      passedClasses.forEach(function (val, key) {
        passClassArray.push(val.dataValues.trainingClassId);
      });
    }
    conditions["trainingClassId"] = { $notIn: passClassArray };
    conditions["status"] = "failed";
    conditions["attempt"] = 1;
    models.FeedbackMapping.findAll({
      attributes: [
        "userId",
        [sequelize.fn("count", sequelize.col("trainingClassId")), "classCount"]
      ],
      where: conditions,
      group: ["FeedbackMapping.userId"]
    }).then(function (feedbackResponse) {
      let notifications = [];
      if (feedbackResponse) {
        feedbackResponse.forEach(function (val, key) {
          let notifyObj = {};
          notifyObj["senderId"] = val.dataValues.userId;
          notifyObj["receiverId"] = val.dataValues.userId;
          //notifyObj['courseId'] = val.dataValues.courseId;
          if (notificationMsg.status === true) {
            let notifyMessage = notificationMsg.data.message;
            let notifyMessage_1 = notifyMessage.replace(
              new RegExp("{{FAILEDCOUNT}}", "g"),
              val.dataValues.classCount
            );
            notifyObj["notification"] = notifyMessage_1;
          }
          notifyObj["type"] = "failedCourse";
          notifications.push(notifyObj);
        });
        models.Notification.bulkCreate(notifications, {
          individualHooks: true
        }).then(function (responseNotify) { });
      }
    });
  });
}
function purgeSettings(type) {
  let isDeleteCondn = {};
  let archievedCodn = {};
  if (type == "Course") {
    isDeleteCondn["isDeleted"] = true;
    archievedCodn["type"] = "Course";
  } else {
    isDeleteCondn["draft"] = true;
    archievedCodn["type"] = "contentUpload";
  }
  models.Archieved.findAll({ where: archievedCodn }).then(function (
    allArchieveds
  ) {
    if (allArchieveds.length > 0) {
      allArchieveds.forEach(function (val, key) {
        let archievedId = val.dataValues.archievedId;
        let archievedCodn = {};
        archievedCodn["archievedId"] = archievedId;
        let days = val.dataValues.archievedDays;
        let resortId = val.dataValues.resortId;
        isDeleteCondn["resortId"] = resortId;
        let lastUpdateTime = val.dataValues.lastSetup;
        let lastupdateDate = new Date(lastUpdateTime);
        lastupdateDate.setDate(lastupdateDate.getDate() + days);
        console.log(lastupdateDate);
        let currentDate = new Date();
        console.log(currentDate);
        let onlyUpdateDate = lastupdateDate.getDate();
        let onlyCurrentDate = currentDate.getDate();
        if (onlyUpdateDate === onlyCurrentDate) {
          let updateDate = {};
          updateDate["lastSetup"] = sequelize.literal("NOW()");
          model.Archieved.update(updateDate, { where: archievedCodn }).then(
            function (updateRes) {
              models.Quiz.destroy({ where: isDeleteCondn }).then(function (
                quizDelete
              ) {
                models.File.destroy({ where: isDeleteCondn }).then(function (
                  fileDelete
                ) {
                  models.TrainingClass.destroy({ where: isDeleteCondn }).then(
                    function (classDelete) {
                      models.Course.destroy({ where: isDeleteCondn }).then(
                        function (coursedelete) { }
                      );
                    }
                  );
                });
              });
            }
          );
        }
      });
    }
  });
  // models.QuizMapping.destroy({ where: isDeleteCondn }).then(function (quizMapDelete) {
  // 	models.Question.destroy({ where: isDeleteCondn }).then(function (questionDelete) {
  // 		models.Quiz.destroy({ where: isDeleteCondn }).then(function (quizDelete) {
  // 			models.FileMapping.destroy({ where: isDeleteCondn }).then(function (fileMapDelete) {
  // 				models.File.destroy({ where: isDeleteCondn }).then(function (fileDelete) {
  // 					models.TrainingClass.destroy({ where: isDeleteCondn }).then(function (classDelete) {
  // 						models.Course.destroy({ where: isDeleteCondn }).then(function (coursedelete) {
  // 						});
  // 					});
  // 				});
  // 			});
  // 		});
  // 	});
  // });
}
const app = express();
const apiRoutes = express.Router();
// LDAP Authentication / AD Directory Auth Set up

// const passport = require('passport');
// const LdapStrategy = require('passport-ldapauth');
// var OPTS = {
// 	server: {
// 		url: 'ldap://localhost:389',
// 		bindDN: 'cn=root',
// 		bindCredentials: 'secret',
// 		searchBase: 'ou=passport-ldapauth',
// 		searchFilter: '(uid={{username}})'
// 	}
// };
// passport.use(new LdapStrategy(OPTS));

// LDAP Authentication / AD Directory Auth Set up

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cross-origin
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));
app.use(express.static(__dirname + "/uploads"));
app.use(express.static("uploads"));
app.use(express.static(path.join(__dirname, "public")));

//app.use(passport.initialize());
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var file_path;
    var filepath;
    file_path = path.resolve(__dirname, "uploads");
    filepath = path.resolve("/uploads");

    if (!fs.existsSync(file_path)) {
      fs.mkdirSync(file_path);
    }
    callback(null, file_path);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var swigfile = new swig.Swig();
app.engine("html", swigfile.renderFile);
app.set("view engine", "pug");
// app.get('/notification', function (req, res) {
// 	res.sendFile(__dirname + '/notification.html');
// });

// app.get('/certificate', function (req, res) {
// 	res.sendFile(__dirname + '/default-certificate.html');
// });
var upload = multer({ storage: storage });
//file Upload api
app.post("/uploadFiles", upload.any(), function (req, res, next) {
  console.log(req.files);
  if (req.files) {
    let uploadPaths = "/uploads/" + req.files[0].filename;
    req.files.uploadPaths = uploadPaths;
    let filereq = req.files;
    res.send({
      isSuccess: true,
      data: filereq,
      path: uploadPaths
    });
  }
});
app.delete("/remove", function (req, res, next) {
  const filePath = path.join(__dirname, "./" + req.body.path);
  fs.unlink(filePath, err => {
    if (err) {
      res.send({
        isSuccess: false,
        message: err
      });
      return err;
    } else {
      res.send({
        isSuccess: true,
        message: "File removed successfully"
      });
    }
  });
});
//Authentication service
apiRoutes.use(function (req, res, next) {
  let allowurl = {
    "/updateTrainingStatus": "updateTrainingStatus",
    "/uploadDocuments": "uploadDocuments",
    "/removeDocuments": "removeDocuments"
  };
  if (allowurl.hasOwnProperty(req.path)) {
    next();
  } else {
    var token = req.headers["authorization"] || req.headers["Authorization"];
    if (token) {
      token = token.replace(/ar4Jq1V/g, ".");
      jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
        if (err) {
          if (err && err.name == "TokenExpiredError") {
            return res.status(403).json({
              status: "error",
              message: "Session expired, Please Sign out and Continue."
            });
          } else {
            return res.status(401).json({
              status: "error",
              message: "Failed to authenticate token."
            });
          }
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({
        status: "error",
        message: "Authorization token is mandatory"
      });
    }
  }
});
app.get("/", function (req, res, next) {
  res.render("index", {
    title: "Course Microservices Running " + config.SERVER_PORT
  });
});
app.use("/", apiRoutes);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use(function (req, res, next) {
  var allowHeaders = [
    "Accept",
    "Accept-Version",
    "Content-Type",
    "Content-MD5",
    "Content-Length",
    "Response-Time",
    "Api-Version",
    "Origin",
    "X-Requested-With",
    "Authorization"
  ];
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", allowHeaders.join(", "));
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Accept",
    "application/x-www-form-urlencoded,text/html,application/json,text/plain"
  );
  next();
});
module.exports = app;
