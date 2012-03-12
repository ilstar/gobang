(function() {
  var GameClient, game, user,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GameClient = (function() {

    function GameClient(user) {
      this.user = user;
      this.registerListener = __bind(this.registerListener, this);
      this.resetChessListener = __bind(this.resetChessListener, this);
      this.moveListener = __bind(this.moveListener, this);
      this.connectListener = __bind(this.connectListener, this);
      this.socket = io.connect(null);
    }

    GameClient.prototype.start = function() {
      this.socket.on('connect', this.connectListener);
      this.socket.on('move', this.moveListener);
      this.socket.on('reset_chess', this.resetChessListener);
      this.socket.on('notify', this.notificationListener);
      return this.socket.on('register', this.registerListener);
    };

    GameClient.prototype.move = function(x, y) {
      return this.socket.emit('move', {
        x: x,
        y: y
      });
    };

    GameClient.prototype.reset = function() {
      return this.socket.emit('reset_chess');
    };

    GameClient.prototype.drawItem = function(x, y, colour) {
      return $("td[data-x=" + x + "][data-y=" + y + "]").attr('bgcolor', colour);
    };

    GameClient.prototype.resetChessRoom = function() {
      return $('td[bgcolor]').removeAttr('bgcolor');
    };

    GameClient.prototype.connectListener = function() {
      return this.socket.emit('register');
    };

    GameClient.prototype.moveListener = function(data) {
      this.drawItem(data.x, data.y, data.colour);
      return this.user.canMove = data.user !== 'me';
    };

    GameClient.prototype.resetChessListener = function(data) {
      this.resetChessRoom();
      if (data === 'start') return this.user.canMove = true;
    };

    GameClient.prototype.notificationListener = function(data) {
      return alert(data);
    };

    GameClient.prototype.registerListener = function(data) {
      return this.user.canMove = data.canMove;
    };

    return GameClient;

  })();

  user = {};

  game = new GameClient(user);

  game.start();

  jQuery(function() {
    $('td').click(function() {
      var $item, x, y;
      if (user.canMove) {
        $item = $(this);
        x = $item.data('x');
        y = $item.data('y');
        return game.move(x, y);
      } else {
        return alert("you can't move");
      }
    });
    return $('#reset_chess').click(function() {
      return game.reset();
    });
  });

}).call(this);
