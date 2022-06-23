const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com',
};

//use ejs as template engine
app.set('view engine', 'ejs');

//handler for the root "/" path
app.get('/', (req, res) => {
  res.send('Hello!');
});

//handler for the root "/urls" path
app.get('/urls', (req, res) => {
  const templateVars = {urls: urlDatabase};
  //express knows to look in the 'views' folder when acessing 'urls_index'  no need to show path
  res.render('urls_index', templateVars);
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
