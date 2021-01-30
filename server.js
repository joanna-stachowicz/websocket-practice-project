const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on Port: 8000');
});
const io = socket(server);

app.use((reg, res) => {
  res.status(404).json({ message: 'Not found...' });
});