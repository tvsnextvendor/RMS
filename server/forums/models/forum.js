"use strict"

module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define("Forum", {
        forumId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        forumName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        forumAdmin:{
            type: DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        assignedTo: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
        },
        startDate:{
            type                : DataTypes.DATE,
            allowNull           : true
        },
        endDate:{
            type                : DataTypes.DATE,
            allowNull           : true
        },
        isActive:{
            type                : DataTypes.BOOLEAN,
            defaultValue        : true
        },
        isPinned:{
            type                : DataTypes.BOOLEAN,
            defaultValue        : false
        },
        lastActiveDate:{
            type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        createdBy:{
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true,
        },
    }, {indexes:  [ 
        { unique: true, fields: [ sequelize.fn('lower', sequelize.col('forumName')) ] }
    ]});
    Forum.associate  = (models) => {
        Forum.belongsTo(models.User,{foreignKey:'forumAdmin'});
        Forum.hasMany(models.ForumMapping,{foreignKey:'forumId', as:'Divisions', onDelete: 'cascade'}); 
        Forum.hasMany(models.ForumTopics,{foreignKey:'forumId', as:'Topics', onDelete: 'cascade'}); 
        Forum.hasMany(models.Post,{foreignKey:'forumId', onDelete: 'cascade'}); 
        Forum.hasMany(models.Notification,{foreignKey:'forumId', as:'Notifications', onDelete: 'cascade'}); 
    };
    return Forum;
};