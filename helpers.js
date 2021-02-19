const generateRandomString = function() { //function to generate random string
  let length = 6;
  return Math.random().toString(20).substr(2, length);
};

const findUserByEmail = (email, users) => { // function to find user by their email in the users database
  return Object.values(users).find(user => user.email === email);
};

const findUrlsByUserID = (urls, id) => { // find the urls that match the persons id
  let usersUrls = {};
  for (let url in urls) {
    if (urls[url].userID === id) {
      usersUrls[url] = urls[url];
    }
  }
  return usersUrls;
};

module.exports = { findUserByEmail, findUrlsByUserID, generateRandomString  };
