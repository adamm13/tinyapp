

const findUserByEmail = (email, users) => {
  return Object.values(users).find(user => user.email === email);
};
//TESTESTTESTTEST: {
 // b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
 // i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  //'0g4ihf': { longURL: 'http://www.gamestop.com', userID: 'adamm13' }
//}
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

const findUser = (email, users) => {
  const currentUser = users.find(userObj => userObj.email === email);

  return currentUser;
}
module.exports = { findUserByEmail, findUser, findUrlsByUserID  }
