express = require 'express'
# TODO:Do we need this require?
require 'ejs'
parseCookie = require('connect').utils.parseCookie
socketIO = require('socket.io')

homeRoute = require "#{__dirname}/routes/home"
chessRoomRoute = require "#{__dirname}/routes/chess_room"

class WebSocket
  constructor: (@app, @sessionStore) ->
    # SocketIO
    @io = socketIO.listen @app
    @configureOptions()
    @setupFilters ['session']

  configureOptions: ->
    # for running on heroku
    @io.configure =>
      @io.set 'transports', ['xhr-polling']
      @io.set 'polling duration', 10

  sessionFilter: ->
    @io.set 'authorization', (request, callback) =>
      if request.headers.cookie?
        request.cookie = parseCookie request.headers.cookie
        sessionID = request.cookie['connect.sid']
        @sessionStore.get sessionID, (error, session) ->
          if error or not session
            callback new Error "There's no session"
          else
            request.session = session
            callback null, true
      else
        callback new Error "No cookie transmitted!"

  setupFilters: (name)->
    this["#{name}Filter"]()

class WuziGame
  constructor: (@webSocket)->
    @io = @webSocket.io
    @startObserving()

  startObserving: ->
    @io.sockets.on 'connection', (socket) =>
      gameSession = new WuziGameSession socket

      socket.on 'move', gameSession.moveListener
      socket.on 'register', gameSession.registerListener
      socket.on 'reset_chess', gameSession.resetListener
      socket.on 'disconnect', gameSession.disconnectListener


class WuziGameSession
  constructor: (@socket)->
    @current_user = @socket.handshake.session.current_user
    @chess = chesses[@current_user.roomId]

  moveListener: (data) =>
    result = @chess.move @current_user, parseInt(data.x), parseInt(data.y)
    if result is 'moved'
      @socket.broadcast.emit 'allNews', {x: data.x, y: data.y, colour: @current_user.colour, user: 'other'}
      @socket.emit 'allNews', {x: data.x, y: data.y, colour: @current_user.colour, user: 'me'}
    else if result is 'win'
      @socket.broadcast.emit 'win', {user: 'other'}
      @socket.emit 'win', {user: 'you'}

  registerListener: (data) =>
    @chess.join @current_user
    # when the second player join, send a sign to first player to tell him can start.
    if @chess.isFull()
      @socket.broadcast.emit 'register', canMove: true

  resetListener: =>
    if @chess.isWinner(@current_user)
      @chess.reset()
      @socket.broadcast.emit 'reset_chess'
      @socket.emit 'reset_chess', 'start'

  disconnectListener: =>
    @socket.on 'disconnect', ->
      console.log 'a client disconnected...'

class App
  constructor: ->
    global.chesses = {}
    @prepareWebserver()
    @startGame()
    @startWebserver()

  startWebserver: ->
    port = process.env.PORT || 5000
    @app.listen port

  prepareWebserver: ->
    @sessionStore = new express.session.MemoryStore
    @app = @setupWebServer @sessionStore
    @setupRoutes @app

  startGame: ->
    @socket = new WebSocket @app, @sessionStore
    @game = new WuziGame @socket
  
  setupRoutes: (app)->
    app.get '/', homeRoute.index
    app.post '/rooms', chessRoomRoute.create
    app.get '/rooms/:id', chessRoomRoute.show

  setupWebServer: (sessionStore)->
    # WebServer
    app = express.createServer()
    # setting
    app.set 'view engine', 'ejs'
    app.set "view options", layout: false
    app.use express.static(__dirname + '/public')
    app.use express.cookieParser()
    app.use express.session secret: "secret string $#@$", store: sessionStore


app = new App()

