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
const loginRouter = require("./routes/login");
const config = require("./config/configuration");
const fs = require("fs");
const Utils = require("./utils/Utils");
const urlList = require("./utils/url.json");

const responsehandler = require("./utils/responseHandler");
const _ = require("lodash");
const multer = require("multer");
const app = express();
const apiRoutes = express.Router();

// LDAP Authentication / AD Directory Auth Set up

const passport = require("passport");
const LdapStrategy = require("passport-ldapauth");

const ldap = require("ldapjs");
const server = ldap.createServer();
const upload = multer({ dest: "tmp/csv/" });

// new sections added for testings

// ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

// const client = ldap.createClient({
// 	url: 'ldap://127.0.0.1/CN=test,OU=Development,DC=Home'
//   });

//   var opts = {
// 	filter: '(objectclass=user)',
// 	scope: 'sub',
// 	attributes: ['objectGUID']
//   };

//   client.bind('username', 'password', function (err) {
// 	client.search('CN=test,OU=Development,DC=Home', opts, function (err, search) {
// 	  search.on('searchEntry', function (entry) {
// 		var user = entry.object;
// 		console.log(user.objectGUID);
// 	  });
// 	});
//   });

//   client.listen(1389, function() {
// 	console.log('ldapjs listening at ' + client.url);
//   });

// new sections added for testings

server.search("dc=example", function(req, res, next) {
  var obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ["organization", "top"],
      o: "example"
    }
  };

  if (req.filter.matches(obj.attributes)) res.send(obj);

  res.end();
});

server.listen(1389, function() {
  console.log("ldapjs listening at " + server.url);
});

var OPTS = {
  server: {
    url: "ldap://localhost:1389",
    bindDN: "cn=root",
    bindCredentials: "secret",
    searchBase: "ou=passport-ldapauth",
    searchFilter: "(uid={{username}})"
  }
};
passport.use(new LdapStrategy(OPTS));

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
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

async function users(req, res) {
  let allEmails = [];
  let userInputSet = {};
  userInputSet.resortId = req.query.resortId;
  let divId = req.body.divisionId ? req.body.divisionId : "";
  if (divId) {
    userInputSet.divisionId = divId.split(",");
  } else {
    userInputSet.divisionId = [];
  }
  let departId = req.body.departmentId ? req.body.departmentId : "";
  if (departId) {
    userInputSet.departmentId = departId.split(",");
  } else {
    userInputSet.departmentId = [];
  }
  let reportId = req.body.reportingTo ? req.body.reportingTo : null;
  let userResponse = await Utils.getMappingResortDatas(userInputSet, models);
  let divdepart = [];
  if (userResponse.status === true) {
    divdepart = userResponse.data;
  }
  let designationIds = [];
  let designationId = req.body.designationId ? req.body.designationId : "";
  if (designationId) {
    designationIds = designationId.split(",");
  } else {
    designationIds = [];
  }
  const csvFilePath = req.file.path;
  let orginalName = req.file.originalname;
  let orginal = orginalName.split(".");
  let jsonArray = [];
  if (!req.query.resortId) {
    return responsehandler.getErrorResult("resortId is mandatory", res);
  }
  if (!req.query.createdBy) {
    return responsehandler.getErrorResult("createdBy is mandatory", res);
  }
  if (orginal[1] == "xlsx") {
    let XLSX = require("xlsx");
    let workbook = XLSX.readFile(req.file.path);
    let sheet_name_list = workbook.SheetNames;
    let userArray = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    userArray.map(item => {
      jsonArray.push(
        _.mapKeys(item, (value, key) => {
          let newKey = key;
          if (key === "Emp ID") {
            newKey = "employeeNo";
          }
          return newKey;
        })
      );
    });
  } else if (orginal[1] == "csv") {
    const csv = require("csvtojson");
    csv()
      .fromFile(csvFilePath)
      .then(jsonObj => {
        console.log(jsonObj);
      });
    jsonArray = await csv().fromFile(csvFilePath);
  } else {
    return responsehandler.getErrorResult(
      "only csv (or) xlsx format is supported",
      res
    );
  }
  let same;
  let not_same;
  if (jsonArray.length > 0) {
    let firstName = _.map(jsonArray, "firstName");
    let emails = _.map(jsonArray, "email");
    models.User.findAll({
      where: { firstName: firstName, email: emails }
    }).then(function(result) {
      same = _.intersectionBy(jsonArray, result, "firstName");
      let same_usernames = _.map(same, "firstName");
      let checkPhoneNum = _.xorBy(jsonArray, result, "firstName");
      not_same = checkPhoneNum.filter(function(value) {
        return (
          value.phoneNumber &&
          (value.phoneNumber.toString().length >= 10 ||
            value.phoneNumber.toString().length <= 12)
        );
      });
      if (not_same.length > 0) {
        let resortcodn = {};
        resortcodn["resortId"] = req.query.resortId;

        models.Resort.findOne({
          where: resortcodn,
          attributes: ["resortName"]
        }).then(function(resortInfo) {
          let resortName = resortInfo.dataValues.resortName;
          models.User.findOne({
            order: [["userId", "DESC"]]
          }).then(userss => {
            let i = 1;
            not_same = not_same.map(function(el, index) 
            {
              var o = Object.assign({}, el);
              let uniqueUserName = o.firstName ? o.firstName : o.userName;
              let randomNo = Math.floor(1000 + Math.random() * 9000);
              uniqueUserName = uniqueUserName.replace(/\s/g, "") + randomNo;

              o.userName = uniqueUserName.toLowerCase();
              o.createdBy = req.query.createdBy;
              if (userss.employeeId) {
                let response;
                response = userss.employeeId.split("R");
                let num = JSON.parse(response[1]) + i;
                o.employeeId = "R" + num;
              } else {
                o.employeeId = "R1000";
              }
              o.reportingTo = reportId;
              o.status = "mobile";
              let emailObject = {'email':el.email ,'firstName':el.firstName,'lastName':el.lastName,'userName':o.userName};
              allEmails.push(emailObject);
              i++;
              //o.UserRole = [{'roleId': 4}];
              //o.ResortUserMapping = [{'resortId': req.query.resortId,'divisionId':el.divisionId,'departmentId':el.departmentId},{'resortId': req.query.resortId,'designationId':el.designationId}];
              return o;
            });
            console.log("bulk upload emails");
            console.log(allEmails);

            console.log("all users data bulk_upload");
            console.log(not_same);
            //https://github.com/sequelize/sequelize/issues/5498
            return models.sequelize
              .transaction(transaction => {
                return models.User.bulkCreate(
                  not_same,
                  { individualHooks: true },
                  transaction
                  // {include:[
                  // 	{model:models.UserRoleMapping ,as:'UserRole'},
                  // 	{model:models.ResortUserMapping}
                  // ]},
                )
                  .then(function(response) {
                   
                    allEmails.forEach(function(valemail,valkey){
                      let emailSet = [];
                      emailSet.push(valemail.email);
                      let setName = valemail.firstName + ' ' + valemail.lastName;
                      let message = 'Hi ' + setName + ',<br> Welcome To LMS , <br> Your user credentials are <br><br>User Name :' + valemail.userName + '<br>Email Address : ' + valemail.email + ' <br> password : 12345678';
                      let subject = 'LMS - Warm Welcome';
                      Utils.mailOptions(emailSet, message, subject);
                    });
                    let userRoleMapArray = [];
                    let resortusermappingarray = [];
                    response.forEach(function(val, key) {
                      let obj = {};
                      obj.userId = val.dataValues.userId;
                      obj.roleId = 4;
                      userRoleMapArray.push(obj);
                      // Added for div | depar | role
                      not_same.map(function(el, index) {
                        console.log(divdepart);
                        if (divdepart.length > 0) {
                          divdepart.forEach(function(subval, subkey) {
                            let obj1 = {};
                            obj1.userId = val.dataValues.userId;
                            obj1.resortId = subval.resortId;
                            obj1.divisionId = subval.divisionId;
                            obj1.departmentId = subval.departmentId;
                            resortusermappingarray.push(obj1);
                          });
                        }
                        if (designationIds.length > 0) {
                          designationIds.forEach(function(thirdVal, thirdKey) {
                            let obj2 = {};
                            obj2.userId = val.dataValues.userId;
                            obj2.resortId = req.query.resortId;
                            obj2.designationId = thirdVal;
                            resortusermappingarray.push(obj2);
                          });
                        }
                      });
                    });
                    console.log("resortusermappingarray");
                    console.log(resortusermappingarray);
                    return models.UserRoleMapping.bulkCreate(
                      userRoleMapArray,
                      { individualHooks: true },
                      transaction
                    ).then(function(subresponse) {
                      return models.ResortUserMapping.bulkCreate(
                        resortusermappingarray,
                        { individualHooks: true },
                        transaction
                      ).then(function(resp) {
                        return response;
                      });
                    });
                  })
                  .catch(function(err) {
                    let errorMessage = Utils.constructErrorMessage(err);
                    return responsehandler.getErrorResult(errorMessage, res);
                  });
              })
              .then(function(response) {
                if (response) {
                  response.message = "User Created Successfully";
                  return responsehandler.getSuccessResult(response, res);
                } else {
                  return responsehandler.getErrorResult(
                    "Users not created",
                    res
                  );
                }
              })
              .catch(function(err) {
                let errorMessage = Utils.constructErrorMessage(err);
                return responsehandler.getErrorResult(errorMessage, res);
              });
          });
        });
      } else {
        let userResult = same_usernames.toString();
        return responsehandler.getErrorResult(
          "Data is already exist (or) phoneNumber is not valid (or) unique for these userName " +
            userResult,
          res
        );
      }
    });
  }
}
apiRoutes.post("/bulkCreate", upload.single("file"), function(req, res) {
  users(req, res);
});
//Authentication service
apiRoutes.use(function(req, res, next) {
  let allowurl = urlList.unauthorizedAllowUrl;
  if (allowurl.hasOwnProperty(req.path)) {
    next();
  } else {
    var token = req.headers["authorization"] || req.headers["Authorization"];
    if (token) {
      token = token.replace(/ar4Jq1V/g, ".");
      jwt.verify(token, config.SECRET_KEY, function(err, decoded) {
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
app.get("/", function(req, res, next) {
  res.render("index", {
    title: "User Microservices Running " + config.SERVER_PORT
  });
});
app.use("/", loginRouter);
app.use("/", apiRoutes);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use(function(req, res, next) {
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
