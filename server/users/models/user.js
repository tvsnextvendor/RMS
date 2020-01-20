"use strict"
var Utils = require('./../utils/Utils');
module.exports = (sequelize, DataTypes) => {
    const tableName = 'User';
    const hooks = {
        beforeCreate(User) {
            User.password = Utils.password(User);
        },
        beforeBulkCreate(User) {
            User.forEach(function (value) {
                User.password = Utils.password(value);
            });
        }
    };
    const User = sequelize.define("User", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordReset: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        homeNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            isEmail: true
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        employeeNo: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        userImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reportingTo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM('web', 'mobile', 'web/mobile', 'mobileAdmin', 'web/mobileAdmin'),
            allowNull: false,
            defaultValue: 'web'
        },
        accessSet: {
            type: DataTypes.ENUM('FullAccess', 'ApprovalAccess'),
            allowNull: false,
            defaultValue: 'FullAccess'
        },
        agreeTerms: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { hooks, tableName });
    User.associate = (models) => {
        User.hasMany(models.UserRoleMapping, { foreignKey: 'userId', as: 'UserRole', onDelete: 'cascade' });
        User.hasMany(models.ResortUserMapping, { foreignKey: 'userId', onDelete: 'cascade' });
        User.hasMany(models.UserRolePermission, { foreignKey: 'userId', 'onDeleted': 'cascade' });
        User.belongsTo(models.User, { foreignKey: 'reportingTo', onDelete: 'cascade', as: 'reportDetails' });
    };
    return User;
};