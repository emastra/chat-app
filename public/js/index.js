var socket = io();


socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'Stef',
    text: 'gotcha!'
  });
});

socket.on('newMessage', function(newMessage) {
  console.log('New message in', newMessage);
});



socket.on('disconnect', function() {
  console.log('Disconnected from server');
});
