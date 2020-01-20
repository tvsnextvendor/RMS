"use strict"
module.exports = (sequelize, DataTypes) => {
    const TrainingScheduleResorts = sequelize.define("TrainingScheduleResorts", {
        trainingScheduleResortId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        trainingScheduleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        notificationFileId: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        },
        resortId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        departmentId: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
        },
        divisionId: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            foreignKey: true
        },
        status: {
            type: DataTypes.ENUM('unAssigned', 'assigned', 'inProgress', 'signRequired', 'completed', 'failed', 'expired'),
            allowNull: false,
            defaultValue: 'unAssigned'
        },
        completedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['courseId', 'userId']
                }
            ]
        });
    TrainingScheduleResorts.associate = (models) => {
        TrainingScheduleResorts.belongsTo(models.Resort, { foreignKey: 'resortId' });
        TrainingScheduleResorts.belongsTo(models.User, { foreignKey: 'userId' });
    };
    return TrainingScheduleResorts;
};