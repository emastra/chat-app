var socket = io();

var roomsDiv = document.getElementById('rooms-div');
var template = document.getElementById('cardTemplate').innerHTML;
console.log(template);

socket.emit('updateRoomList', function(rooms) {
  rooms.forEach(function(roomName) {
    roomsDiv.innerHTML += template;
  });
  var cards = document.getElementsByClassName('room-card');
  cards = Array.from(cards);
  cards.forEach(function(card) {
    console.log(card);
  });
});
