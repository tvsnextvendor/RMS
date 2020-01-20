"use strict"

module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define("Certificate", {
        certificateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        certificateName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        certificateHtml: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certificateHtmlPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certificateImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        certificateImagePath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        }
    }, {
            indexes: [
                { unique: true, fields: ['certificateName', 'resortId'] }
            ]
        });
    Certificate.associate = (models) => {
        Certificate.hasMany(models.CertificateMapping, { foreignKey: 'certificateId' , onDelete: 'cascade' });
        Certificate.belongsTo(models.Resort, { foreignKey: 'resortId' , onDelete: 'cascade' });
    };
    return Certificate;
};