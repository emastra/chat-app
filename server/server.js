const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, ensureCase} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
// create http server, configure express to work with http, then add socket.io support
const server = http.createServer(app);
// returns the web socket server
const io = socketIO(server); // ready to accept connection

const users = new Users();

// test middleware
app.use(function(req, res, next) {
  console.log(req.method, req.url, req.params, req.query);
  next();
});

app.use(express.static(publicPath));


// On connection
// socket.on {join, createMessage, createLocationMessage, disconnect}
// io.emit {updateUserList, newMessage, newLocationMessage}
io.on('connection', (socket) => {
  console.log('New user connected. Socket:', socket.id); // every connection has a different socket !!

  // join ev listener // that callback is the acknowledgment set on client
  socket.on('join', (params, callback) => {
    // validation
    params.room = ensureCase(params.room);
    if (!isRealString(params.name) || !isRealString(params.room)) {
      // callback with error parameter (because the acknowledgment callback of join emit in chat.js check for err)
      return callback('Name and room name are required.');
    }
    let names = users.getUserList(params.room);
    if (names.includes(params.name)) {
      return callback(`This username already exists in ${params.room} room.`);
    }

    // Adds the client to the room
    socket.join(params.room);
    // remove the user from potentially other room he could be already in
    users.removeUser(socket.id);
    // add user to the room
    users.addUser(socket.id, params.name, params.room);

    // send the msg to every single connected user in the room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      // send the the user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // send to everyone connected to the room server except for the current user
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    // call callback with no error no parameters
    callback();
  });

  // createMessage event listener. Emit to every single connection
  // acknowledgments allow the request listener to send something back to the request emitter // placing a callback as 2nd arg in the callback function and then call it after...
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  // Listen for createLocationMessage
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // Listen for updateRoomList
  socket.on('updateRoomList', (callback) => {
    var rooms = users.getRoomList();

    callback(rooms);
  });

  // disconnect event
  socket.on('disconnect', () => {
    // remove user from the list when disconnet.
    var user = users.removeUser(socket.id);
    if (user) {
      // if removed, send updated list and message
      console.log('User was disconnected');
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

});


server.listen(port, () => {
  console.log(`App is up on port ${port}`);
});
