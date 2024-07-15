const express = require('express');
const app = express();
const Message = require('../models/message');
const http = require('http').createServer(app); // Create HTTP server

const io = require('socket.io')(http); // Pass HTTP server to socket.io

const userSocketMap = {};

io.on('connection', socket => {
  console.log('A user connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('User ID:', userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log('User socket data:', userSocketMap);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    console.log('User socket data after disconnect:', userSocketMap);
  });

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    const receiverSocketId = userSocketMap[receiverId];

    console.log('Receiver ID:', receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message,
      });
      console.log('Message sent to receiver', receiverId);
    } else {
      console.log('Receiver socket ID not found for user', receiverId);
    }
  });
});

exports.sendMessage = async (req, res) => {
  console.log('sendMessage <><><> ', req.body);
  try {
    const {senderId, receiverId, message} = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('Emitting newMessage event to the receiver', receiverId);
      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('Receiver socket ID not found for user', receiverId);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({error: 'Failed to send message'});
  }
};

exports.fetchMessages = async (req, res) => {
  console.log('messages <><><> ', req.query);
  try {
    const {senderId, receiverId} = req.query;
    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    }).populate('senderId', '_id name');

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({error: 'Failed to fetch messages'});
  }
};

// Remove http.listen(6000, ...) from here
