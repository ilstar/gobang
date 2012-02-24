(function() {
  var Chess;

  require("" + __dirname + "/../lib/array_ext");

  Chess = (function() {

    function Chess() {
      this.players = [];
      this.chess = {};
    }

    Chess.prototype.join = function(player) {
      if (this.isFull()) return;
      this.players = this.players.concat(player);
      this.chess[player.id] = [];
      if (this.player1 != null) {
        this.player2 = player;
      } else {
        this.player1 = player;
      }
      return player;
    };

    Chess.prototype.isFull = function() {
      return this.players.length === 2;
    };

    Chess.prototype.move = function(player, x, y) {
      if (!this.canMove(player)) return;
      if (this.positionBeTaken(x, y)) return;
      this.chess[player.id] = this.chess[player.id].concat({
        x: x,
        y: y
      });
      if (this.isWin(player)) {
        return 'win';
      } else {
        return 'moved';
      }
    };

    Chess.prototype.nextMovePlayer = function() {
      if (this.players.length === 0) throw "no player";
      if (this.players.length === 1) this.player1;
      if (this.canMove(this.player1)) {
        return this.player1;
      } else {
        return this.player2;
      }
    };

    Chess.prototype.canMove = function(player) {
      if (this.players.length !== 2) throw "length isnt 2";
      if (player === this.player1) {
        return this.chess[this.player1.id].length === this.chess[this.player2.id].length;
      } else if (player === this.player2) {
        return this.chess[this.player1.id].length === (this.chess[this.player2.id].length + 1);
      } else {
        throw "exception";
      }
    };

    Chess.prototype.positionBeTaken = function(x, y) {
      var point, _i, _j, _len, _len2, _ref, _ref2;
      if (!this.isFull()) throw "error players number";
      _ref = this.chess[this.player1.id];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        if (point.x === x && point.y === y) return true;
      }
      _ref2 = this.chess[this.player2.id];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        point = _ref2[_j];
        if (point.x === x && point.y === y) return true;
      }
      return false;
    };

    Chess.prototype.anotherPlayer = function(player) {
      if (this.players.length < 2) throw "length isnt 2";
      if (this.players[0] === player) {
        return this.players[1];
      } else {
        return this.players[0];
      }
    };

    Chess.prototype.isWin = function(player) {
      var c, chess, horizontalChessX, i, lastChess, leftSlash, rightSlash, s, verticalChessX, xs, ys, _i, _j, _k, _l, _len, _len2, _len3, _len4, _m, _n, _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _results2;
      chess = this.chess[player.id];
      lastChess = chess[chess.length - 1];
      horizontalChessX = [];
      xs = (function() {
        _results = [];
        for (var _i = _ref = lastChess.x - 4, _ref2 = lastChess.x + 4; _ref <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref <= _ref2 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
      for (_j = 0, _len = chess.length; _j < _len; _j++) {
        c = chess[_j];
        if (c.y === lastChess.y) xs.remove(c.x);
      }
      if (xs[0] === lastChess.x + 1) return true;
      if (xs[xs.length - 1] === lastChess.x - 1) return true;
      for (i = 1, _ref3 = xs.length - 1; 1 <= _ref3 ? i <= _ref3 : i >= _ref3; 1 <= _ref3 ? i++ : i--) {
        if (xs[i] - xs[i - 1] === 6) return true;
      }
      verticalChessX = [];
      ys = (function() {
        _results2 = [];
        for (var _k = _ref4 = lastChess.y - 4, _ref5 = lastChess.y + 4; _ref4 <= _ref5 ? _k <= _ref5 : _k >= _ref5; _ref4 <= _ref5 ? _k++ : _k--){ _results2.push(_k); }
        return _results2;
      }).apply(this);
      for (_l = 0, _len2 = chess.length; _l < _len2; _l++) {
        c = chess[_l];
        if (c.x === lastChess.x) ys.remove(c.y);
      }
      if (ys[0] === lastChess.y + 1) return true;
      if (ys[ys.length - 1] === lastChess.y - 1) return true;
      for (i = 1, _ref6 = ys.length - 1; 1 <= _ref6 ? i <= _ref6 : i >= _ref6; 1 <= _ref6 ? i++ : i--) {
        if (ys[i] - ys[i - 1] === 6) return true;
      }
      leftSlash = [
        {
          x: lastChess.x - 4,
          y: lastChess.y - 4
        }, {
          x: lastChess.x - 3,
          y: lastChess.y - 3
        }, {
          x: lastChess.x - 2,
          y: lastChess.y - 2
        }, {
          x: lastChess.x - 1,
          y: lastChess.y - 1
        }, {
          x: lastChess.x,
          y: lastChess.y
        }, {
          x: lastChess.x + 1,
          y: lastChess.y + 1
        }, {
          x: lastChess.x + 2,
          y: lastChess.y + 2
        }, {
          x: lastChess.x + 3,
          y: lastChess.y + 3
        }, {
          x: lastChess.x + 4,
          y: lastChess.y + 4
        }
      ];
      for (_m = 0, _len3 = chess.length; _m < _len3; _m++) {
        c = chess[_m];
        for (i = 0, _ref7 = leftSlash.length - 1; 0 <= _ref7 ? i <= _ref7 : i >= _ref7; 0 <= _ref7 ? i++ : i--) {
          s = leftSlash[i];
          if (c.x === s.x && c.y === s.y) {
            leftSlash.splice(i, 1);
            break;
          }
        }
      }
      if (leftSlash[0].x === lastChess.x + 1 && leftSlash[0].y === lastChess.y + 1) {
        return true;
      }
      if (leftSlash[leftSlash.length - 1].x === lastChess.x - 1 && leftSlash[leftSlash.length - 1].y === lastChess.y - 1) {
        return true;
      }
      for (i = 1, _ref8 = leftSlash.length - 1; 1 <= _ref8 ? i <= _ref8 : i >= _ref8; 1 <= _ref8 ? i++ : i--) {
        if (leftSlash[i].x - leftSlash[i - 1].x === 6 && leftSlash[i].y - leftSlash[i - 1].y === 6) {
          return true;
        }
      }
      rightSlash = [
        {
          x: lastChess.x - 4,
          y: lastChess.y + 4
        }, {
          x: lastChess.x - 3,
          y: lastChess.y + 3
        }, {
          x: lastChess.x - 2,
          y: lastChess.y + 2
        }, {
          x: lastChess.x - 1,
          y: lastChess.y + 1
        }, {
          x: lastChess.x,
          y: lastChess.y
        }, {
          x: lastChess.x + 1,
          y: lastChess.y - 1
        }, {
          x: lastChess.x + 2,
          y: lastChess.y - 2
        }, {
          x: lastChess.x + 3,
          y: lastChess.y - 3
        }, {
          x: lastChess.x + 4,
          y: lastChess.y - 4
        }
      ];
      for (_n = 0, _len4 = chess.length; _n < _len4; _n++) {
        c = chess[_n];
        for (i = 0, _ref9 = rightSlash.length - 1; 0 <= _ref9 ? i <= _ref9 : i >= _ref9; 0 <= _ref9 ? i++ : i--) {
          s = rightSlash[i];
          if (c.x === s.x && c.y === s.y) {
            rightSlash.splice(i, 1);
            break;
          }
        }
      }
      if (rightSlash[0].x === lastChess.x + 1 && rightSlash[0].y === lastChess.y - 1) {
        return true;
      }
      if (rightSlash[rightSlash.length - 1].x === lastChess.x - 1 && rightSlash[rightSlash.length - 1].y === lastChess.y + 1) {
        return true;
      }
      for (i = 1, _ref10 = rightSlash.length - 1; 1 <= _ref10 ? i <= _ref10 : i >= _ref10; 1 <= _ref10 ? i++ : i--) {
        if (rightSlash[i].x - rightSlash[i - 1].x === 6 && rightSlash[i].y - rightSlash[i - 1].y === -6) {
          return true;
        }
      }
    };

    return Chess;

  })();

  module.exports = Chess;

}).call(this);
