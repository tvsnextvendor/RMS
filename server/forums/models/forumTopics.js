"use strict"
	
module.exports = function(sequelize, DataTypes) {
    var ForumTopics = sequelize.define("ForumTopics",{
        forumTopicId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            primaryKey      :   true,
            autoIncrement   :   true
        },
        topics:{
            type: DataTypes.TEXT,
			allowNull: true
        },
        forumId: {
            type: DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        }
	});

    ForumTopics.associate  = (models) => {
        ForumTopics.belongsTo(models.Forum,{foreignKey:'forumId'});
    };
    
    return ForumTopics;
}
