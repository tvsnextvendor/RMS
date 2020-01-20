var express = require('express');
var router = express.Router();
var resortController = require('./../controllers/resort');

router.post('/Add', resortController.add);
router.get('/List', resortController.list);
router.put('/Update/:resortId', resortController.update);
router.delete('/Delete/:resortId', resortController.delete);
router.get('/getResortDetails', resortController.getResortDetails);
router.get('/getAllResorts', resortController.getAllResorts);

module.exports = router;
