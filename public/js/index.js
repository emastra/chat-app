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
  li.textContent = `${message.from}: ${message.text}`; // instead of innerHTML, textContent has better performance because its value is not parsed as HTML. Moreover, using textContent can prevent XSS attacks.

  document.querySelector('#messages').appendChild(li);
});

socket.on('newLocationMessage', function(message) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.setAttribute('target', '_blank');
  a.textContent = 'My current location';

  li.textContent = `${message.from}: `;
  a.setAttribute('href', message.url);
  li.appendChild(a);
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

var locationButton = document.querySelector('#send-location-btn');
locationButton.addEventListener('click', function(ev) {
  // make sure user have access to geolocation
  if (!navigator.geolocation) {
    return alert('Geolocation not supported in your browser.');
  }

  // fetch the location
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('Unable to fetch location.');
  });
});
