const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.basicConnection = (req, res) => {
  res.status(200).json({message: 'Connection successful'});
};
exports.createUser = async (req, res) => {
  const {name, email, password} = req.body;
  const image =
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80';

  const newUser = new User({name, email, password, image});
  console.log('newuser <><><> ', newUser);

  try {
    await newUser.save();
    res.status(200).json({message: 'User registered successfully!'});
  } catch (error) {
    console.error('Error creating a user', error);
    res.status(500).json({message: 'Error registering the user'});
  }
};

// Uncomment and adjust the loginUser function if needed
exports.loginUser = async (req, res) => {
  console.log('inside api loginuser <><><> ', req.body);
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }

    if (user.password !== password) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: user._id}, secretKey);
    res.status(200).json({authtoken: token, id: user._id, name: user.name});
  } catch (error) {
    console.log('Error logging in', error);
    res.status(500).json({message: 'Error logging in'});
  }
};
