"use strict"
	
module.exports = function(sequelize, DataTypes) {
    var UserRoleMapping = sequelize.define("UserRoleMapping",{
        id:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            primaryKey      :   true,
            autoIncrement   :   true
        },
    	userId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true,
        },
    	roleId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true,
        },
    
	});

    UserRoleMapping.associate  = (models) => {
        UserRoleMapping.belongsTo(models.User,{foreignKey:'userId', onDelete: 'cascade'});
        UserRoleMapping.belongsTo(models.Role,{foreignKey:'roleId', onDelete: 'cascade'});
    };
    
    return UserRoleMapping;
}
