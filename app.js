// load plugins
var express = require('express');
var app = express.createServer();
require('ejs');
var io = require('socket.io');

// settings
app.set( "view engine", "ejs" );
app.set('view options', {
  layout: false,
});

// controllers and actions
app.get('/', function(req, res) {
  res.render('index');
  // res.send("haha");
});

app.listen(3000);

// socket.io
var socket = io.listen(app);
socket.on('connection', function(client) {
  client.on('message', function(data) {
    client.broadcast(data);
  });
  // client.broadcast({announcement: 'haha'})
  client.on('disconnect', function() {});
});
