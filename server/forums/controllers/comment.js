const model = require('../models');
let Utils = require('./../utils/Utils');
let responseHandler = require('./../utils/responseHandler');
const resources = require('./../utils/constant.json');
const settings = require('../config/configuration');

module.exports = {
    //Create New Comment
    createComment(req, res) {
        let userInput = Utils.getReqValues(req);
        //Validate Comment Object
        if (!userInput.description) {
            responseHandler.getErrorResult(resources.errors.noCommentDescription, res);
            return false;
        }
        if (!userInput.postId) {
            responseHandler.getErrorResult(resources.errors.noPostId, res);
            return false;
        }
        if (!userInput.createdBy) {
            responseHandler.getErrorResult(resources.errors.noPostUser, res);
            return false;
        }
        model.Comments.create(userInput).then((newPost) => {
            if (newPost) {
                responseHandler.getSuccessResult(resources.labels.commentCreate, res);
            } else {
                responseHandler.getErrorResult(resources.errors.errorCommentCreate, res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });

    },

    //Update Specific Comment in a Post
    updateComment(req, res) {
        let userInput = Utils.getReqValues(req);
        //Validate Comment Object
        if (!userInput.commentId) {
            responseHandler.getErrorResult(resources.errors.noCommentId, res);
            return false;
        }

        model.Comments.update(userInput, {
            where: { commentId: userInput.commentId }
        }).then(function (updatedComment) {
            if (updatedComment && updatedComment[0]) {
                responseHandler.getSuccessResult(resources.labels.commentUpdate, res);
            } else {
                responseHandler.getErrorResult(resources.errors.errorCommentUpdate, res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    //Delete Specific Comment in a Forum
    deleteComment(req, res) {
        let userInput = Utils.getReqValues(req);;
        //Validate Comment Object
        if (!userInput.commentId) {
            responseHandler.getErrorResult(resources.errors.noCommentId, res);
            return false;
        }
        model.Comments.destroy({
            where: { commentId: userInput.commentId }
        }).then(function (deletedComment, status) {
            if (deletedComment) {
                responseHandler.getSuccessResult(resources.labels.commentDelete, res);
            } else {
                responseHandler.getErrorResult(resources.errors.errorCommentDelete, res);
            }
        }).catch(function (err) {
            let errorMessage = err;
            if (err.errors) {
                errorMessage = Utils.constructErrorMessage(err);
            }
            responseHandler.getErrorResult(errorMessage, res);
        });
    },
    getComment(req, res) {
        let userInput = Utils.getReqValues(req);
        let conditions = {};
        if(userInput.postId){
            conditions['postId'] = userInput.postId;
        }
        if(userInput.status){
            conditions['status'] = userInput.status;
        }
        model.Comments.findAndCountAll({
             where: conditions,
             include:[{model :model.User,attributes:['userId','userName']}],
             order:[['created','ASC']]
             }).then(function (commentRes) {
            responseHandler.getSuccessResult(commentRes, res);
        });
    }
};