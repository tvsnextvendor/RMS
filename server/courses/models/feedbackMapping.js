"use strict"

module.exports = (sequelize, DataTypes) => {
    const FeedbackMapping = sequelize.define("FeedbackMapping", {
        feedbackMappingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        feedbackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
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
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        passPercentage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        attempt: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        timeTaken: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        latestFailed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    }, {
            //indexes: [
            // { unique: true, fields: ['courseId', 'trainingClassId','userId'] }
            // ]
        });
    FeedbackMapping.associate = (models) => {
        FeedbackMapping.belongsTo(models.Resort, { foreignKey: 'resortId', onDelete: 'cascade' });
        FeedbackMapping.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        FeedbackMapping.belongsTo(models.Course, { foreignKey: 'courseId', onDelete: 'cascade' });
        FeedbackMapping.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
        FeedbackMapping.belongsTo(models.Feedback, { foreignKey: 'feedbackId', onDelete: 'cascade' });
    };
    return FeedbackMapping;
};