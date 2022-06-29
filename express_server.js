const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

let users = [
  {id: '123', email: 'someone@gmail.com', password: '1fgdag23'},
  {id: 'aML', email: 'sunny.labana@gmail.com', password: '123'},
];

/*********************
MIDDLEWARE REQUESTS
**********************/

//body-parser
app.use(bodyParser.urlencoded({extended: true}));

//cookie-parser
app.use(cookieParser());

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
  let currentUser = false;
  for (const user of users) {
    if (user.id === req.cookies['userID']) {
      currentUser = user;
    }
  }

  const templateVars = {
    urls: urlDatabase,
    user: currentUser,
  };

  res.render('urls_index', templateVars);
});

//handler for creating a new url
app.get('/urls/new', (req, res) => {
  let currentUser = false;
  for (const user of users) {
    if (user.id === req.cookies['userID']) {
      currentUser = user;
    }
  }
  const templateVars = {
    user: currentUser,
  };
  res.render('urls_new', templateVars);
});

//handler for register
app.get('/register', (req, res) => {
  let currentUser = false;
  for (const user of users) {
    if (user.id === req.cookies['userID']) {
      currentUser = user;
    }
  }
  const templateVars = {
    user: currentUser,
  };
  res.render('urls_register', templateVars);
});

//handler for login
app.get('/login', (req, res) => {
  let currentUser = false;
  for (const user of users) {
    if (user.id === req.cookies['userID']) {
      currentUser = user;
    }
  }
  const templateVars = {
    user: currentUser,
  };
  res.render('urls_login', templateVars);
});

//handler for the new shortURL
app.get('/urls/:shortURL', (req, res) => {
  let currentUser = false;
  for (const user of users) {
    if (user.id === req.cookies['userID']) {
      currentUser = user;
    }
  }

  const longURL = urlDatabase[req.params.shortURL];
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL,
    longURL,
    user: currentUser,
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
  if (req.body.longURL !== '') {
    const shortURL = generateRandomString(6);
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
  }
});

//handler for login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email !== '' && password !== '') {
    let exsistingUser = false;
    for (const user of users) {
      if (user.email === email && user.password === password) {
        exsistingUser = user;
      }
    }
    if (exsistingUser) {
      res.cookie('userID', exsistingUser.id);
      res.redirect('/urls');
    } else if (!exsistingUser) {
      res.status(400);
      res.send(
        'Error 400: This email is not accosiated with an account. Please register!'
      );
    }
  } else if (email === '' || password === '') {
    res.status(400);
    res.send('Error 400: Ooops, you forgot something!');
  }
});

//handler for register
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString(3);

  if (email !== '' && password !== '') {
    let exsistingUser = false;
    for (const user of users) {
      if (user.email === email) {
        exsistingUser = true;
      }
    }
    if (exsistingUser) {
      res.status(400);
      res.send('Error 400: This email address is already in use.');
    } else if (!exsistingUser) {
      users.push({
        id,
        email,
        password,
      });
      res.cookie('userID', id);
      res.redirect('/urls');
    }
  } else if (email === '' || password === '') {
    res.status(400);
    res.send('Error 400: Ooops, you forgot something!');
  }
});

//handler for logout
app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
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
