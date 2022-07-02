const assert = require('chai').assert;

const getUserByEmail = require('../helpers.js');

const testUsers = [
  {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
];

describe('#getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail('user@example.com', testUsers);
    const expectedUserID = 'userRandomID';
    assert.equal(user.id, expectedUserID);
  });
  
  it('should return undefined if no email exsists in the database', () => {
    const user = getUserByEmail('test@testing.com', testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
  
  it('should return undefined if email entered is an empty field', () => {
    const user = getUserByEmail('', testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});

