const express = require("express"); //require express
const cookieSession = require('cookie-session'); // require cookieSession
const bodyParser = require("body-parser"); //use body parser middleware before handlers; use req.body to access
const { findUserByEmail, findUrlsByUserID, generateRandomString } = require('./helpers');
const app = express();
const PORT = 8080;  // deafult PORT 8080
const bcrypt = require('bcryptjs'); // use bcrypt to hash passwords
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); //set view engine to ejs

app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2']
}));

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
};

app.get("/urls", (req, res) => { // URL homepage index if user logged in; if not redirect to login
  const userID = req.session["user_id"];
  if (!userID) {
    res.redirect('/login');
  } else {
    const templateVars = { user: users[userID], urls: findUrlsByUserID(urlDatabase, userID) };
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => { // Create NEW URL page - if logged in; if not redirect to login
  const userID = req.session["user_id"];
  if (!userID) {
    res.redirect("/login");
  } else {
    const templateVars = { user: users[userID], urls: findUrlsByUserID(urlDatabase, userID) };
    res.render("urls_new", templateVars);
  }
});

app.get("/login", (req, res) => { // Take user to the Login Page
  const userID = req.session["user_id"];
  const templateVars = { user: users[userID] };
  res.render('urls_login', templateVars);
});

app.get("/register", (req, res) => { // Take user to the Register Page
  const userID = req.session["user_id"];
  const templateVars = { user: users[userID] };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => { // Where a user Registers & Submits their Information; checks for errors
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) { // if no email or password - show message
    const templateVars = {
      status: 400,
      message: 'Email or Password is missing',
      user: null
    };
    res.status(400);
    res.render('urls_errors', templateVars);
    return;
  }

  if (findUserByEmail(email, users)) { // if email is already in system - show message
    const templateVars = {
      status: 400,
      message: 'This Email is already registered in our system',
      user: null
    };
    res.status(400);
    res.render('urls_errors', templateVars);
    return;
  }

  const newUser = { // Create a new user Object
    id: id,
    email: email,
    password: bcrypt.hashSync(password, saltRounds),
  };

  users[id] = newUser; // push that user to the database
  req.session.user_id = id;
  res.redirect('/urls');
});

app.post('/login', (req, res) => { //  Checking if user password matches/ sends errors if no email/ password
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);

  if (!user) { // if no user - error message
    const templateVars = {
      status: 403,
      message: 'Please Enter Your Email and Password',
      user: null
    };
    res.status(403);
    res.render('urls_errors', templateVars);
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) { //if the password is incorrect - error message
    const templateVars = {
      status: 403,
      message: 'Your Password is Incorrect',
      user: null
    };
    res.status(403);
    res.render('urls_errors', templateVars);
    return;
  }

  if (user && bcrypt.compareSync(password, user.password)) { // if the user/ hash password match then redirect home /urls
    req.session.user_id = user.id;
    res.redirect('/urls');
  }
});

app.get("/urls/:shortURL", (req, res) => { // Edit URL - takes you to the urls_show template where you can edit
  const userID = req.session["user_id"];

  if (!userID) { // if no user redirect to login
    res.redirect("/login");
  } else { // show the user the edit page with the info form their database
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[userID]
    };
    res.render("urls_show", templateVars);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => { // Delete URL
  delete urlDatabase[req.params.shortURL]; //delete the url from the database
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {  //submitting the updated URL and taking back to the index
  const userID = req.session["user_id"];
  if (userID) {
    const templateVars = {
      user: users[userID],
      urls: findUrlsByUserID(urlDatabase, userID)
    };
    urlDatabase[req.params.shortURL].longURL = req.body.longURL; //replaces the old long url in the database with the new
    res.render(`urls_index`, templateVars);
  } else {
    res.redirect(`/login`);
  }
});

app.post("/urls", (req, res) => { //takes the new input and generates the new string code - redirects to home page
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls`);
});

app.get("/u/:shortURL", (req, res) => { //shows your individual link and its short/ long redirect to longURL page
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post('/logout', (req, res) => { // Logout
  req.session['user_id'] = null; // end session/ clear cookie
  res.redirect('/urls'); //redirect home
});

app.listen(PORT, () => { // server is listening on this port
  console.log(`Example app listening on port ${PORT}!`);
});
