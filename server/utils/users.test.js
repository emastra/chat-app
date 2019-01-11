const expect = require('expect');

var {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users;
    users.users = [{
      id: 1,
      name: 'Emiliano',
      room: 'Javascript fans'
    }, {
      id: 2,
      name: 'Marco',
      room: 'Travel tips'
    }, {
      id: 3,
      name: 'Dani',
      room: 'Javascript fans'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Emiliano',
      room: 'Node.js'
    };
    var res = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
    expect(res).toEqual(user);
  });

  it('should remove user', () => {
    var userId = 1;
    var res = users.removeUser(userId);

    expect(res.id).toEqual(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = 99;
    var res = users.removeUser(userId);

    expect(res).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = 2;
    var res = users.getUser(userId);

    expect(res.id).toEqual(userId);
  });

  it('should not find user', () => {
    var userId = 99;
    var res = users.getUser(userId);

    expect(res).toBeUndefined();
  });

  it('should return names for Javascript fans', () => {
    var res = users.getUserList('Javascript fans');

    expect(res).toEqual(['Emiliano', 'Dani']);
  });

  it('should return names for Travel tips', () => {
    var res = users.getUserList('Travel tips');

    expect(res).toEqual(['Marco']);
  });

  it('should return unique room names', () => {
    var res = users.getRoomList();

    expect(res).toEqual(['Javascript fans', 'Travel tips']);
  });
});
