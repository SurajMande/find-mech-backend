const express = require('express');
const { broadcastRequest } = require('../controllers/broadcastController');
const router = express.Router();

router.post('/request', broadcastRequest);

module.exports = router;
