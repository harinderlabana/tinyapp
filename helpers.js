//check if user exsists with email inside user database
const getUserByEmail = (email, users) => {
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

//function to gernerate random alphanumerical string
const generateRandomString = (n) => {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
};

//check if user is logged in and has Access
const findID = (id, users) => {
  for (const user of users) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
};

//create a database unique to the user
const urlsForUser = (userID, urlDatabase) => {
  const obj = {};
  const keys = Object.keys(urlDatabase);
  for (const shortURL of keys) {
    if (userID === urlDatabase[shortURL].userID) {
      obj[shortURL] = urlDatabase[shortURL];
    }
  }
  return obj;
};

module.exports = {getUserByEmail, generateRandomString, findID, urlsForUser};
