const express = require('express');
const router = express.Router();


const divisionRouter        = require('./division');
const departmentRouter      = require('./department');
const designationRouter      = require('./designation');
const resortRouter      = require('./resort');

router.use('/resort',resortRouter);
router.use('/designation',designationRouter);
router.use('/division',divisionRouter);
router.use('/department',departmentRouter);
module.exports = router;
