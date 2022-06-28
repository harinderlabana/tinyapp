const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

//function to gernerate random alphanumerical string
const generateRandomString = (n) => {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
};

//initial database
let urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com',
};

/*********************
MIDDLEWARE REQUESTS
**********************/

//middleware - body-parser
app.use(bodyParser.urlencoded({extended: true}));

/*********************
GET REQUESTS
**********************/

//use ejs as template engine
app.set('view engine', 'ejs');

//handler for the root "/" path
app.get('/', (req, res) => {
  res.send('Hello!');
});

//handler for the root "/hello" path
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>');
});

//handler for the root "/urls.json" path
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//handler for the list of urls
app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

//handler for creating a new url
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//handler for the new shortURL
app.get('/urls/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL,
    longURL,
  };
  res.render('urls_show', templateVars);
});

//handler for redirection to longURL via shortURL link
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

/*********************
POST REQUESTS
**********************/

//handler that will assign a randomly generated shortURL to a longURL submission
app.post('/urls', (req, res) => {
  //check if it received
  console.log(req.body);
  if (req.body.longURL !== '') {
    const shortURL = generateRandomString(6);
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
  }
});

//handler to redirect from edit button to main list of urls
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  if (longURL !== '') {
    urlDatabase[shortURL] = longURL;
    res.redirect('/urls');
  }
});

//handler to delete URL entries
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

/*********************
EVENT LISTENERS
**********************/

//event listener showing server is awake and ready
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
