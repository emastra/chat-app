let select = document.querySelector('select');
let inputRoom = document.querySelector('input[name="room"]');

select.addEventListener('change', function(ev) {
  inputRoom.value = ev.target.value;
});


var socket = io();

select.addEventListener('click', function(ev) {
  socket.emit('updateRoomList', function(rooms) {
    let roomsArr = Array.from(select.options).map(function(opt) {
      return opt.text;
    });
    rooms.forEach(function(room) {
      if (!roomsArr.includes(room)) {
        let option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        select.appendChild(option);
      }
    });
  });
});
