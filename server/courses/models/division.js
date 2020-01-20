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
            allowNull       :   false,
            unique          :   true,
        },
     
    });

    Division.associate = (models) => {
        Division.hasMany(models.Department,{foreignKey:'divisionId', onDelete: 'cascade'})
    };
    return Division; 
};