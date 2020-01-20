"use strict"

module.exports = (sequelize, DataTypes) => {
    const TrainingScheduleCourses = sequelize.define("TrainingScheduleCourses", {
        trainingScheduleCourseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        trainingScheduleId: {
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
        isMandatory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isOptional: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        passPercentage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    TrainingScheduleCourses.associate = (models) => {
        TrainingScheduleCourses.belongsTo(models.TrainingSchedule, { foreignKey: 'trainingScheduleId' });
        TrainingScheduleCourses.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId' });
        TrainingScheduleCourses.belongsTo(models.Course, { foreignKey: 'courseId' });
        TrainingScheduleCourses.belongsTo(models.CourseTrainingClassMap, { foreignKey: 'courseId' });
    };
    return TrainingScheduleCourses;
};