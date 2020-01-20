"use strict"

module.exports = (sequelize, DataTypes) => {
    const Resort = sequelize.define("Resort", {
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        resortName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        subscriptionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        },
        allocatedSpace: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM,
            values: ['Active', 'InActive', 'Expired'],
            defaultValue: 'Active'
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        totalStorage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        utilizedSpace: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalNoOfUsers: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        }
    });


    Resort.associate = (models) => {
        Resort.hasMany(models.ResortUserMapping, { foreignKey: 'resortId', onDelete: 'cascade' })
        Resort.hasMany(models.ResortMapping, { foreignKey: 'resortId', as: 'resortMapping', onDelete: 'cascade' });
    };

    return Resort;
};