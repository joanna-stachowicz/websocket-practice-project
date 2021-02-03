const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on Port: 8000');
});
const io = socket(server);

let tasks = [];

io.on('connection', (socket) => {
  console.log('New client\'s id is: ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    tasks.splice(id, 1);
    socket.broadcast.emit('removeTask', id);
  });
});

app.use((reg, res) => {
  res.status(404).json({ message: 'Not found...' });
});