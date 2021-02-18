const express = require("express"); //require express
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser') //added cookie parser
const bodyParser = require("body-parser"); //use body parser middleware before handlers; use req.body to access
const { findUserByEmail, findUrlsByUserID } = require('./helpers');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs'); //set view engine to ejs


const generateRandomString = function() { //function to generate random string
  let length = 6
  return Math.random().toString(20).substr(2, length)
}

const urlDatabase = { //practice Database
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { //users Database
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync('test', saltRounds),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('test', saltRounds),
  },
  "adamm13": {
    id: "adamm13",
    email: "13.adamm@gmail.com",
    password: bcrypt.hashSync('adam', saltRounds),
  }
}
console.log(users)

app.get("/urls", (req, res) => { // URL page 
  let userID = req.cookies["user_id"];
  if (!userID) {
    res.redirect('/login')
  } else {
    let templateVars = { user: users[userID], urls: findUrlsByUserID(urlDatabase, userID) }
    //console.log('urls DB:', urlDatabase)
    //console.log('templatevars /urls:',templateVars)
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => { //create a new URL page
  let userID = req.cookies["user_id"];
  if (!userID) {
    res.redirect("/login");
  } else {
    let templateVars = { user: users[userID], urls: findUrlsByUserID(urlDatabase, userID) };
    //console.log('templatevars /urls/new:', templateVars)
    res.render("urls_new", templateVars);
  }
});

app.get("/login", (req, res) => { //get Login
  let userID = req.cookies["user_id"];
  const templateVars = { user: users[userID] }
  res.render('urls_login', templateVars)
})

app.get("/register", (req, res) => { //get register
  let userID = req.cookies["user_id"];
  const templateVars = { user: users[userID] }
  res.render('urls_register', templateVars)
})

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    let templateVars = {
      status: 400,
      message: 'Email or Password is missing',
    }
    res.redirect('/urls', templateVars)
  }
  if (findUserByEmail(email, users)) {
    //console.log(Object.values(users))
    let templateVars = {
      status: 400,
      message: 'This Email is already registered in our system'
    }
    res.redirect('/urls', templateVars)
  }
  const newUser = {
    id: id,
    email: email,
    password: bcrypt.hashSync(password, saltRounds),
  };
  users[id] = newUser;
  console.log(users)
  res.cookie('user_id', id).redirect('/urls')
})

//const findUser = (email, userDB) => {
// const currentUser = userDB.find(userObj => userObj.email === email)
//
//  return currentUser
//}

app.post('/login', (req, res) => { // LOGIN POST <-- Checking if user password matches/ sends errors if no email/ password
  const email = req.body.email;
  const password = req.body.password;
  let user = findUserByEmail(email, users)
  

  if (user && bcrypt.compareSync(password, user.password)) {
    res.cookie('user_id', user.id).redirect('/urls')
  }

  if (!user) {
    let templateVars = {
      status: 403,
      message: 'This Email Cannot be Found',
      user: null
    }
    res.render('urls_errors', templateVars)
  }

  if (user.password !== password) {
    let templateVars = {
      status: 403,
      message: 'Your Password is Incorrect',
      user: null,
    }
    res.render('urls_errors', templateVars)
  }
});

app.get("/urls/:shortURL", (req, res) => { // Edit URL - takes you to the urls_show template where you can edit
  //console.log('adam')
  let userID = req.cookies["user_id"]
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[userID]
  };
  //console.log(templateVars)
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => { // Delete URL
  //console.log (req.params.shortURL)
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {  //submitting the updated URL and taking back to the index
  let userID = req.cookies["user_id"];
  if (userID) {
    let templateVars = {
      user: users[userID],
      urls: findUrlsByUserID(urlDatabase, userID)
    };
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.render(`urls_index`, templateVars);
  } else {
    res.redirect(`/login`);
  }
});

app.post("/urls", (req, res) => { //takes the new input and generates the new string code - redirects to home page
  //console.log('TEST')
  // i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  const shortURL = generateRandomString();
  //console.log('cookie value:', req.cookies)
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.cookies.user_id };
  //console.log(req.body);   returns { longURL: 'www.website.com' }
  res.redirect(`/urls`); //add /${shortURL} to redirect to short URL page with new INFO. 
});

app.get("/u/:shortURL", (req, res) => { //shows your individual link and its short/ longredirect to longURL page
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post('/logout', (req, res) => {
  req.session = null
  res.clearCookie('user_id').redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
