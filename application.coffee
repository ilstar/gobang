express = require 'express'
# TODO:Do we need this require?
require 'ejs'
socketIO = require('socket.io')
parseCookie = require('connect').utils.parseCookie

{ WuziGame, WuziGameSession } = require "#{__dirname}/game"

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
          if error?
            callback new Error error
          else if not session
            callback new Error "There's no session"
          else
            request.session = session
            callback null, true
      else
        callback new Error "No cookie transmitted!"

  setupFilters: (name)->
    this["#{name}Filter"]()

class App
  constructor: ->
    global.chesses = {}
    @setupWebServer()
    @startGame()
    @startWebServer()

  startWebServer: ->
    port = process.env.PORT || 5000
    @app.listen port

  startGame: ->
    socket = new WebSocket @app, @sessionStore
    new WuziGame socket
  
  setupRoutes: ->
    @app.get '/', homeRoute.index
    @app.post '/rooms', chessRoomRoute.create
    @app.get '/rooms/:id', chessRoomRoute.show

  setupWebServer: ->
    @sessionStore = new express.session.MemoryStore
    # WebServer
    @app = express.createServer()

    # setting
    @app.set 'view engine', 'ejs'
    @app.set "view options", layout: false
    @app.use express.static(__dirname + '/public')
    @app.use express.cookieParser()
    @app.use express.session secret: "secret string $#@$", store: @sessionStore

    @setupRoutes()

module.exports = { WebSocket, App }
