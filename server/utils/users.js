/* example of this users data structure which is gonna be just an array of objects

[{
  id: '/#knh43h546kh64',
  name: 'deka',
  room: 'The Office Fans'
}, {
  ...
}]

*/

// methods we're gonna need:
// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)


/* Example of one approch to accomplish this
// we have an array and we can manipulate it
var users = [];

var addUser = (id, name, room) => {
  users.push({...});
};

module.exports = {addUser};

*/


// We're gonna do is use ES6 class sintax
// let us create a user class, make new instance of the class and fire all our methods. Previous approch works with just one piece of information(the array)

class Users {
  constructor() {
    this.users = [];
  }
  // methods
  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    // var index = this.users.findIndex((user) => {
    //   return user.id === id;
    // });
    // if (index > -1) return this.users.splice(index, 1);
    // else return null;

    // get the user to remove, so we can return it later
    var user = this.users.filter((user) => user.id === id)[0]; // if not found, user is equal to 'undefined'

    if (user) {
      // remove the user
      this.users = this.users.filter((user) => user.id != id);
    }
    return user; // returns 'undefined' if no user was found
  }

  getUser(id) {
    var userInArray = this.users.filter((user) => {
      return user.id === id;
    });
    // if the id was not found the array would be empty, and userInArray[0] would be 'undefined'.
    return userInArray[0];
    // one-liner: // return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    var users = this.users.filter((user) => {
      return user.room === room;
    });
    var namesArray = users.map((user) => {
      return user.name;
    });

    return namesArray;
  }

  getRoomList() {
    var userRooms = this.users.map((user) => {
      return user.room;
    });
    // from array of rooms names (not unique) make a set (which is unique) and convert it to an array 
    var rooms = Array.from(new Set(userRooms));
    return rooms;
  }

}

module.exports = {Users};
