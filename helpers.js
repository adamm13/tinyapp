
const findUserByEmail = (email, users) => {
  return Object.values(users).find(user => user.email === email);
};

const findUrlsByUserID = (urls, id) => {
  let usersUrls = {};
  for (let url in urls) {
    //console.log('pre condition:', urls[url]);
    //console.log('pre condition:', urls[url].userID);
    if (urls[url].userID === id) {
      //console.log('POST condition', id);
      //console.log('POST condition', urls[url]);
      //console.log('POST condition', urls[url].userID);
      usersUrls[url] = urls[url];
    }
  }
  return usersUrls;
}

module.exports = { findUserByEmail, findUrlsByUserID  }
