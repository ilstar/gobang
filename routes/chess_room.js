(function() {
  var Chess, ChessRoom, Player;

  Player = require("" + __dirname + "/../models/player");

  Chess = require("" + __dirname + "/../models/chess");

  ChessRoom = (function() {

    function ChessRoom() {}

    ChessRoom.prototype.create = function(req, res) {
      var roomId;
      roomId = "" + req.session.current_user.id + "-" + (new Date().getTime());
      if (chesses[roomId] == null) chesses[roomId] = new Chess;
      return res.redirect("/rooms/" + roomId);
    };

    ChessRoom.prototype.show = function(req, res) {
      var _base, _base2;
      if ((_base = req.session).current_user == null) {
        _base.current_user = new Player;
      }
      if ((_base2 = req.session.current_user).roomId == null) {
        _base2.roomId = req.params.id;
      }
      return res.render('chess', {
        current_user: req.session.current_user
      });
    };

    return ChessRoom;

  })();

  module.exports = new ChessRoom;

}).call(this);
