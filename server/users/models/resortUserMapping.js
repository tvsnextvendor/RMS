"use strict"

module.exports = function (sequelize, DataTypes) {
    var ResortUserMapping = sequelize.define("ResortUserMapping", {
        resortUserMappingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        divisionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        },
        designationId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true,
        }
    });
    ResortUserMapping.associate = (models) => {
        ResortUserMapping.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
        ResortUserMapping.belongsTo(models.Resort, { foreignKey: 'resortId', onDelete: 'cascade' });
        ResortUserMapping.belongsTo(models.Division, { foreignKey: 'divisionId', onDelete: 'cascade' });
        ResortUserMapping.belongsTo(models.Department, { foreignKey: 'departmentId', onDelete: 'cascade' });
        ResortUserMapping.belongsTo(models.Designation, { foreignKey: 'designationId', onDelete: 'cascade' });
    };
    return ResortUserMapping;
}
