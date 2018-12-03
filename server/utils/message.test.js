var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Deka';
    var text = 'Deka was here';
    var message = generateMessage(from, text);

    // expect(message.createdAt).toBeA('number');
    // expect(message).toInclude({from, text});
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});
