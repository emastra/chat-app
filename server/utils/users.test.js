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
    var res = users.removeUser(1);

    expect(res).toEqual({
      id: 1,
      name: 'Emiliano',
      room: 'Javascript fans'
    });
  });

  it('should not remove user', () => {
    var res = users.removeUser(4);

    expect(res).toBe(undefined);
  });

  it('should find user', () => {
    var res = users.getUser(2);

    expect(res).toEqual(users.users[1]);
  });

  it('should not find user', () => {
    var res = users.getUser(5);

    expect(res).toEqual(undefined);
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
