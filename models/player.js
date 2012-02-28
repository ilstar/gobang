(function() {
  var Player, count;

  count = 0;

  Player = (function() {

    function Player() {
      this.id = ++count;
      this.name = "Player " + count;
    }

    return Player;

  })();

  module.exports = Player;

}).call(this);
