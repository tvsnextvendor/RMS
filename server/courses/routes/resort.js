const express = require('express');
const router = express.Router();
const resortController = require('./../controllers/resort');


router.get('/getresortDivision', resortController.getresortDivision);
module.exports = router;
