(function() {
  var App, WebSocket, WuziGame, WuziGameSession, chessRoomRoute, express, homeRoute, parseCookie, socketIO, _ref;

  express = require('express');

  require('ejs');

  socketIO = require('socket.io');

  parseCookie = require('connect').utils.parseCookie;

  _ref = require("" + __dirname + "/game"), WuziGame = _ref.WuziGame, WuziGameSession = _ref.WuziGameSession;

  homeRoute = require("" + __dirname + "/routes/home");

  chessRoomRoute = require("" + __dirname + "/routes/chess_room");

  WebSocket = (function() {

    function WebSocket(app, sessionStore) {
      this.app = app;
      this.sessionStore = sessionStore;
      this.io = socketIO.listen(this.app);
      this.configureOptions();
      this.setupFilters(['session']);
    }

    WebSocket.prototype.configureOptions = function() {
      var _this = this;
      return this.io.configure(function() {
        _this.io.set('transports', ['xhr-polling']);
        return _this.io.set('polling duration', 10);
      });
    };

    WebSocket.prototype.sessionFilter = function() {
      var _this = this;
      return this.io.set('authorization', function(request, callback) {
        var sessionID;
        if (request.headers.cookie != null) {
          request.cookie = parseCookie(request.headers.cookie);
          sessionID = request.cookie['connect.sid'];
          return _this.sessionStore.get(sessionID, function(error, session) {
            if (error || !session) {
              return callback(new Error("There's no session"));
            } else {
              request.session = session;
              return callback(null, true);
            }
          });
        } else {
          return callback(new Error("No cookie transmitted!"));
        }
      });
    };

    WebSocket.prototype.setupFilters = function(name) {
      return this["" + name + "Filter"]();
    };

    return WebSocket;

  })();

  App = (function() {

    function App() {
      global.chesses = {};
      this.prepareWebserver();
      this.startGame();
      this.startWebserver();
    }

    App.prototype.startWebserver = function() {
      var port;
      port = process.env.PORT || 5000;
      return this.app.listen(port);
    };

    App.prototype.prepareWebserver = function() {
      this.sessionStore = new express.session.MemoryStore;
      this.app = this.setupWebServer(this.sessionStore);
      return this.setupRoutes(this.app);
    };

    App.prototype.startGame = function() {
      this.socket = new WebSocket(this.app, this.sessionStore);
      return this.game = new WuziGame(this.socket);
    };

    App.prototype.setupRoutes = function(app) {
      app.get('/', homeRoute.index);
      app.post('/rooms', chessRoomRoute.create);
      return app.get('/rooms/:id', chessRoomRoute.show);
    };

    App.prototype.setupWebServer = function(sessionStore) {
      var app;
      app = express.createServer();
      app.set('view engine', 'ejs');
      app.set("view options", {
        layout: false
      });
      app.use(express.static(__dirname + '/public'));
      app.use(express.cookieParser());
      return app.use(express.session({
        secret: "secret string $#@$",
        store: sessionStore
      }));
    };

    return App;

  })();

  module.exports = {
    WebSocket: WebSocket,
    App: App
  };

}).call(this);
