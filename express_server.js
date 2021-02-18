const express = require("express"); //require express
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser') //added cookie parser
const bodyParser = require("body-parser"); //use body parser middleware before handlers; use req.body to access
const { findUserEmail, findUser } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs'); //set view engine to ejs


const generateRandomString = function(){ //function to generate random string
  let length = 6
  return Math.random().toString(20).substr(2, length)
}

const urlDatabase = { //practice 'database'
  "b2xVn2": "http://www.lighthouselabs.ca",
  "4fn9sf": "http://www.reddit.com"
};

const users = { //users Database
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/urls", (req, res) => { // URL page 
  let userID = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userID] };
  //console.log(templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { //create a new URL page
  let userID = req.cookies["user_id"];
  const templateVars = { user: users[userID] };
  res.render("urls_new", templateVars);
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
  const email =  req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    let templateVars = {
      status: 400,
      message: 'Email or Password is missing',
    }
    res.redirect('/urls', templateVars)
  }
  if (findUserEmail(email, users)) {
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
    password: password
  };
  users[id] = newUser;
  //console.log(users)
  res.cookie('user_id', id).redirect('/urls') 
})

//const findUser = (email, userDB) => {
// const currentUser = userDB.find(userObj => userObj.email === email)
//
//  return currentUser
//}

app.post('/login', (req, res) => { //Login Page
  const email = req.body.email;
  const password = req.body.password;
  let user = findUserEmail(email, users)
  if (!user) {
    let templateVars = {
      status: 403,
      message: 'This Email Cannot be Found',
    }
    res.redirect('/urls', templateVars)
  }
  //console.log(users[req.params.password])
  if (user.password !== password) {
    let templateVars = {
      status: 403,
      message: 'Your Password is Incorrect'
    }
    res.redirect('/urls', templateVars)
  }

  res.cookie('user_id', user.id).redirect('/urls')
});

app.get("/urls/:shortURL", (req, res) => {
  //console.log('adam')
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  //console.log(templateVars)
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => { // Delete URL
  //console.log (req.params.shortURL)
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req,res) => { // Edit URL - takes you to url_show where you can edit. 
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls", (req,res) => { //takes the new input and generates the new string code - redirects to home page
  //console.log('TEST')
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(req.body);   returns { longURL: 'www.website.com' }
  res.redirect(`/urls`); //add /${shortURL} to redirect to short URL page with new INFO. 
});

app.get("/u/:shortURL", (req, res) => { //shows your individual link and its short/ longredirect to longURL page
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post('/logout', (req, res) => {
  req.session = null
  res.clearCookie('user_id').redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
