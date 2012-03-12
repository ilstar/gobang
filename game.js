(function() {
  var WuziGame, WuziGameSession,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      if (result === 'moved' || result === 'win') {
        this.socket.broadcast.emit('move', {
          x: data.x,
          y: data.y,
          colour: this.current_user.colour,
          user: 'other'
        });
        this.socket.emit('move', {
          x: data.x,
          y: data.y,
          colour: this.current_user.colour,
          user: 'me'
        });
      }
      if (result === 'win') {
        this.socket.broadcast.emit('lost');
        return this.socket.emit('win');
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

  module.exports = {
    WuziGame: WuziGame,
    WuziGameSession: WuziGameSession
  };

}).call(this);
