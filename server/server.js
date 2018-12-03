const path = require('path');
const http = require('http');
const express = require('express');
// socket.io create a websocket server and there is the client library too.
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public') // __dirname is always the directory in which the currently executing script resides
const port = process.env.PORT || 3000;

var app = express();
// we have to use http module ourselves, configure express to work with http, then add socket.io support
var server = http.createServer(app);
// returns our web socket server // here we can emitting and listening to events // this is how we commuincate between server and client
var io = socketIO(server); // ready to accept connection

app.use(express.static(publicPath));


io.on('connection', function(socket) {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Deka',
    text: 'meet at 6pm?',
    createdAt: 123456789
  });

  socket.on('createMessage', function(message) {
    console.log('Message to create', message);
  });



  socket.on('disconnect', function() {
    console.log('User was disconnected');
  });

});


server.listen(port, function() {
  console.log(`App is up on port ${port}`);
});
