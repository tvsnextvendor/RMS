"use strict"
	
module.exports = function(sequelize, DataTypes) {
    var ForumMapping = sequelize.define("ForumMapping",{
        forumMappingId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            primaryKey      :   true,
            autoIncrement   :   true
        },
        forumId: {
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        departmentId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        divisionId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        }
	},{indexes:  [ 
        //{ unique: true, fields: ['forumId', 'divisionId','departmentId'] }
    ]});

    ForumMapping.associate  = (models) => {
        ForumMapping.belongsTo(models.Department,{foreignKey:'departmentId'});
        ForumMapping.belongsTo(models.Division,{foreignKey:'divisionId'}); 
        ForumMapping.belongsTo(models.Forum,{foreignKey:'forumId'}); 
    };
    
    return ForumMapping;
}
