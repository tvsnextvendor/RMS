"use strict"

module.exports = (sequelize, DataTypes) => {
    const QuizMapping = sequelize.define("QuizMapping", {
        quizMappingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
           // foreignKey: true
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        }
    });
    QuizMapping.associate = (models) => {
       // QuizMapping.belongsTo(models.Question, { foreignKey: 'questionId', onDelete: 'cascade' });
        QuizMapping.belongsTo(models.Quiz, { foreignKey: 'quizId', onDelete: 'cascade' });
        QuizMapping.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
    };
    return QuizMapping;
};