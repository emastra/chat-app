var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Deka';
    var text = 'Deka was here';
    var message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    locationObject = generateLocationMessage('Deka', 1, 1);

    expect(typeof locationObject.createdAt).toBe('number');
    expect(locationObject).toMatchObject({from: 'Deka', url: 'https://www.google.com/maps?q=1,1'});
  });
});
