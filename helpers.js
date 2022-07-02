//check if user exsists with email inside user database
const getUserByEmail = (email, database) => {
  for (const user of database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return null;
};

module.exports = getUserByEmail;
