"use strict"

module.exports = function (sequelize, DataTypes) {
    var CertificateMapping = sequelize.define("CertificateMapping", {
        certificateMappingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        certificateId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        trainingClassId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        }
    }, {
            indexes: [
                { unique: true, fields: ['courseId', 'certificateId'] },
                { unique: true, fields: ['trainingClassId', 'certificateId'] }
            ]
        });
    CertificateMapping.associate = (models) => {
        CertificateMapping.belongsTo(models.Certificate, { foreignKey: 'certificateId',onDelete: 'cascade' });
        CertificateMapping.belongsTo(models.Course, { foreignKey: 'courseId',onDelete: 'cascade' });
        CertificateMapping.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId',onDelete: 'cascade' });
    };
    return CertificateMapping;
}
