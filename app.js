(function() {
  var app, chessRoomRoute, express, homeRoute, io, parseCookie, port, setupWebServer, socketIO, startApp, _ref;

  express = require('express');

  require('ejs');

  parseCookie = require('connect').utils.parseCookie;

  socketIO = require('socket.io');

  setupWebServer = function(sessionStore) {
    var app;
    app = express.createServer();
    app.set('view engine', 'ejs');
    app.set("view options", {
      layout: false
    });
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({
      secret: "secret string $#@$",
      store: sessionStore
    }));
    return app;
  };

  startApp = function() {
    var app, io, sessionStore;
    sessionStore = new express.session.MemoryStore;
    app = setupWebServer(sessionStore);
    io = socketIO.listen(app);
    global.chesses = {};
    return [app, io];
  };

  _ref = startApp(), app = _ref[0], io = _ref[1];

  homeRoute = require("" + __dirname + "/routes/home");

  chessRoomRoute = require("" + __dirname + "/routes/chess_room");

  app.get('/', homeRoute.index);

  app.post('/rooms', chessRoomRoute.create);

  app.get('/rooms/:id', chessRoomRoute.show);

  port = process.env.PORT || 5000;

  app.listen(port);

  io.set('authorization', function(data, callback) {
    var sessionID;
    if (data.headers.cookie != null) {
      data.cookie = parseCookie(data.headers.cookie);
      sessionID = data.cookie['connect.sid'];
      return sessionStore.get(sessionID, function(error, session) {
        if (error || !session) {
          return callback(new Error("There's no session"));
        } else {
          data.session = session;
          return callback(null, true);
        }
      });
    } else {
      return callback(new Error("No cookie transmitted!"));
    }
  });

  io.configure(function() {
    io.set('transports', ['xhr-polling']);
    return io.set('polling duration', 10);
  });

  io.sockets.on('connection', function(socket) {
    var chess, current_user;
    current_user = socket.handshake.session.current_user;
    chess = chesses[current_user.roomId];
    socket.on('move', function(data) {
      var result;
      result = chess.move(current_user, parseInt(data.x), parseInt(data.y));
      if (result === 'moved') {
        socket.broadcast.emit('allNews', {
          x: data.x,
          y: data.y,
          colour: current_user.colour,
          user: 'other'
        });
        return socket.emit('allNews', {
          x: data.x,
          y: data.y,
          colour: current_user.colour,
          user: 'me'
        });
      } else if (result === 'win') {
        socket.broadcast.emit('win', {
          user: 'other'
        });
        return socket.emit('win', {
          user: 'you'
        });
      }
    });
    socket.on('register', function(data) {
      chess.join(current_user);
      if (chess.isFull()) {
        return socket.broadcast.emit('register', {
          canMove: true
        });
      }
    });
    socket.on('reset_chess', function() {
      if (chess.isWinner(current_user)) {
        chess.reset();
        socket.broadcast.emit('reset_chess');
        return socket.emit('reset_chess', 'start');
      }
    });
    return socket.on('disconnect', function() {
      return console.log('a client disconnected...');
    });
  });

}).call(this);
