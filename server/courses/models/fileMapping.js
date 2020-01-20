"use strict"
module.exports = (sequelize, DataTypes) => {
    const FileMapping = sequelize.define("FileMapping", {
        fileMappingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        }
    });
    FileMapping.associate = (models) => {
        FileMapping.belongsTo(models.File, { foreignKey: 'fileId', onDelete: 'cascade' });
        FileMapping.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId', onDelete: 'cascade' });
        FileMapping.belongsTo(models.Course, { foreignKey: 'courseId', onDelete: 'cascade' });
    };
    return FileMapping;
};