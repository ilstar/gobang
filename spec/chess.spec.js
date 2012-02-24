(function() {
  var Chess, Player;

  Chess = require("" + __dirname + "/../models/chess");

  Player = require("" + __dirname + "/../models/player");

  describe("Jasmine", function() {
    beforeEach(function() {
      this.chess = new Chess;
      this.player1 = new Player;
      this.player2 = new Player;
      this.chess.join(this.player1);
      return this.chess.join(this.player2);
    });
    describe("join", function() {
      beforeEach(function() {
        return this.chess2 = new Chess;
      });
      it("return current player if he can joined", function() {
        return expect(this.chess2.join(this.player1)).toEqual(this.player1);
      });
      it("as player1 when no one joined", function() {
        this.chess2.join(this.player1);
        return expect(this.chess2.players).toEqual([this.player1]);
      });
      it("as player2 after somebody joined", function() {
        this.chess2.join(this.player1);
        this.chess2.join(this.player2);
        return expect(this.chess2.players).toEqual([this.player1, this.player2]);
      });
      return it("can't join because it's full", function() {
        return expect(this.chess.join(new Player)).toBe(void 0);
      });
    });
    describe("isFull", function() {
      it("can when nobody join", function() {
        var chess;
        chess = new Chess;
        return expect(chess.isFull(this.player1)).toBe(false);
      });
      it("can when only one person joined", function() {
        var chess;
        chess = new Chess;
        chess.join(new Player);
        return expect(chess.isFull(this.player1)).toBe(false);
      });
      return it("can not when two people have joined", function() {
        return expect(this.chess.isFull(new Player)).toBe(true);
      });
    });
    describe("move", function() {
      it("can't move if not turn him", function() {
        return expect(this.chess.move(this.player2, 3, 6)).toBe(void 0);
      });
      it("can't move repeat with himself", function() {
        this.chess.move(this.player1, 1, 3);
        return expect(this.chess.move(this.player2, 1, 3)).toBe(void 0);
      });
      it("can't move repeat with other", function() {
        this.chess.move(this.player1, 1, 3);
        this.chess.move(this.player2, 2, 3);
        return expect(this.chess.move(this.player1, 2, 3)).toBe(void 0);
      });
      it("move successfully", function() {
        var count;
        count = this.chess.chess[this.player1.id].length;
        expect(this.chess.move(this.player1, 3, 3)).toBe('moved');
        return expect(this.chess.chess[this.player1.id].length).toBe(count + 1);
      });
      return it("return win if he win", function() {
        this.chess.isWin = function() {
          return true;
        };
        return expect(this.chess.move(this.player1, 1, 1)).toBe('win');
      });
    });
    describe("positionBeTaken", function() {
      it("false when no any point", function() {
        return expect(this.chess.positionBeTaken(1, 1)).toBe(false);
      });
      it("true when player1 taken 1, 1", function() {
        this.chess.move(this.player1, 1, 1);
        return expect(this.chess.positionBeTaken(1, 1)).toBe(true);
      });
      return it("true when player2 taken 1, 1", function() {
        this.chess.move(this.player1, 3, 1);
        this.chess.move(this.player2, 1, 1);
        return expect(this.chess.positionBeTaken(1, 1)).toBe(true);
      });
    });
    describe("canMove", function() {
      it("can not when has no player", function() {
        var chess;
        chess = new Chess;
        return expect(function() {
          return chess.canMove(this.player1);
        }).toThrow("length isnt 2");
      });
      it("can not when has 1 player", function() {
        var chess;
        chess = new Chess;
        chess.join(this.player1);
        return expect(function() {
          return chess.canMove(this.player1);
        }).toThrow("length isnt 2");
      });
      it("player1 can move firstly", function() {
        return expect(this.chess.canMove(this.player1)).toBe(true);
      });
      it("player2 cant move firstly", function() {
        return expect(this.chess.canMove(this.player2)).toBe(false);
      });
      it("player2 can move after player1 moved", function() {
        this.chess.move(this.player1, 3, 3);
        return expect(this.chess.canMove(this.player2)).toBe(true);
      });
      it("player1 cant after player1 moved", function() {
        this.chess.move(this.player1, 1, 1);
        return expect(this.chess.canMove(this.player1)).toBe(false);
      });
      it("player1 can move after player2 moved", function() {
        this.chess.move(this.player1, 1, 1);
        this.chess.move(this.player2, 2, 1);
        return expect(this.chess.canMove(this.player1)).toBe(true);
      });
      return it("player2 cant move after player2 moved", function() {
        this.chess.move(this.player1, 1, 1);
        this.chess.move(this.player2, 2, 1);
        return expect(this.chess.canMove(this.player2)).toBe(false);
      });
    });
    describe("anotherPlayer", function() {
      it("throw exception when no player1", function() {
        var chess;
        chess = new Chess;
        return expect(function() {
          return chess.anotherPlayer(this.player1);
        }).toThrow("length isnt 2");
      });
      it("throw exception when only has one player", function() {
        var chess;
        chess = new Chess;
        chess.join(new Player);
        return expect(function() {
          return chess.anotherPlayer(this.player1);
        }).toThrow("length isnt 2");
      });
      it("should be player2", function() {
        return expect(this.chess.anotherPlayer(this.player1)).toBe(this.player2);
      });
      return it("should be player1", function() {
        return expect(this.chess.anotherPlayer(this.player2)).toBe(this.player1);
      });
    });
    describe("nextMovePlayer", function() {
      it("should be player1 when there is not any point", function() {
        return expect(this.chess.nextMovePlayer()).toBe(this.player1);
      });
      it("should be player2 after player1 move", function() {
        this.chess.move(this.player1, 3, 3);
        return expect(this.chess.nextMovePlayer()).toBe(this.player2);
      });
      return it("should be player1 again after player2 move", function() {
        this.chess.move(this.player1, 3, 3);
        this.chess.move(this.player2, 4, 3);
        return expect(this.chess.nextMovePlayer()).toBe(this.player1);
      });
    });
    return describe("isWin", function() {
      describe("win in horizontal", function() {
        it("last point in last", function() {
          this.chess.move(this.player1, 1, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 1);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 3, 1);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 1);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 5, 1);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        it("last point in first", function() {
          this.chess.move(this.player1, 5, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 1);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 3, 1);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 1);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 1, 1);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        return it("last point in middle", function() {
          this.chess.move(this.player1, 1, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 1);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 5, 1);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 1);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 3, 1);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
      });
      describe("win in vertical", function() {
        it("last point in top", function() {
          this.chess.move(this.player1, 1, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 1, 2);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 1, 3);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 1, 4);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 1, 5);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        it("last point in bottom", function() {
          this.chess.move(this.player1, 1, 5);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 1, 2);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 1, 3);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 1, 4);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 1, 1);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        return it("last point in middle", function() {
          this.chess.move(this.player1, 1, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 1, 2);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 1, 5);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 1, 4);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 1, 3);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
      });
      describe("win in left slash", function() {
        it("last point in top", function() {
          this.chess.move(this.player1, 5, 5);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 2);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 3, 3);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 4);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 1, 1);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        it("last point in bottom", function() {
          this.chess.move(this.player1, 1, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 2);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 3, 3);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 4);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 5, 5);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        return it("last point in top", function() {
          this.chess.move(this.player1, 5, 5);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 2);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 1, 1);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 4);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 3, 3);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
      });
      return describe("win in right slash", function() {
        it("last point in top", function() {
          this.chess.move(this.player1, 1, 5);
          this.chess.move(this.player2, 9, 1);
          this.chess.move(this.player1, 2, 4);
          this.chess.move(this.player2, 9, 3);
          this.chess.move(this.player1, 3, 3);
          this.chess.move(this.player2, 7, 4);
          this.chess.move(this.player1, 4, 2);
          this.chess.move(this.player2, 8, 5);
          this.chess.move(this.player1, 5, 1);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        it("last point in bottom", function() {
          this.chess.move(this.player1, 5, 1);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 4);
          this.chess.move(this.player2, 8, 3);
          this.chess.move(this.player1, 3, 3);
          this.chess.move(this.player2, 9, 4);
          this.chess.move(this.player1, 4, 2);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 1, 5);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
        return it("last point in middle", function() {
          this.chess.move(this.player1, 1, 5);
          this.chess.move(this.player2, 8, 1);
          this.chess.move(this.player1, 2, 4);
          this.chess.move(this.player2, 8, 3);
          this.chess.move(this.player1, 5, 1);
          this.chess.move(this.player2, 8, 4);
          this.chess.move(this.player1, 4, 2);
          this.chess.move(this.player2, 9, 5);
          this.chess.move(this.player1, 3, 3);
          return expect(this.chess.isWin(this.player1)).toEqual(true);
        });
      });
    });
  });

}).call(this);
