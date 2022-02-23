/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('user', user => {
    users.push({name: user, id: socket.id});
    socket.broadcast.emit('user', user);
  });
  socket.on('disconnect', () => { 
    const userLeaving = users.splice(users.find((item, index) => (item.id === socket.id) && index), 1);
    socket.broadcast.emit('user-left', userLeaving[0].name);
  });
});