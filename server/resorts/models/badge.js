"use strict"

module.exports = (sequelize, DataTypes) => {
    const Badges = sequelize.define("Badges", {
        badgeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        badgeName: {
            type: DataTypes.ENUM('gold','platinum', 'bronze','silver'),
            allowNull: false,
            defaultValue: "gold"
        },
        percentage:{
            type: DataTypes.INTEGER,
            allowNull       :   false,
        },
        resortId: {
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        }
      
    },{indexes:  [ 
        { unique: true, fields: ['badgeName', 'resortId'] }
    ]});
    Badges.associate  = (models) => {
    };
    return Badges;
};