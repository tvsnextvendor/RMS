"use strict"

module.exports = (sequelize, DataTypes) => {
    
    const  Subscription = sequelize.define("Subscription",{
        subscriptionId:{
            type            :  DataTypes.INTEGER,
            allowNull       :  false,
            primaryKey      :  true,
            autoIncrement   :  true
        },
        subscriptionName:{
            type            :   DataTypes.STRING,
            allowNull       :   false
        },
        storageSpace:{
            type            :   DataTypes.STRING,
            allowNull       :   true
        },
       
        maxNoOfCourses:{
            type            :   DataTypes.INTEGER,
            allowNull       :   false
        },
     
        noOfLiciences:{
            type            :   DataTypes.INTEGER,
            allowNull       :   true
        },
        tenure:{
            type            :   DataTypes.STRING,
            allowNull       :   false
        },

     
    });



    Subscription.associate  = (models) => {
      
    };
    
    return Subscription; 
};