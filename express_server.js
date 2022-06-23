const express = require('express');
const app = express();

//default port
const PORT = 8080;

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com',
};

//regester a handler for the root "/" path
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
