"use strict"

module.exports = (sequelize, DataTypes) => {
    const Version = sequelize.define("Version", {
        versionId: {
            type             : DataTypes.INTEGER,
            allowNull        : false,
            primaryKey       : true,
            autoIncrement    : true
        },
        oldCourseId: {
            type            : DataTypes.INTEGER,
            allowNull       : false,
            foreignKey      :   true
        },
        newCourseId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true
        },
        createdBy: {
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true
        },
      
    },{indexes:  [ 
       // { unique: true, fields: ['badgeName', 'resortId'] }
    ]});
    Version.associate  = (models) => {
      //  Badges.belongsTo(models.Post,{foreignKey:'postId'});
      //  Badges.belongsTo(models.User,{foreignKey:'createdBy'});
    };
    return Version;
};