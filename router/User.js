const express = require('express');
const {
  allUsers,
  sendRequest,
  getRequest,
  acceptRequest,
  allFriends,
} = require('../controller/User');
const router = express.Router();

router.get('/:userId', allUsers);
router.post('/request', sendRequest);
router.get('/getrequest/:userId', getRequest);
router.post('/acceptrequest', acceptRequest);
router.get('/friends/:userId', allFriends);
module.exports = router; // Ensure you export the router correctly
