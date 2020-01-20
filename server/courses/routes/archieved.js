const express = require('express');
const router = express.Router();
const archievedController = require('./../controllers/archieved');

router.post('/archieved', archievedController.createArchieved);
router.put('/archieved/:archievedId', archievedController.updateArchieved);
router.delete('/archieved/:archievedId', archievedController.deleteArchieved);
router.get('/archieved', archievedController.getArchieved);

module.exports = router;
