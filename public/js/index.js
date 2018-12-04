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
  var messageInput = document.querySelector('[name=message-input]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageInput.value
  }, function() {
    messageInput.value = '';
  });
});

var locationButton = document.querySelector('#send-location-btn');
locationButton.addEventListener('click', function(ev) {
  // make sure user have access to geolocation
  if (!navigator.geolocation) {
    return alert('Geolocation not supported in your browser.');
  }

  // disable button while fetching location
  locationButton.setAttribute('disabled', 'disabled');
  locationButton.textContent = 'Sending location...';
  // fetch the location
  navigator.geolocation.getCurrentPosition(function(position) {
    // once fetch is done, first re-enable the location button
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    //
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    // error callback
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    alert('Unable to fetch location.');
  });
});
