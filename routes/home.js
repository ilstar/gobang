(function() {
  var Home, Player;

  Player = require("" + __dirname + "/../models/player");

  Home = (function() {

    function Home() {}

    Home.prototype.index = function(req, res) {
      var _base;
      if ((_base = req.session).current_user == null) {
        _base.current_user = new Player;
      }
      return res.render('index');
    };

    return Home;

  })();

  module.exports = new Home;

}).call(this);
