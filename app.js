(function() {
  var App, WebSocket, WuziGame, WuziGameSession, app, chessRoomRoute, express, homeRoute, parseCookie, socketIO,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  express = require('express');

  require('ejs');

  parseCookie = require('connect').utils.parseCookie;

  socketIO = require('socket.io');

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

  WuziGame = (function() {

    function WuziGame(webSocket) {
      this.webSocket = webSocket;
      this.io = this.webSocket.io;
      this.startObserving();
    }

    WuziGame.prototype.startObserving = function() {
      var _this = this;
      return this.io.sockets.on('connection', function(socket) {
        var gameSession;
        gameSession = new WuziGameSession(socket);
        socket.on('move', gameSession.moveListener);
        socket.on('register', gameSession.registerListener);
        socket.on('reset_chess', gameSession.resetListener);
        return socket.on('disconnect', gameSession.disconnectListener);
      });
    };

    return WuziGame;

  })();

  WuziGameSession = (function() {

    function WuziGameSession(socket) {
      this.socket = socket;
      this.disconnectListener = __bind(this.disconnectListener, this);
      this.resetListener = __bind(this.resetListener, this);
      this.registerListener = __bind(this.registerListener, this);
      this.moveListener = __bind(this.moveListener, this);
      this.current_user = this.socket.handshake.session.current_user;
      this.chess = chesses[this.current_user.roomId];
    }

    WuziGameSession.prototype.moveListener = function(data) {
      var result;
      result = this.chess.move(this.current_user, parseInt(data.x), parseInt(data.y));
      if (result === 'moved') {
        this.socket.broadcast.emit('allNews', {
          x: data.x,
          y: data.y,
          colour: this.current_user.colour,
          user: 'other'
        });
        return this.socket.emit('allNews', {
          x: data.x,
          y: data.y,
          colour: this.current_user.colour,
          user: 'me'
        });
      } else if (result === 'win') {
        this.socket.broadcast.emit('win', {
          user: 'other'
        });
        return this.socket.emit('win', {
          user: 'you'
        });
      }
    };

    WuziGameSession.prototype.registerListener = function(data) {
      this.chess.join(this.current_user);
      if (this.chess.isFull()) {
        return this.socket.broadcast.emit('register', {
          canMove: true
        });
      }
    };

    WuziGameSession.prototype.resetListener = function() {
      if (this.chess.isWinner(this.current_user)) {
        this.chess.reset();
        this.socket.broadcast.emit('reset_chess');
        return this.socket.emit('reset_chess', 'start');
      }
    };

    WuziGameSession.prototype.disconnectListener = function() {
      return this.socket.on('disconnect', function() {
        return console.log('a client disconnected...');
      });
    };

    return WuziGameSession;

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

  app = new App();

}).call(this);
