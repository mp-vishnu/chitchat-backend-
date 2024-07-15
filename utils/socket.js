const http = require('http');
const socketIo = require('socket.io');
const app = require('../app'); // Ensure the correct path to app.js

const server = http.createServer(app);
const io = socketIo(server);

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

module.exports = {server, io};
