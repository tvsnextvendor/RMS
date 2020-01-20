const express = require('express');
const router = express.Router();

const usersRouter           = require('./users');
const roleRouter            = require('./role');
const userPermissionRouter  = require('./userPermission');

router.use('/user', usersRouter); 
router.use('/role',roleRouter);
router.use('/permission',userPermissionRouter);

module.exports = router;
