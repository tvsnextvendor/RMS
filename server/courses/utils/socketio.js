//let express = require('express');
let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let config = require("../config/configuration");
let port = process.env.PORT || config.SOCKET_PORT;
let models = require("../models");

const Notification = models.Notification;
const User = models.User;
io.set("origins", "*:*");
io.on("connection", function (socket) {
  console.log("User" + socket.id + " Connected. ");
  socket.on("userId", obj => {
    console.log("socket user object");
    console.log(obj);
    if (obj) {
      var setResult = {};
      let whereCodn = { receiverId: obj.userId, status: "Unread" };
      if (obj.domain && obj.domain === "mobile") {
        whereCodn["type"] = { $notIn: ["sentApproval", "statusApproval"] };
      }
      let newcurrentDate = new Date();
      newcurrentDate.setDate(newcurrentDate.getDate());
      whereCodn["notificationAssignedDate"] = { $lte: newcurrentDate };
      console.log(whereCodn);
      Notification.findAndCountAll({
        where: whereCodn,
        include: [
          {
            model: User,
            required: false,
            attributes: ["userId", "userName", "lastName", "userImage"]
          }
        ],
        order: [["created", "DESC"]],
        limit: 10
      }).then(function (notifyRes) {
        console.log(notifyRes);
        Notification.findAndCountAll({
          where: whereCodn,
          include: [
            {
              model: User,
              required: false,
              attributes: ["userId", "userName", "lastName", "userImage"]
            }
          ],
          order: [["created", "DESC"]],
          limit: 10
        }).then(function (unReadCount) {
          notifyRes["unReadCount"] = unReadCount.count;
          setResult["notifications"] = notifyRes;
          io.emit("getNotifications", setResult);
        });
      });
    }
    io.emit("notify_processdone", 1);
  });
  socket.on("webUserId", obj => {
    console.log("socket webUserId object");
    console.log(obj);
    if (obj) {
      var setResult = {};
      let whereCodn = { receiverId: obj.webUserId, status: "Unread" };
      // let newcurrentDate = new Date();
      // newcurrentDate.setDate(newcurrentDate.getDate());
      // whereCodn["notificationAssignedDate"] = { $lte: newcurrentDate };
      console.log('whereCodn', whereCodn);
      Notification.findAndCountAll({
        where: whereCodn,
        include: [
          {
            model: User,
            required: false,
            attributes: ["userId", "userName", "lastName", "userImage"]
          }
        ],
        order: [["created", "DESC"]],
        limit: 10
      }).then(function (notifyRes) {
        Notification.findAndCountAll({
          where: whereCodn,
          include: [
            {
              model: User,
              required: false,
              attributes: ["userId", "userName", "lastName", "userImage"]
            }
          ],
          order: [["created", "DESC"]],
          limit: 10
        }).then(function (unReadCount) {
          notifyRes["unReadCount"] = unReadCount.count;
          setResult["notifications"] = notifyRes;
          io.emit("getNotifications", setResult);
        });
      });
    }
    io.emit("notify_processdone", 1);
  });
  socket.on("disconnect", function (data) {
    //console.log('CLIENT DISCONNECTED');
    console.log("User Manually Disconnected. \n\tTheir ID: " + data);
    io.emit("userdisconnected", 1);
  });
});
http.listen(port, function () {
  console.log("Server is listening on socket io *:" + port);
});
module.exports = io;
