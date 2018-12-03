var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


socket.on('newMessage', function(message) {
  console.log('New message in', message);
  var li = document.createElement('li');
  li.innerHTML = `${message.from}: ${message.text}`;

  document.querySelector('#messages').appendChild(li);
});

// Acknowledgements, just add a callback function as 3rd argument

document.querySelector('#message-form').addEventListener('submit', function(ev) {
  ev.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: document.querySelector('[name=message-input]').value
  }, function() {

  });
});
