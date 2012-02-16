express = require 'express'
app = express.createServer()
io = require('socket.io').listen app
require 'ejs'

# setting
app.set 'view engine', 'ejs'
app.set "view options", layout: false
app.use express.static(__dirname + '/public')
app.use express.cookieParser()
app.use express.session secret: "secret string $#@$"

playerCount = 0
pointCount = 0

app.get '/', (req, res) ->
  if playerCount <= 1
    req.session.current_user ?= name: "player #{++playerCount}", id: playerCount
  else
    req.session.current_user ?= name: "Watcher", id: null
  res.render 'index', current_user: req.session.current_user

app.listen 3000

io.sockets.on 'connection', (socket) ->
  console.log 'a client connected...'

  socket.on 'move', (data) ->
    console.log "new message - #{data}"
    data.count = ++pointCount
    socket.broadcast.emit 'allNews', data

  socket.on 'register', (data) ->
    # data format: {user_id: xx}
    socket.emit 'register', flag: pointCount % 2 is (data.user_id - 1)

  socket.on 'disconnect', ->
    console.log 'a client disconnected...'
