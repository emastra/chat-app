// User class and instance methods
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
    // get the user to remove to be able to return it later // filter returns another array
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
