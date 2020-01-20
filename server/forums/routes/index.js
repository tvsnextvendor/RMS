const express = require('express');
const router = express.Router();

const courseRouter          = require('./courses');
const forumRouter           = require('./forum');
const userRouter        = require('./user');
const postRouter        = require('./post');
const commentRouter        = require('./comment');
const certificateRouter        = require('./certificate');
const badgeRouter          = require('./badge');

router.use('/forum', forumRouter); 
router.use('/course', courseRouter); 
router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/', certificateRouter);
router.use('/badge',badgeRouter);


module.exports = router;
