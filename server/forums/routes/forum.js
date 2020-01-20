const express = require('express');
const router = express.Router();
const forumController = require('./../controllers/forum');

/* GET users listing. */


router.post('/', forumController.createNewForum);
router.get('/', forumController.getForumList);
router.get('/:forumId', forumController.getSpecificForum);
router.delete('/:forumId', forumController.deleteForum);
router.put('/:forumId',forumController.update)


module.exports = router;
