const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const {
  getUserByEmail,
  generateRandomString,
  findID,
  urlsForUser,
} = require('./helpers');

const PORT = 8080;

/*********************
MIDDLEWARE
**********************/

app.use(bodyParser.urlencoded({extended: true}));

app.use(
  cookieSession({
    name: 'session',
    keys: ['notsecret', 'maybesecret', 'definitelysecret'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

/*********************
URL Databases and Users
**********************/

const urlDatabase = {};

let users = [];

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
  const templateVars = {
    urls: urlsForUser(req.session['userID'], urlDatabase),
    user: findID(req.session['userID'], users),
  };
  res.render('urls_index', templateVars);
});

//handler for creating a new url
app.get('/urls/new', (req, res) => {
  const checkUserID = findID(req.session['userID'], users);
  if (checkUserID === null) {
    res.redirect('/login');
  } else {
    const templateVars = {
      user: findID(req.session['userID'], users),
    };
    res.render('urls_new', templateVars);
  }
});

//handler for register
app.get('/register', (req, res) => {
  const templateVars = {
    user: findID(req.session['userID'], users),
  };
  res.render('urls_register', templateVars);
});

//handler for login
app.get('/login', (req, res) => {
  const templateVars = {
    user: findID(req.session['userID'], users),
  };
  res.render('urls_login', templateVars);
});

//handler for the new shortURL
app.get('/urls/:shortURL', (req, res) => {
  const checkUserID = findID(req.session['userID'], users);
  if (
    checkUserID === null ||
    checkUserID.id !== urlDatabase[req.params.shortURL].userID
  ) {
    res.status(401);
    res.send('Error 401: Unauthorized Access!\n');
  } else {
    if (urlDatabase[req.params.shortURL] === undefined) {
      res.status(400);
      res.send('Error 400: Invalid Request');
    }
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: findID(req.session['userID'], users),
    };
    res.render('urls_show', templateVars);
  }
});

//handler for redirection to longURL via shortURL link
app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

/*********************
POST REQUESTS
**********************/

//handler that will assign a randomly generated shortURL to a longURL submission
app.post('/urls', (req, res) => {
  const checkUserID = findID(req.session['userID'], users);
  if (checkUserID === null) {
    res.status(401);
    res.send('Error 401: Unauthorized Access!\n');
  } else {
    if (req.body.longURL !== '') {
      const shortURL = generateRandomString(6);
      urlDatabase[shortURL] = {
        longURL: req.body.longURL,
        userID: req.session['userID'],
      };
      res.redirect(`/urls/${shortURL}`);
    }
  }
});

//handler for login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email !== '' && password !== '') {
    const exsistingUser = getUserByEmail(email, users);
    if (exsistingUser) {
      const passMatch = bcrypt.compareSync(password, exsistingUser.password);
      if (passMatch) {
        req.session['userID'] = exsistingUser.id;
        res.redirect('/urls');
      } else {
        res.status(403);
        res.send(`Error 403: The username/password is incorrect!`);
      }
    } else if (!exsistingUser) {
      res.status(403);
      res.send('Error 403: This email is not accosiated with any account!');
    }
  } else if (email === '' || password === '') {
    res.status(400);
    res.send('Error 400: The username/password is empty!');
  }
});

//handler for register
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString(6);
  if (email !== '' && password !== '') {
    let exsistingUser = getUserByEmail(email, users);
    if (exsistingUser) {
      res.status(400);
      res.send('Error 400: This email address is already registered!');
    } else if (!exsistingUser) {
      const hash = bcrypt.hashSync(password, 10);
      users.push({
        id,
        email,
        password: hash,
      });
      req.session['userID'] = id;
      res.redirect('/urls');
    }
  } else if (email === '' || password === '') {
    res.status(400);
    res.send('Error 400: The username/password is empty!');
  }
});

//handler for logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//handler to redirect from edit button to main list of urls
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const activeUser = req.session['userID'];
  const linkOwner = urlDatabase[shortURL].userID;
  if (activeUser === linkOwner) {
    if (longURL !== '') {
      urlDatabase[shortURL].longURL = longURL;
      res.redirect('/urls');
    }
  } else {
    res.status(401);
    res.send('Error 401: Unauthorized Access!');
  }
});

//handler to delete URL entries
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const activeUser = req.session['userID'];
  const linkOwner = urlDatabase[shortURL].userID;
  if (activeUser === linkOwner) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(401);
    res.send('Error 401: Unauthorized Access!');
  }
});

/*********************
EVENT LISTENERS
**********************/

//event listener showing server is awake and ready
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
