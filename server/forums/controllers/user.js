const User                  = require('../models').User;
const UserRoleMapping       = require('../models').UserRoleMapping;
const Utils                   = require('./../utils/Utils');
const responsehandler         = require('./../utils/responseHandler');

module.exports = {
    //get user Details
    getEmployeeDetails(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        let whereconditions = {};
        let mapCodn = {};
        

        if(userInput.userId){
            conditions['userId']    =   userInput.userId;
        }
        if(userInput.divisionId){
            conditions['divisionId'] = JSON.parse(userInput.divisionId);
        }
        if(userInput.departmentId){
            conditions['departmentId'] = JSON.parse(userInput.departmentId);
        }
        if(userInput.createdBy){
            conditions['createdBy'] = userInput.createdBy;
        }
        whereconditions['roleId'] = 4;
        User
        .findAll({
            where:conditions,
            attributes : ['userId',
                        'userName',
                       
                ],
                    include:[{
                        model: Model.ResortUserMapping,
                        attributes: ['divisionId', 'departmentId', 'designationId'],
                        where: mapCodn
                    },{
                        model:UserRoleMapping,as:'UserRole',
                        where:whereconditions,
                        attributes:[]
                        }],
            order: [
                ['created', 'DESC']
            ]
        })
        .then((result) => 
        {
           if(result.length>0){
            return responsehandler.getSuccessResult(result,'resort list ', res);
            }else{
            return responsehandler.getNotExistsResult(result,res);
            }
        })
        .catch(function (error) {
            let errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage,res);
        });
    },


};