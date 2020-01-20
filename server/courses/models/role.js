"use strict"

module.exports = (sequelize, DataTypes) => {
    
    const  Role = sequelize.define("Role",{
        roleId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  false,
            primaryKey      :  true,
            autoIncrement   :  true
        },
        roleName:{
            type            :   DataTypes.STRING,
            allowNull       :   false
        },
        description:{
            type            :   DataTypes.STRING,
            allowNull       :   false
        }
     
    });



    Role.associate  = (models) => {
        Role.hasMany(models.UserRoleMapping,{foreignKey:'roleId', onDelete: 'cascade'})
    };
    
    return Role; 
};