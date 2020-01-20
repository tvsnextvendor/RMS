"use strict"

module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        questionName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        questionType: {
            type: DataTypes.ENUM('MCQ', 'NON-MCQ', 'True/False'),
            allowNull: false,
            defaultValue: "MCQ"
        },
        weightage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        options: {
            type: DataTypes.JSON,
            allowNull: true
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
    });
   
    return Question;
};