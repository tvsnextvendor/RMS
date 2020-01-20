
'use strict';
const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const loginController = require('./../controllers/login');

router.post('/login', loginController.login);
router.post('/register', loginController.register);
router.post('/forgetPassword', loginController.forgetPassword);
router.post('/mobileforgetPassword', loginController.mobileforgetPassword);
router.post('/resetpassword', loginController.resetpassword);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/logins',passport.authenticate('ldapauth', { session: false }),function(req,res){
    console.log(req);
    console.log(res);
    res.send({ status: 'ok' });
});
module.exports = router;
