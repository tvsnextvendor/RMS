"use strict"
module.exports = (sequelize, DataTypes) => {
    const CourseTrainingClassMap = sequelize.define("CourseTrainingClassMap", {
        courseTrainingClassMapId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    CourseTrainingClassMap.associate = (models) => {
        CourseTrainingClassMap.belongsTo(models.Course, { foreignKey: 'courseId' ,onDelete: 'cascade'});
        CourseTrainingClassMap.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId' ,onDelete: 'cascade'}); 
    };
    return CourseTrainingClassMap;
};