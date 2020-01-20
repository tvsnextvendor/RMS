"use strict"

module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define("Feedback", {
        feedbackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        feedback: {
            type: DataTypes.STRING,
            allowNull: true
        },
        feedbackType: {
            type: DataTypes.ENUM('Compliment', 'Suggestion', 'Complaint','None'),
            allowNull: false,
            defaultValue: "None"
        },
        ratingPercent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ratingStar: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        score: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        scoreOutof: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    Feedback.associate = (models) => {
        Feedback.hasMany(models.FeedbackMapping,{foreignKey:'feedbackId',as:'feedbackMap',onDelete : 'cascade'});
    };
    return Feedback;
};