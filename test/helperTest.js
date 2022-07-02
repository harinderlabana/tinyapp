const assert = require('chai').assert;

// const getUserByEmail = require('../helpers.js');

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

// describe('#getUserByEmail', () => {
//   it('should return a user with valid email', () => {
//     const user = getUserByEmail('user@example.com', testUsers);
//     const expectedUserID = 'userRandomID';
//     assert.equal(user.id, expectedUserID);
//   });
// });

const expectedUserID = 'userRandomID';
const emailAddress = 'user@example.com';
const getUserByEmail = () => {};
