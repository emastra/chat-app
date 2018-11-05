const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public') // __dirname equals to this file folder
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
// returns our web socket server // here we can emitting and listening to events // this is how we commuincate between server and client
var io = socketIO(server); // ready to accept connection

app.use(express.static(publicPath));

io.on('connection', function(socket) {
  console.log('New user connected');

  socket.on('disconnect', function() {
    console.log('User was disconnected');
  });
});

server.listen(port, function() {
  console.log(`App is up on port ${port}`);
});
