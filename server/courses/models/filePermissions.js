"use strict"

module.exports = (sequelize, DataTypes) => {
    const FilePermission = sequelize.define("FilePermission", {
        filePermissionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        divisionId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        filePermissionType: {
            type: DataTypes.ENUM('Private', 'Public', 'Restricted'),
            allowNull: false,
            defaultValue: "Public"
        },
    });
    FilePermission.associate  = (models) => {
        FilePermission.belongsTo(models.User,{foreignKey:'userId', onDelete: 'cascade'});
        FilePermission.belongsTo(models.Division,{foreignKey:'divisionId', onDelete: 'cascade'});
        FilePermission.belongsTo(models.Department,{foreignKey:'departmentId', onDelete: 'cascade'});
    };
    return FilePermission;
};