"use strict"

module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define("Quiz", {
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        quizName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdBy:{
            type: DataTypes.INTEGER,
            allowNull: true
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
            { unique: true, fields: ['quizName', 'resortId'] }
        ]
    });
    Quiz.associate = (models) => {
        Quiz.hasMany(models.QuizMapping, { foreignKey: 'quizId', onDelete: 'cascade' });
        Quiz.hasMany(models.Question, { foreignKey: 'quizId', onDelete: 'cascade' });
    };
    return Quiz;
};