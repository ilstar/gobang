Chess = require "#{__dirname}/../models/chess.coffee"

class Player
  constructor: ->
    @name = "Player #{parseInt(Math.random(50))}"

describe "Jasmine", ->
  beforeEach ->
    @chess = new Chess
    @player1 = new Player
    @player2 = new Player
    @chess.join @player1
    @chess.join @player2

  describe "isWin", ->
    describe "win in horizontal", ->
      it "last point in last", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 1
        @chess.move @player2, 3, 3
        @chess.move @player1, 3, 1
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 1
        @chess.move @player2, 3, 5
        @chess.move @player1, 5, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in first", ->
        @chess.move @player1, 5, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 1
        @chess.move @player2, 3, 3
        @chess.move @player1, 3, 1
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 1
        @chess.move @player2, 3, 5
        @chess.move @player1, 1, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in middle", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 1
        @chess.move @player2, 3, 3
        @chess.move @player1, 5, 1
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 1
        @chess.move @player2, 3, 5
        @chess.move @player1, 3, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

    describe "win in vertical", ->
      it "last point in top", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 1, 2
        @chess.move @player2, 3, 3
        @chess.move @player1, 1, 3
        @chess.move @player2, 3, 4
        @chess.move @player1, 1, 4
        @chess.move @player2, 3, 5
        @chess.move @player1, 1, 5 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in bottom", ->
        @chess.move @player1, 1, 5
        @chess.move @player2, 3, 1
        @chess.move @player1, 1, 2
        @chess.move @player2, 3, 3
        @chess.move @player1, 1, 3
        @chess.move @player2, 3, 4
        @chess.move @player1, 1, 4
        @chess.move @player2, 3, 5
        @chess.move @player1, 1, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in middle", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 1, 2
        @chess.move @player2, 3, 3
        @chess.move @player1, 1, 5
        @chess.move @player2, 3, 4
        @chess.move @player1, 1, 4
        @chess.move @player2, 3, 5
        @chess.move @player1, 1, 3 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

    describe "win in left slash", ->
      it "last point in top", ->
        @chess.move @player1, 5, 5
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 2
        @chess.move @player2, 3, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 4
        @chess.move @player2, 3, 5
        @chess.move @player1, 1, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in bottom", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 2
        @chess.move @player2, 3, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 4
        @chess.move @player2, 3, 5
        @chess.move @player1, 5, 5 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in top", ->
        @chess.move @player1, 5, 5
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 2
        @chess.move @player2, 3, 3
        @chess.move @player1, 1, 1
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 4
        @chess.move @player2, 3, 5
        @chess.move @player1, 3, 3 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

    describe "win in right slash", ->
      it "last point in top", ->
        @chess.move @player1, 1, 5
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 4
        @chess.move @player2, 3, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 2
        @chess.move @player2, 3, 5
        @chess.move @player1, 5, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in bottom", ->
        @chess.move @player1, 5, 1
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 4
        @chess.move @player2, 3, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 2
        @chess.move @player2, 3, 5
        @chess.move @player1, 1, 5 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in middle", ->
        @chess.move @player1, 1, 5
        @chess.move @player2, 3, 1
        @chess.move @player1, 2, 4
        @chess.move @player2, 3, 3
        @chess.move @player1, 5, 1
        @chess.move @player2, 3, 4
        @chess.move @player1, 4, 2
        @chess.move @player2, 3, 5
        @chess.move @player1, 3, 3 # player1 win

        expect(@chess.isWin(@player1)).toEqual true
