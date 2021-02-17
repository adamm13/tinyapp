//require express
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//added cookie parser
const cookieParser = require('cookie-parser')
app.use(cookieParser());
//use body parser middleware before handlers; use req.body to access
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//set view engine to ejs
app.set('view engine', 'ejs');

//funciton to generate random string
const generateRandomString = function(){
  let length = 6
  return Math.random().toString(20).substr(2, length)
}
//practice 'database'
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "4fn9sf": "http://www.reddit.com"
};

//Login Page
app.post('/login', (req, res) => {
  const username = req.body.username
  console.log (`${username} has signed into TinyApp`) //returns Adam
  res.cookie('username', username).redirect('/urls')
  //res.redirect('username','/urls')
  //app.get('/', function(req, res){
   //res.cookie('name', 'express').send('cookie set');
   //const templateVars = {username: req.cookies["username"]}
})


// URL page 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  //console.log(templateVars)
  res.render("urls_index", templateVars);
});

//create a new URL page
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  //console.log('adam')
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  //console.log(templateVars)
  res.render("urls_show", templateVars);
});

// Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log (req.params.shortURL)
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

// Edit URL - takes you to url_show where you can edit. 
app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`);
});

//takes the new input and generates the new string code - redirects to home page
app.post("/urls", (req,res) => {
  //console.log('TEST')
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(req.body);   returns { longURL: 'www.website.com' }
  res.redirect(`/urls`); //add /${shortURL} to redirect to short URL page with new INFO. 
});

//shows your individual link and its short/ long
app.get("/u/:shortURL", (req, res) => { //redirect to longURL page
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post('/logout', (req, res) => {
  const username = req.body.username
  res.clearCookie('username', username).redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
