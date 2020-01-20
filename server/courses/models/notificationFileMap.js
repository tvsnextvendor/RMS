"use strict"

module.exports = (sequelize, DataTypes) => {
    const NotificationFileMap = sequelize.define("NotificationFileMap", {
        NotificationFileMapId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        notificationFileId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        divisionId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('assigned','completed'),
            allowNull: false,
            defaultValue: 'assigned'
        },
    });
    NotificationFileMap.associate = (models) => {
        NotificationFileMap.belongsTo(models.NotificationFile, { foreignKey: 'notificationFileId', onDelete: 'cascade' });
    };
    return NotificationFileMap;
}