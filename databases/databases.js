const bcrypt = require('bcryptjs'); // use bcrypt to hash passwords
const saltRounds = 10;

const urlDatabase = {}; //empty database that can take and store users URLS

const users = { //users Database (preloaded into the server)
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync('test', saltRounds),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('test2', saltRounds),
  },
  "adamm13": {
    id: "adamm13",
    email: "13.adamm@gmail.com",
    password: bcrypt.hashSync('adam', saltRounds),
  }
};

module.exports = { urlDatabase, users };