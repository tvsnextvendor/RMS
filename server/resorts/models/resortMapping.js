"use strict"
	
module.exports = function(sequelize, DataTypes) {
    var ResortMapping = sequelize.define("ResortMapping",{
        resortMappingId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            primaryKey      :   true,
            autoIncrement   :   true
        },
    	divisionId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   true,
            foreignKey      :   true,
        },
        resortId:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false,
            foreignKey      :   true,
        },
        designationId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  true,
            foreignKey      :  true  
        }
    
	});

    ResortMapping.associate  = (models) => {
      ResortMapping.belongsTo(models.Division,{foreignKey:'divisionId', onDelete: 'cascade'});
      ResortMapping.belongsTo(models.Designation,{foreignKey :'designationId',onDelete : 'cascade' });
    };
    
    return ResortMapping;
}
