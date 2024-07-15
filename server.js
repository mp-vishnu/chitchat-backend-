const app = require('./app');
const http = require('http').createServer(app); // Create HTTP server
const io = require('socket.io')(http); // Pass HTTP server to socket.io

const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Config
dotenv.config({path: 'config/config.env'});

// Connecting to database
connectDatabase();

// Socket.io setup
io.on('connection', socket => {
  console.log('A user connected via server.js', socket.id);
  // Additional socket.io logic as needed
});

http.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  console.log('Socket.IO running on the same port as Express');
});
