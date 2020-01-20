"use strict"

module.exports = (sequelize, DataTypes) => {
    
    const  Designation = sequelize.define("Designation",{
        designationId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  false,
            primaryKey      :  true,
            autoIncrement   :  true
        },
        designationName:{
            type            :   DataTypes.STRING,
            allowNull       :   false,
            unique          :   true,
        },
        default:{
            type         : DataTypes.BOOLEAN,
            allowNull    : true,
            defaultValue : false
        }
     
    });
    Designation.associate  = (models) => {
    };
    
    return Designation; 
};