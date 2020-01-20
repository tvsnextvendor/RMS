"use strict"

module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
			type: DataTypes.TEXT('long'),
			allowNull: false
		},
        createdBy:{
            type: DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        postId:{
            type: DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true
        },
        status: {
            type: DataTypes.ENUM('active','reportAbuse', 'inAppropriate'),
            allowNull: false,
            defaultValue: "active"
        },
        commentDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
    });
    Comments.associate  = (models) => {
        Comments.belongsTo(models.Post,{foreignKey:'postId'});
        Comments.belongsTo(models.User,{foreignKey:'createdBy'});
    };
    return Comments;
};