const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const generateRandomString = function(){
  let length = 6
  return Math.random().toString(20).substr(2, length)
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "4fn9sf": "http://www.reddit.com"
};


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  //console.log(templateVars)
  res.render("urls_show", templateVars);
});

app.post("/urls", (req,res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  //console.log(req.body);   returns { longURL: 'www.website.com' }
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => { //redirect to longURL page
   const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
