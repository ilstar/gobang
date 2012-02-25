express = require 'express'
app = express.createServer()
io = require('socket.io').listen app
sessionStore = new express.session.MemoryStore
require 'ejs'
parseCookie = require('connect').utils.parseCookie

global.chesses = {}

# setting
app.set 'view engine', 'ejs'
app.set "view options", layout: false
app.use express.static(__dirname + '/public')
app.use express.cookieParser()
app.use express.session secret: "secret string $#@$", store: sessionStore

homeRoute = require "#{__dirname}/routes/home"
chessRoomRoute = require "#{__dirname}/routes/chess_room"

app.get '/', homeRoute.index
app.post '/rooms', chessRoomRoute.create
app.get '/rooms/:id', chessRoomRoute.show

port = process.env.PORT || 5000
app.listen port

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

# for running on heroku
io.configure ->
  io.set 'transports', ['xhr-polling']
  io.set 'polling duration', 10

io.sockets.on 'connection', (socket) ->
  current_user = socket.handshake.session.current_user
  chess = chesses[current_user.roomId]

  socket.on 'move', (data) ->
    result = chess.move current_user, parseInt(data.x), parseInt(data.y)
    if result is 'moved'
      socket.broadcast.emit 'allNews', {x: data.x, y: data.y, colour: current_user.colour}
    else if result is 'win'
      socket.broadcast.emit 'win', {user: 'other'}
      socket.emit 'win', {user: 'you'}

  socket.on 'register', (data) ->
    chess.join current_user
    # when the second player join, send a sign to first player to tell him can start.
    if chess.isFull()
      socket.broadcast.emit 'register', canMove: true

  socket.on 'disconnect', ->
    console.log 'a client disconnected...'
