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
        }
    });
    TrainingClass.associate = (models) => {
    };
    return TrainingClass;
};