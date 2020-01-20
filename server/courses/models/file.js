"use strict"

module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define("File", {
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fileSize: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileExtension: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileLength: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        inputUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transcodeUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        draft: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
    File.associate = (models) => {
        File.hasMany(models.FilePermission, { foreignKey: 'fileId', onDelete: 'cascade' });
        File.hasMany(models.FileMapping, { foreignKey: 'fileId', onDelete: 'cascade' });
    };
    return File;
};