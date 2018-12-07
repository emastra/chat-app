// min 15:07 of lesson n920class1
// more min 3:00 of lesson n921, min 6:56, 10:08

var {Users} = require('./users');

// var usersArray = [{
//   id: 1,
//   name: 'deka',
//   room: 'The Office Fans'
// }, {
//   id: 2,
//   name: 'mike',
//   room: 'Node Course'
// }, {
//   id: 3,
//   name: 'jan',
//   room: 'Node Course'
// }];

var users = new Users;
users.addUser(1,'Deka', 'The Office Fans');
users.addUser(2,'Mike', 'Node Course');
users.addUser(3,'Jan', 'Node Course');

console.log('a', users.getUserList('Node Course'));
console.log('b', users.getUserList('The Office Fans'));
console.log('c', users.getUser(1));
console.log('d', users.removeUser(2));
console.log('e', users.getUserList('Node Course'));
console.log('f', users.getUser(2));
