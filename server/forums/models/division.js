"use strict"

module.exports = (sequelize, DataTypes) => {
    
    const  Division = sequelize.define("Division",{
        divisionId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  false,
            primaryKey      :  true,
            autoIncrement   :  true
        },
        divisionName:{
            type            :   DataTypes.STRING,
            allowNull       :   false
        },
     
    });

    Division.associate = (models) => {
        // console.log("models",models)
        Division.hasMany(models.User,{foreignKey:'divisionId', onDelete: 'cascade'})
        Division.hasMany(models.Department,{foreignKey:'divisionId', onDelete: 'cascade'})
    };

    return Division; 
};