const express = require('express');
const router = express.Router();
const postController = require('./../controllers/post');

router.post('/', postController.createPost);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);
router.get('/',postController.getPostDetails)

module.exports = router;
