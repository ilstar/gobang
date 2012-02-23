express = require 'express'
app = express.createServer()
io = require('socket.io').listen app
sessionStore = new express.session.MemoryStore
require 'ejs'
parseCookie = require('connect').utils.parseCookie
Chess = require "#{__dirname}/models/chess.coffee"

# setting
app.set 'view engine', 'ejs'
app.set "view options", layout: false
app.use express.static(__dirname + '/public')
app.use express.cookieParser()
app.use express.session secret: "secret string $#@$", store: sessionStore

playerCount = 0
pointCount = 0

chesses = {}
chesses['test'] = new Chess
colours = ['#eee', '#abc', '#ebc', '#daf']

app.get '/', (req, res) ->
  colour = colours[parseInt(Math.random(1) * colours.length)]
  if playerCount <= 1
    req.session.current_user ?= name: "player #{++playerCount}", id: playerCount, colour: colour
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
  current_user = socket.handshake.session.current_user
  chess = chesses['test']

  socket.on 'move', (data) ->
    console.log "new message - #{data}"
    chess.move current_user, data.x, data.y
    socket.broadcast.emit 'allNews', {x: data.x, y: data.y, colour: current_user.colour}

  socket.on 'register', (data) ->
    chess.join current_user
    socket.emit 'register', canMove: chess.nextMovePlayer() is current_user

  socket.on 'disconnect', ->
    console.log 'a client disconnected...'
