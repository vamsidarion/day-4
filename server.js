const express = require('express');
const socketIO = require('socket.io');
const app = express();
const server = app.listen(3000);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New connection');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});