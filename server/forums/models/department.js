"use strict"

module.exports = (sequelize, DataTypes) => {
    
    const  Department = sequelize.define("Department",{
        departmentId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  false,
            primaryKey      :  true,
            autoIncrement   :  true
        },
        departmentName:{
            type            :   DataTypes.STRING,
            allowNull       :   false,
            unique          :   true,
        },
        divisionId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true,
        },
     
    });

    Department.associate  = (models) => {
       // console.log("models",models)
       Department.hasMany(models.User,{foreignKey:'departmentId', onDelete: 'cascade'})
     //  Department.belongsTo(models.Division,{foreignKey:'divisionId', onDelete: 'cascade'})
    };
    
    return Department; 
};