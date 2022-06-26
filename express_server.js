const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

//function to gernerate random alphanumerical string
function generateRandomString(n) {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
}

let urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com',
};

//middleware - body-parser
app.use(bodyParser.urlencoded({extended: true}));

//use ejs as template engine
app.set('view engine', 'ejs');

//handler for the root "/" path
app.get('/', (req, res) => {
  res.send('Hello!');
});

//handler will render the form
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//handler for the root "/urls" path
app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  //express knows to look in the 'views' folder when acessing 'urls_index'  no need to show path
  res.render('urls_index', templateVars);
});

//handler that will assign a randomly generated shortURL to a longURL submission
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//handler to delete URL entries
app.post('/urls/:shortURL/delete', (req, res) => {
  const {shortURL} = req.params;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//handler for the root "/urls/:shortURL" path
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  // console.log(templateVars);
  res.render('urls_show', templateVars);
});

//hander for redirection to longURL
app.get('/u/:shortURL', (req, res) => {
  // console.log(Object.values(req.params));
  const shortURL = Object.values(req.params);
  const longURL = urlDatabase[shortURL];
  // console.log(shortURL, longURL);
  res.redirect(longURL);
});

//handler for the root "/urls.json" path
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//handler for the root "/hello" path
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
