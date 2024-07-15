const express = require('express');
const app = express(); // creating an instance
const cors = require('cors');
const Message = require('./models/message');
// Middleware
app.use(express.json()); // req response format
app.use(cors());

// Route imports
const usersRouter = require('./router/User');
const authRouter = require('./router/Auth');
const msgRouter = require('./router/Message');

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/msg', msgRouter);

module.exports = app;
