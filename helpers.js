

const findUserEmail = (email, users) => {
  return Object.values(users).find(user => user.email === email);
};

const findUser = (email, users) => {
  const currentUser = users.find(userObj => userObj.email === email)

  return currentUser
}
module.exports = { findUserEmail, findUser }
