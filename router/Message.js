const express = require('express');
const {sendMessage, fetchMessages} = require('../controller/Message');
const router = express.Router();

router.post('/send', sendMessage);
router.get('/fetch', fetchMessages);

module.exports = router;
