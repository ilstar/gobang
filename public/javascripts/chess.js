(function() {
  var drawItem, resetChessRoom, socket, user;

  drawItem = function(x, y, colour) {
    return $("td[data-x=" + x + "][data-y=" + y + "]").attr('bgcolor', colour);
  };

  resetChessRoom = function() {
    return $('td[bgcolor]').removeAttr('bgcolor');
  };

  user = window.user;

  socket = io.connect(null);

  socket.on('connect', function() {
    return socket.emit('register');
  });

  socket.on('allNews', function(data) {
    drawItem(data.x, data.y, data.colour);
    return user.canMove = data.user !== 'me';
  });

  socket.on('reset_chess', function(data) {
    resetChessRoom();
    if (data === 'start') return user.canMove = true;
  });

  socket.on('win', function(data) {
    if (data.user === 'you') {
      return alert('you win');
    } else {
      return alert('so bad, he win!');
    }
  });

  socket.on('register', function(data) {
    return user.canMove = data.canMove;
  });

  jQuery(function() {
    $('td').click(function() {
      var $item, x, y;
      if (user.canMove) {
        $item = $(this);
        x = $item.data('x');
        y = $item.data('y');
        return socket.emit('move', {
          x: x,
          y: y
        });
      } else {
        return alert("you can't move");
      }
    });
    return $('#reset_chess').click(function() {
      return socket.emit('reset_chess');
    });
  });

}).call(this);
