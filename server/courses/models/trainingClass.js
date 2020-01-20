"use strict"

module.exports = (sequelize, DataTypes) => {

    const TrainingClass = sequelize.define("TrainingClass", {
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        trainingClassName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true
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
    }, {
        indexes: [
            { unique: true, fields: ['trainingClassName', 'resortId'] }
        ]
    });
    TrainingClass.associate = (models) => {
        TrainingClass.hasMany(models.TrainingScheduleResorts, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        TrainingClass.hasMany(models.CourseTrainingClassMap, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        // TrainingClass.hasMany(models.File,{foreignKey:'trainingClassId', onDelete: 'cascade'});
        TrainingClass.hasMany(models.QuizMapping, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        TrainingClass.hasMany(models.FileMapping, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        TrainingClass.belongsTo(models.User, { foreignKey: 'createdBy', as: 'createdByDetails', onDelete: 'cascade' });

        // TrainingClass.hasMany(models.Question,{foreignKey:'trainingClassId', onDelete: 'cascade'}); 
        TrainingClass.hasMany(models.FeedbackMapping, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
    };
    return TrainingClass;
};