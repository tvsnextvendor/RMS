"use strict"

module.exports = (sequelize, DataTypes) => {

    const TrainingSchedule = sequelize.define("TrainingSchedule", {
        trainingScheduleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notificationDays: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastNotifiedTime:{
            type: DataTypes.DATE,
            allowNull: true
        },
        lastNotifiedStatus:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        assignedDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        colorCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        scheduleType:{
            type: DataTypes.STRING,
            allowNull:true
        }
    }, {
            indexes: [
                { unique: true, fields: [sequelize.fn('lower', sequelize.col('name')), 'resortId'] }
            ]
        });
    TrainingSchedule.associate = (models) => {
        TrainingSchedule.hasMany(models.TrainingScheduleCourses, { foreignKey: 'trainingScheduleId', as: 'Courses', onDelete: 'cascade' });
        TrainingSchedule.hasMany(models.TrainingScheduleResorts, { foreignKey: 'trainingScheduleId', as: 'Resorts', onDelete: 'cascade' });
    };
    return TrainingSchedule;
};