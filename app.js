// load plugins
var express = require('express');
var app = express.createServer();
require('ejs');

// settings
app.set( "view engine", "ejs" );
app.set('view options', {
  layout: false,
});

// controllers and actions
app.get('/', function(req, res) {
  res.render('index', {locals: {name: 'haha'}});
  // res.send("haha");
});

app.listen(3000);
