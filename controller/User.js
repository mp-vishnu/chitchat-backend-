const User = require('../models/user');

exports.allUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({_id: {$ne: userId}});
    res.json(users);
  } catch (error) {
    console.log('Error', error);
  }
};

exports.sendRequest = async (req, res) => {
  const {senderId, receiverId, message} = req.body;

  console.log(senderId);
  console.log(receiverId);
  console.log(message);

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({message: 'Receiver not found'});
  }

  receiver.requests.push({from: senderId, message});
  await receiver.save();

  res.status(200).json({message: 'Request sent succesfully'});
};

exports.getRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('userId in getreq <><><> ', userId);
    //    const user = await User.findById(userId);

    const user = await User.findById(userId).populate(
      'requests.from',
      'name email image',
    );
    console.log('user <><><> sender', user);
    if (user) {
      console.log('requests <><><> ', user.requests);
      res.json(user.requests);
    } else {
      res.status(400);
      throw new Error('User not found');
    }
  } catch (error) {
    console.log('error', error);
  }
};

exports.acceptRequest = async (req, res) => {
  console.log('accept req <><><> ', req.body);
  try {
    const {userId, requestId} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {requests: {from: requestId}},
      },
      {new: true},
    );

    if (!updatedUser) {
      return res.status(404).json({message: 'Request not found'});
    }

    await User.findByIdAndUpdate(userId, {
      $push: {friends: requestId},
    });

    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: {friends: userId},
    });

    if (!friendUser) {
      return res.status(404).json({message: 'Friend not found'});
    }

    res.status(200).json({message: 'Request accepted sucesfully'});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({message: 'Server Error'});
  }
};

exports.allFriends = async (req, res) => {
  try {
    const userId = req.params.userId;

    const users = await User.findById(userId).populate(
      'friends',
      'name email image',
    );
    res.json(users.friends);
  } catch (error) {
    console.log('Error fetching user', error);
  }
};
