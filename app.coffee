express = require 'express'
app = express.createServer()
io = require('socket.io').listen app
sessionStore = new express.session.MemoryStore
require 'ejs'
parseCookie = require('connect').utils.parseCookie

# setting
app.set 'view engine', 'ejs'
app.set "view options", layout: false
app.use express.static(__dirname + '/public')
app.use express.cookieParser()
app.use express.session secret: "secret string $#@$", store: sessionStore

playerCount = 0
pointCount = 0

app.get '/', (req, res) ->
  if playerCount <= 1
    req.session.current_user ?= name: "player #{++playerCount}", id: playerCount
  else
    req.session.current_user ?= name: "Watcher", id: null
  res.render 'index', current_user: req.session.current_user

app.listen 3000

io.set 'authorization', (data, callback) ->
  if data.headers.cookie?
    data.cookie = parseCookie data.headers.cookie
    sessionID = data.cookie['connect.sid']
    sessionStore.get sessionID, (error, session) ->
      if error or not session
        callback new Error "There's no session"
      else
        data.session = session
        callback null, true
  else
    callback new Error "No cookie transmitted!"

io.sockets.on 'connection', (socket) ->
  console.log 'a client connected...'
  console.log socket.handshake.session

  socket.on 'move', (data) ->
    console.log "new message - #{data}"
    data.count = ++pointCount
    socket.broadcast.emit 'allNews', data

  socket.on 'register', (data) ->
    # data format: {user_id: xx}
    socket.emit 'register', flag: pointCount % 2 is (data.user_id - 1)

  socket.on 'disconnect', ->
    console.log 'a client disconnected...'
