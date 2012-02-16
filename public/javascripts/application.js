(function() {
  var colour, colours, drawItem, socket;

  colours = ['#eee', '#abc', '#ebc', '#daf'];

  colour = colours[parseInt(Math.random(1) * colours.length)];

  drawItem = function(item, colour) {
    return item.attr('bgcolor', colour);
  };

  socket = io.connect(null);

  socket.on('connect', function() {
    return socket.send("hi, I'm connect....");
  });

  socket.on('allNews', function(data) {
    return drawItem($("#" + data.domId), data.colour);
  });

  socket.on('disconnect', function() {});

  jQuery(function() {
    return $('td').click(function() {
      var $item;
      $item = $(this);
      drawItem($item, colour);
      return socket.emit('news', {
        domId: $item.attr('id'),
        colour: colour
      });
    });
  });

}).call(this);
