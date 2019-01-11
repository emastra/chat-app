const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

// instantiate an instance of User class
var users = new Users();

module.exports = (socket, io) => {
  // socket.on {join, createMessage, createLocationMessage, disconnect}
  // io.emit {updateUserList, newMessage, newLocationMessage}
  console.log('New user connected');
  console.log('socket.id:', socket.id); // every connection has a different socket !!
  // Admin messages were here but now are inside the join event. We want to notify only when the user actually finished the join process

  // join ev listener // that callback is the acknowledgment
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      // callback with error parameter (because the acknowledgment callback of join emit in chat.js check for err)
      // return to stop execution if data is not valid
      return callback('Name and room name are required.');
    }

    // Adds the client to the room, and fires optionally a callback with err signature (if any).
    socket.join(params.room);
    // remove the user from potentially other room he could be already in
    users.removeUser(socket.id);
    // now add him to the room
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // all the ways we emit events on the server and corresponding room events:
    // send the msg to every single connected user
    //// io.emit >> io.to(room_name).emit
    // to everyone connected to the socket server except for the current user
    //// socket.broadcast.emit >> socket.broadcast.to(room_name).emit
    // specifically to one user
    //// socket.emit >> no reason to address specific room
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    // call callback with no parameters
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

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    // remove user from the list when disconnet.
    // Return it so we can check if it was already present in the room for real, and be able to access room inside user
    var user = users.removeUser(socket.id);
    if (user) {
      // if removed, send updated list and message
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

};
