const express = require('express');
const router = express.Router();
const commentController = require('./../controllers/comment');

router.post('/', commentController.createComment);
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);
router.get('/:postId', commentController.getComment);

module.exports = router;
