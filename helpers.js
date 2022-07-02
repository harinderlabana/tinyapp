//check if user exsists with email inside user database
const getUserByEmail = (email, users) => {
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = getUserByEmail;