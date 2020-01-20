const Subscription    = require('../models').Subscription;
var Utils           = require('./../utils/Utils');
var responsehandler = require('./../utils/responseHandler');



module.exports = {
  list(req, res) {
    var userInput = Utils.getReqValues(req);
    var conditions = {};
  
    
    if(userInput.subscriptionId){
      conditions['subscriptionId']    =   userInput.subscriptionId;
    }
    if (userInput.page && userInput.size) {
			var limit = userInput.size;
			var page = userInput.page ? userInput.page : 1;
			var offset = (page - 1) * userInput.size;
    }
    Subscription.findAndCountAll({
      where:conditions,
      offset: offset,
      limit: limit,
      order: [['created', 'DESC']],
    }).then((result) => 
      {
        if(result.rows.length>0){
            return responsehandler.getSuccessResult(result, res);
        }else{
           return  responsehandler.getNotExistsResult(result,res)
        }
      })
      .catch(function (error) {
        var errorMessage = Utils.constructErrorMessage(error);
       return responsehandler.getErrorResult(errorMessage,res );
    });
  },

  add(req, res) {
    const userInput = Utils.getReqValues(req);
    let m;
    let response = userInput.tenure.split(" ");
    let num = JSON.parse(response[0]); 
    let type = response[1];

    if(userInput.subscriptionName){
        if(type){

        if(type == 'year'){
            m = num * 12;
            userInput.tenure = m + ' month'
        }
        Subscription
        .create(userInput)
        .then((subscription) => {
          return responsehandler.getSuccessResult(subscription, res);
        })
        .catch(function (error) {
          var errorMessage = Utils.constructErrorMessage(error);
          return responsehandler.getErrorResult(errorMessage,res );
      });
    }
      
    }else{
        res.status(400).send({
            message: 'subscription Name is mandatory',
          });
    }
  
  },

  update(req, res) {
    let Data = Utils.getReqValues(req);
    Subscription
      .findOne({where:{
        subscriptionId : Data.subscriptionId
      }
      })
      .then(sub => {
        if (!sub) {
          return res.status(400).send({
            message: 'Subscription Not Found',
          });
        }
        Subscription.update(Data, {where: {subscriptionId: Data.subscriptionId}})
          .then((result) => {
              return responsehandler.getUpdateResult(result,res);
            })
          .catch((error) => 
          {
            var errorMessage = Utils.constructErrorMessage(error);
            return responsehandler.getErrorResult(errorMessage,res );
            }
        );
      })
      .catch((error) =>{
        var errorMessage = Utils.constructErrorMessage(error);
       return responsehandler.getErrorResult(errorMessage,res );
      } )
  },

  delete(req, res) {
    let Data = Utils.getReqValues(req);
    return Subscription
      .findOne({where:{ subscriptionId : Data.subscriptionId}})
      .then(subscription => {
        if (!department) {
          return res.status(400).send({
            message: 'Subscription Not Found',
          });
        }
        return Subscription
          .destroy({where:{ subscriptionId : Data.subscriptionId}})
          .then(() => res.status(200).send({message:'subscription Deleted successfully'}))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};