(function() {
  var Chess, Player, app, chesses, express, io, parseCookie, port, sessionStore;

  express = require('express');

  app = express.createServer();

  io = require('socket.io').listen(app);

  sessionStore = new express.session.MemoryStore;

  require('ejs');

  parseCookie = require('connect').utils.parseCookie;

  Chess = require("" + __dirname + "/models/chess");

  Player = require("" + __dirname + "/models/player");

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

  chesses = {};

  chesses['test'] = new Chess;

  app.get('/', function(req, res) {
    var _base;
    if ((_base = req.session).current_user == null) {
      _base.current_user = new Player;
    }
    return res.render('index', {
      current_user: req.session.current_user
    });
  });

  app.post('/rooms', function(req, res) {
    var roomId;
    roomId = "" + req.session.current_user.id + "-" + (new Date().getTime());
    return res.redirect("/" + roomId);
  });

  app.get('/:id', function(req, res) {
    var chess;
    chess = chesses[req.params.id];
    if (!(chess != null)) chess = chesses[req.params.id] = new Chess;
    return res.render('chess', {
      current_user: req.session.current_user
    });
  });

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
    console.log(current_user);
    chess = chesses['test'];
    socket.on('move', function(data) {
      var result;
      result = chess.move(current_user, parseInt(data.x), parseInt(data.y));
      if (result === 'moved') {
        return socket.broadcast.emit('allNews', {
          x: data.x,
          y: data.y,
          colour: current_user.colour
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
    return socket.on('disconnect', function() {
      return console.log('a client disconnected...');
    });
  });

}).call(this);
