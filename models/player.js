(function() {
  var Player, colours, count;

  count = 0;

  colours = ['#eee', '#abc', '#ebc', '#daf'];

  Player = (function() {

    function Player() {
      this.id = ++count;
      this.name = "Player " + count;
      this.colour = colours[parseInt(Math.random(1) * colours.length)];
    }

    return Player;

  })();

  module.exports = Player;

}).call(this);
