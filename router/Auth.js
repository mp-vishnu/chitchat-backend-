const express = require('express');
const {basicConnection, createUser, loginUser} = require('../controller/Auth');
const router = express.Router();

router.get('/connection', basicConnection); // Un-commented for basic connection
router.post('/signup', createUser);
router.post('/login', loginUser);

module.exports = router; // Ensure you export the router correctly
