(function() {
  var GameClient, drawItem, game, resetChessRoom, user,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  drawItem = function(x, y, colour) {
    return $("td[data-x=" + x + "][data-y=" + y + "]").attr('bgcolor', colour);
  };

  resetChessRoom = function() {
    return $('td[bgcolor]').removeAttr('bgcolor');
  };

  user = {};

  GameClient = (function() {

    function GameClient() {
      this.connectListener = __bind(this.connectListener, this);      this.socket = io.connect(null);
    }

    GameClient.prototype.start = function() {
      this.socket.on('connect', this.connectListener);
      this.socket.on('allNews', this.allNewsListener);
      this.socket.on('reset_chess', this.resetChessListener);
      this.socket.on('win', this.winListener);
      return this.socket.on('register', this.registerListener);
    };

    GameClient.prototype.connectListener = function() {
      return this.socket.emit('register');
    };

    GameClient.prototype.allNewsListener = function(data) {
      drawItem(data.x, data.y, data.colour);
      return user.canMove = data.user !== 'me';
    };

    GameClient.prototype.resetChessListener = function(data) {
      resetChessRoom();
      if (data === 'start') return user.canMove = true;
    };

    GameClient.prototype.winListener = function(data) {
      if (data.user === 'you') {
        return alert('you win');
      } else {
        return alert('so bad, he win!');
      }
    };

    GameClient.prototype.registerListener = function(data) {
      return user.canMove = data.canMove;
    };

    return GameClient;

  })();

  game = new GameClient;

  game.start();

  jQuery(function() {
    $('td').click(function() {
      var $item, x, y;
      if (user.canMove) {
        $item = $(this);
        x = $item.data('x');
        y = $item.data('y');
        return game.socket.emit('move', {
          x: x,
          y: y
        });
      } else {
        return alert("you can't move");
      }
    });
    return $('#reset_chess').click(function() {
      return game.socket.emit('reset_chess');
    });
  });

}).call(this);
