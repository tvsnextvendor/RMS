const model                  = require('../models');
let Utils                    = require('./../utils/Utils');
let responseHandler          = require('./../utils/responseHandler');
const resources              = require('./../utils/constant.json');
const settings 	             = require('../config/configuration');

module.exports = {
    //Create New Post
    createPost(req, res) {
        let userInput = Utils.getReqValues(req);
        //Validate Post Object
        if(!userInput.description){
            responseHandler.getErrorResult(resources.errors.noPostDescription, res );
            return false;
        }
        if(!userInput.forumId){
            responseHandler.getErrorResult(resources.errors.noForumId, res );
            return false;
        }
        if(!userInput.createdBy){
            responseHandler.getErrorResult(resources.errors.noPostUser, res );
            return false;
        }

        model.Post.create(userInput).then((newPost) => {
            if (newPost) {
                responseHandler.getSuccessResult(resources.labels.postCreate,  res );
            } else {
                responseHandler.getErrorResult(resources.errors.errorPostCreate, res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if(err.errors){
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });  
    },

    //Update Post
    updatePost(req, res){
        let userInput = Utils.getReqValues(req);
        //Validate Post Object
        if(!userInput.postId){
            responseHandler.getErrorResult(resources.errors.noPostId, res );
            return false;
        }
        if(userInput.isFavorite == 1){
            userInput.isFavorite = true;
        }
        if(userInput.isFavorite == 2){
            userInput.isFavorite = false;
        }
        model.Post.update(userInput,{
            where: { postId : userInput.postId  }
        }).then(function(updatedPost){
            if(updatedPost && updatedPost[0]){
                responseHandler.getSuccessResult(resources.labels.postUpdate, res);
            }else{
                responseHandler.getErrorResult(resources.errors.errorPostUpdate, res);
            }
        }).catch(function(err){
            let errorMessage = err;
            if(err.errors){
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });  
    },

    getPostDetails(req,res){
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        var limit, page, offset;
        if (userInput.page && userInput.size) {
            limit = userInput.size;
            page = userInput.page ? userInput.page : 1;
            offset = (page - 1) * userInput.size;
        }
        // if(!userInput.forumId){
        //     responseHandler.getErrorResult(resources.errors.noForumId, res );
        //     return false;
        // }
        if(userInput.forumId){
            conditions['forumId'] = userInput.forumId;
        }
        if(userInput.status == 'recent'){
            limit = 10
        }
        if(userInput.status == 'isFavorite'){
            conditions['isFavorite'] = true;
        }
        if(userInput.userId){
            conditions['createdBy'] = userInput.userId;
        }
        model.Post.findAll({
            where : conditions,
            include :[
            {model: model.Forum,attributes:['forumId','forumName','forumAdmin']},
            {model: model.Comments,include:
            [{model:model.User,attributes:['userId','userName']}]},
            {model :model.User,attributes:['userId','userName']}],
            order: [["created", "DESC"]],
            offset  : (offset || settings.OFFSET),
            limit   : (limit  || settings.LIMIT)
        }).then(function(posts){
            if(posts.length>0){
                responseHandler.getSuccessResult(posts, res);
            }else{
                return responseHandler.getNotExistsResult(posts,res);
            }
           
        })
    },
    //Delete Specific Post in a Forum
    deletePost(req, res) {
        let userInput = Utils.getReqValues(req);;
        //Validate Post Object
        if(!userInput.postId){
            responseHandler.getErrorResult(resources.errors.noPostId, res );
            return false;
        }
		model.Post.destroy({
	        where: { postId : userInput.postId}
	    }).then(function(deletedPost, status){
	        if(deletedPost){
	           responseHandler.getSuccessResult(resources.labels.postDelete, res);
	        }else{
	           responseHandler.getErrorResult(resources.errors.errorPostDelete, res);
	        }
	    }).catch(function(err){
	        let errorMessage = err;
            if(err.errors){
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
	    });		
    }
};