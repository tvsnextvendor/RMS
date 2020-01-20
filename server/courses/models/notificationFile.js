"use strict"

module.exports = (sequelize, DataTypes) => {
    const NotificationFile = sequelize.define("NotificationFile", {
        notificationFileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        courseId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: true
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: true
        },
        fileId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        scheduleName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        },
        assignedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('general', 'assignedToCourse', 'signRequired'),
            allowNull: false,
            defaultValue: 'general'
        },
        status: {
            type: DataTypes.ENUM('signRequired', 'noSignRequired'),
            allowNull: false,
            defaultValue: 'noSignRequired'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        draft: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        approvedStatus:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    NotificationFile.associate = (models) => {
        NotificationFile.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        NotificationFile.belongsTo(models.Course, { foreignKey: 'courseId', onDelete: 'cascade' });
        NotificationFile.belongsTo(models.File, { foreignKey: 'fileId', onDelete: 'cascade' });
        NotificationFile.belongsTo(models.User, { foreignKey: 'createdBy', onDelete: 'cascade' });
        NotificationFile.hasMany(models.NotificationFileMap, { foreignKey: 'notificationFileId', onDelete: 'cascade' });
        NotificationFile.hasMany(models.TrainingScheduleResorts, { foreignKey: 'notificationFileId', onDelete: 'cascade' });
    };
    return NotificationFile;
}