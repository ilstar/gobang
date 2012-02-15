app = require('express').createServer()
io = require('socket.io').listen app
require 'ejs'

# setting
app.set 'view engine', 'ejs'
app.set "view options", layout: false

app.get '/', (req, res) ->
  res.render 'index'

app.listen 3000

io.sockets.on 'connection', (socket) ->
  console.log 'a client connected...'

  socket.on 'news', (data) ->
    console.log "new message - #{data}"
    socket.broadcast.emit 'allNews', data

  socket.on 'disconnect', ->
    console.log 'a client disconnected...'
