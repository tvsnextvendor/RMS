"use strict"

module.exports = (sequelize, DataTypes) => {

    const Course = sequelize.define("Course", {
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        courseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('none', 'workInprogress', 'scheduled'),
            allowNull: false,
            defaultValue: 'none'
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
    },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['courseName', 'resortId']
                }
            ]
        });
    Course.associate = (models) => {
        Course.hasMany(models.TrainingScheduleFiles,{foreignKey:'courseId', onDelete: 'cascade' });
        Course.hasMany(models.CertificateUserMapping, { foreignKey: 'courseId', onDelete: 'cascade' });
        Course.hasMany(models.FeedbackMapping, { foreignKey: 'courseId', onDelete: 'cascade' });
        Course.belongsTo(models.Resort, { foreignKey: 'resortId', onDelete: 'cascade' });
        Course.hasMany(models.FileMapping, { foreignKey: 'courseId', onDelete: 'cascade' });
        Course.hasMany(models.CourseTrainingClassMap, { foreignKey: 'courseId', onDelete: 'cascade' });
        Course.belongsTo(models.User, { foreignKey: 'createdBy', as: 'createdByDetails', onDelete: 'cascade' });
        Course.hasMany(models.TrainingScheduleResorts, { foreignKey: 'courseId', onDelete: 'cascade' });
        Course.hasMany(models.TrainingScheduleCourses, { foreignKey: 'courseId', onDelete: 'cascade' });
    };
    return Course;
};