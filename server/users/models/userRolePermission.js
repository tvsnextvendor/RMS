"use strict"

module.exports = function (sequelize, DataTypes) {
    var UserRolePermission = sequelize.define("UserRolePermission", {
        userRolePerid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        divisionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        designationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        web: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        mobile: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    UserRolePermission.associate = (models) => {
        UserRolePermission.hasMany(models.UserPermission, { foreignKey: 'userRolePerid', as: 'userPermission', onDelete: 'cascade' });
        UserRolePermission.belongsTo(models.Department, { foreignKey: 'departmentId', onDelete: 'cascade' });
        UserRolePermission.belongsTo(models.Resort, { foreignKey: 'resortId', onDelete: 'cascade' });
        UserRolePermission.belongsTo(models.Division, { foreignKey: 'divisionId' });
        UserRolePermission.belongsTo(models.Designation, { foreignKey: 'designationId', onDelete: 'cascade' });
        UserRolePermission.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
    };
    return UserRolePermission;
}
