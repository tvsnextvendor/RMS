"use strict"

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
			type: DataTypes.TEXT('long'),
			allowNull: false
		},
        forumId:{
            type: DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        votesCount:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue : 0
        },
        createdBy:{
            type: DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        createdDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		modifiedDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        isFavorite:{
            type            :   DataTypes.BOOLEAN,
            defaultValue    :   false
        },
    });
    Post.associate  = (models) => {
        Post.belongsTo(models.Forum,{foreignKey:'forumId',onDelete: 'cascade'});
        Post.belongsTo(models.User,{foreignKey:'createdBy',onDelete: 'cascade'})
        Post.hasMany(models.Comments,{foreignKey:'postId', onDelete: 'cascade'}); 
       // Post.belongsTo(models.User,{foreignKey:'createdBy'});
    };
    return Post;
};