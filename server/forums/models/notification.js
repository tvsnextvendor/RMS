"use strict"

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        notificationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        senderId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: true
        },
        notification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Read', 'Unread'),
            defaultValue: "Unread",
            allowNull: false
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        forumId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isNotify: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    Notification.associate  = (models) => {
        Notification.belongsTo(models.User,{foreignKey:'receiverId', onDelete: 'cascade'});
     };
    return Notification;
}