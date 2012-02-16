(function() {
  var colour, colours, drawItem, socket, user;

  colours = ['#eee', '#abc', '#ebc', '#daf'];

  colour = colours[parseInt(Math.random(1) * colours.length)];

  drawItem = function(item, colour) {
    return item.attr('bgcolor', colour);
  };

  user = window.user;

  socket = io.connect(null);

  socket.on('connect', function() {
    return socket.emit('register', {
      user_id: user.id
    });
  });

  socket.on('allNews', function(data) {
    console.log(data);
    drawItem($("#" + data.domId), data.colour);
    return user.flag = data.count % 2 === (user.id - 1);
  });

  socket.on('register', function(data) {
    return user.flag = data.flag;
  });

  socket.on('disconnect', function() {});

  jQuery(function() {
    return $('td').click(function() {
      var $item;
      if (user.flag) {
        $item = $(this);
        drawItem($item, colour);
        socket.emit('move', {
          domId: $item.attr('id'),
          colour: colour
        });
        return user.flag = false;
      } else {
        return alert("you can't move");
      }
    });
  });

}).call(this);
