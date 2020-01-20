"use strict"

module.exports = (sequelize, DataTypes) => {
    const Approvals = sequelize.define("Approvals", {
        approvalId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        contentName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notificationFileId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        contentType: {
            type: DataTypes.ENUM('Course', 'Training Class', 'Quiz', 'Notification'),
            allowNull: false,
            defaultValue: "Course"
        },
        approverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        approverStatus: {
            type: DataTypes.ENUM('Rescheduled', 'Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: "Pending"
        },
        approvedOn: {
            type: DataTypes.DATE,
            allowNull: true
        },
        rejectComment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reportingTo: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        publishStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    Approvals.associate = (models) => {
        Approvals.belongsTo(models.Resort, { foreignKey: 'resortId', onDelete: 'cascade' });
        Approvals.belongsTo(models.Course, { foreignKey: 'courseId', onDelete: 'cascade' });
        Approvals.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        Approvals.belongsTo(models.Quiz, { foreignKey: 'quizId', onDelete: 'cascade' });
        Approvals.belongsTo(models.NotificationFile, { foreignKey: 'notificationFileId', onDelete: 'cascade' });
        Approvals.belongsTo(models.User, { foreignKey: 'approverId', onDelete: 'cascade', as: 'Approver' });
        Approvals.belongsTo(models.User, { foreignKey: 'createdBy', onDelete: 'cascade', as: 'Requestor' });
    };
    return Approvals;
};