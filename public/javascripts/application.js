(function() {
  var colour, drawItem, socket, user;

  colour = "#efd";

  drawItem = function(x, y, colour) {
    return $("td[data-x=" + x + "][data-y=" + y + "]").attr('bgcolor', colour);
  };

  user = window.user;

  socket = io.connect(null);

  socket.on('connect', function() {
    return socket.emit('register', {
      user_id: user.id
    });
  });

  socket.on('allNews', function(data) {
    drawItem(data.x, data.y, data.colour);
    return user.canMove = !user.canMove;
  });

  socket.on('register', function(data) {
    return user.canMove = data.canMove;
  });

  socket.on('disconnect', function() {});

  jQuery(function() {
    return $('td').click(function() {
      var $item, x, y;
      if (user.canMove) {
        $item = $(this);
        x = $item.attr('data-x');
        y = $item.attr('data-y');
        drawItem(x, y, colour);
        return socket.emit('move', {
          x: x,
          y: y
        });
      } else {
        return alert("you can't move");
      }
    });
  });

}).call(this);
