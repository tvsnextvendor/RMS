"use strict"

module.exports = function (sequelize, DataTypes) {
    var CertificateUserMapping = sequelize.define("CertificateUserMapping", {
        CertificateUserMappingId: {
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
        },
        certificateGenerated: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        badgeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
    }, {
            indexes: [
                { unique: true, fields: ['courseId', 'certificateId'] },
                { unique: true, fields: ['trainingClassId', 'certificateId'] }
            ]
        });

        CertificateUserMapping.associate = (models) => {
            CertificateUserMapping.belongsTo(models.Certificate, { foreignKey: 'certificateId' });
            CertificateUserMapping.belongsTo(models.TrainingClass, { foreignKey: 'trainingClassId' });
            CertificateUserMapping.belongsTo(models.Course, { foreignKey: 'courseId' });
            CertificateUserMapping.belongsTo(models.Badges,{foreignKey:'badgeId'});
    };
    
    return CertificateUserMapping;
}
