"use strict"

module.exports = (sequelize, DataTypes) => {
    const TrainingScheduleFiles = sequelize.define("TrainingScheduleFiles", {
        trainingScheduleFileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        status: {
            type: DataTypes.ENUM('Completed', 'Not Completed'),
            allowNull: false,
            defaultValue: 'Not Completed'
        },
        completedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    TrainingScheduleFiles.associate = (models) => {
         TrainingScheduleFiles.belongsTo(models.Course,{foreignKey:'courseId'});
         TrainingScheduleFiles.belongsTo(models.TrainingClass,{foreignKey:'trainingClassId'});
         TrainingScheduleFiles.belongsTo(models.File,{foreignKey:'fileId'});
         TrainingScheduleFiles.belongsTo(models.User,{foreignKey:'userId'});
    };
    return TrainingScheduleFiles;
};