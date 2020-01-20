"use strict"

module.exports = (sequelize, DataTypes) => {
    
    const  UserPermission = sequelize.define("UserPermission",{
        userPermissionId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  false,
            primaryKey      :  true,
            autoIncrement   :  true
        },
        moduleName:{
            type            :   DataTypes.STRING,
            allowNull       :   false
        },
        edit:{
            type            :   DataTypes.BOOLEAN,
            defaultValue    :   false
        },
        view :{
            type            :   DataTypes.BOOLEAN,
            defaultValue    :   false
        },
        upload :{
            type            :   DataTypes.BOOLEAN,
            defaultValue    :   false
        },
        delete :{
            type            :   DataTypes.BOOLEAN,
            defaultValue    :   false
        },
        userRolePerid:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true,
        }
    });
    UserPermission.associate  = (models) => {
    };
    return UserPermission; 
};