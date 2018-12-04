const path = require('path');
const http = require('http');
const express = require('express');
// socket.io create a websocket server and there is the client library too.
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public') // __dirname is always the directory in which the currently executing script resides
const port = process.env.PORT || 3000;

var app = express();
// we have to use http module ourselves, configure express to work with http, then add socket.io support
var server = http.createServer(app);
// returns our web socket server // here we can emitting and listening to events // this is how we commuincate between server and client
var io = socketIO(server); // ready to accept connection

app.use(express.static(publicPath));


io.on('connection', (socket) => {
  console.log('New user connected');

  // Admin messages

  // respond to the socket which connected
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // broadcast to any other already connected sockets
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


  // createMessage event listener. Emit to every single connection
  // acknowledgments allow the request listener to send something back to the request emitter // placing a callback as 2nd arg in the callback function and then call it after...
  socket.on('createMessage', (message, callback) => {
    console.log('Message to create', message);
    // socket.emit emits an event to a single conn, io.emit emits an event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  // Listen for createLocationMessage
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

});


server.listen(port, () => {
  console.log(`App is up on port ${port}`);
});
