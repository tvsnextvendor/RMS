"use strict"

module.exports = (sequelize, DataTypes) => {
    const Archieved = sequelize.define("Archieved", {
        archievedId: {
            type             : DataTypes.INTEGER,
            allowNull        : false,
            primaryKey       : true,
            autoIncrement    : true
        },
        archievedDays: {
            type            : DataTypes.INTEGER,
            allowNull       : true
        },
        deletedDays:{
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
        },
        resortId: {
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        type:{
            type            :   DataTypes.STRING,
            allowNull       :   false, 
        },
        lastSetup: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('NOW()')
        }
    });
    Archieved.associate  = (models) => {
        Archieved.belongsTo(models.Resort,{foreignKey : 'resortId',onDelete: 'cascade'});
    };
    return Archieved;
};