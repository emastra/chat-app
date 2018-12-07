// https://css-tricks.com/now-ever-might-not-need-jquery/
// https://blog.garstasio.com/you-dont-need-jquery/events/#ancient-browser-support

// https://www.sitepoint.com/get-url-parameters-with-javascript/

var socket = io();

function scrollToBottom() {
  /* If scrollHeight is equal to (clientHeight + scrollTop)
  means that user is at the bottom of the panel, so we need to scroll down
  And because the call to scrollToBottom func is done after adding the latest message,
  we need to add on the last message height as well.
  to not scroll if the user is just a little bit up, we add the secondlast message height too. */

  // selectors
  var messagesContainer = document.getElementById('messages');
  var latestMessage = messagesContainer.lastElementChild;
  // heights
  var clientHeight = messagesContainer.clientHeight;
  var scrollTop = messagesContainer.scrollTop;
  var scrollHeight = messagesContainer.scrollHeight;
  latestMessageHeight = latestMessage.offsetHeight;  // Element.getBoundingClientRect() takes transforms into account
  secondlastMessaggeHeight = latestMessage.previousElementSibling ? latestMessage.previousElementSibling.offsetHeight : 0;

  if (clientHeight + scrollTop + latestMessageHeight + secondlastMessaggeHeight >= scrollHeight) {
    messagesContainer.scrollTop = scrollHeight;
  }

}


socket.on('connect', function() {
  // console.log('Connected to server');
  var searchParams = new URLSearchParams(window.location.search);
  var paramsObj = {name: searchParams.get('name'), room: searchParams.get('room')};

  // acknowledment function set because if someone doesnt join the room it means they proviedd invalid data and we need to kick them back to the join form
  socket.emit('join', paramsObj, function(err) {
    if (err) {
      alert(err); // might use modal here
      // manipolate which page user is on. essentially redirect
      window.location.href = '/';
    } else {
      console.log('No err');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  var ol = document.createElement('ol');
  users.forEach(function(user) {
    // create li, insert user name, and append it to ol
    var li = document.createElement('li');
    li.textContent = user;
    ol.appendChild(li);
  });
  // update the dom with new user list (not the ol element but the outer html)
  //document.getElementById('people').innerHTML = ol.outerHTML;
  document.getElementById('people').innerHTML = '';
  document.getElementById('people').appendChild(ol);

});

socket.on('newMessage', function(message) {
  // time
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // // create and set elements
  // var li = document.createElement('li');
  // li.textContent = `${message.from} ${formattedTime}: ${message.text}`; // instead of innerHTML, textContent has better performance because its value is not parsed as HTML. Moreover, using textContent can prevent XSS attacks.
  // // append
  // document.querySelector('#messages').appendChild(li);
  var template = document.getElementById('message-template').innerHTML;
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  //console.log(html);
  //document.querySelector('#messages').innerHTML = html;
  document.querySelector('#messages').insertAdjacentHTML('beforeend', html); // The insertAdjacentHTML() method parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position. It does not reparse the element it is being used on, and thus it does not corrupt the existing elements inside that element. This avoids the extra step of serialization, making it much faster than direct innerHTML manipulation.
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  // time
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // // create and set elements
  // var li = document.createElement('li');
  // var a = document.createElement('a');
  // a.setAttribute('target', '_blank');
  // a.textContent = 'My current location';
  // li.textContent = `${message.from} ${formattedTime}: `;
  // a.setAttribute('href', message.url);
  // // append
  // li.appendChild(a);
  // document.querySelector('#messages').appendChild(li);
  var template = document.getElementById('location-message-template').innerHTML;
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  document.querySelector('#messages').insertAdjacentHTML('beforeend', html);
  scrollToBottom();
});

// Acknowledgements, just add a callback function as 3rd argument

document.querySelector('#message-form').addEventListener('submit', function(ev) {
  ev.preventDefault();
  var messageInput = document.querySelector('[name=message-input]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageInput.value
  }, function() { // acknowledgement ???
    // reset messageInput ??
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
  locationButton.textContent = 'Loading...';
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
