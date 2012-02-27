Chess = require "#{__dirname}/../models/chess"
Player = require "#{__dirname}/../models/player"

describe "Jasmine", ->
  beforeEach ->
    @chess = new Chess
    @player1 = new Player
    @player2 = new Player
    @chess.join @player1
    @chess.join @player2

  describe "join", ->
    beforeEach ->
      @chess2 = new Chess

    it "return current player if he can joined", ->
      expect(@chess2.join @player1).toEqual @player1

    it "as player1 when no one joined", ->
      @chess2.join @player1

      expect(@chess2.players).toEqual [@player1]

    it "as player2 after somebody joined", ->
      @chess2.join @player1
      @chess2.join @player2

      expect(@chess2.players).toEqual [@player1, @player2]

    it "can't join because it's full", ->
      expect(@chess.join new Player).toBe undefined

  describe "isFull", ->
    it "can when nobody join", ->
      chess = new Chess

      expect(chess.isFull @player1).toBe false

    it "can when only one person joined", ->
      chess = new Chess
      chess.join new Player

      expect(chess.isFull @player1).toBe false

    it "can not when two people have joined", ->
      expect(@chess.isFull new Player).toBe true

  describe "move", ->
    it "can't move if not turn him", ->
      expect(@chess.move(@player2, 3, 6)).toBe undefined

    it "can't move repeat with himself", ->
      @chess.move @player1, 1, 3

      expect(@chess.move @player2, 1, 3).toBe undefined

    it "can't move repeat with other", ->
      @chess.move @player1, 1, 3
      @chess.move @player2, 2, 3

      expect(@chess.move @player1, 2, 3).toBe undefined

    it "move successfully", ->
      count = @chess.chess[@player1.id].length

      expect(@chess.move @player1, 3, 3).toBe 'moved'
      expect(@chess.chess[@player1.id].length).toBe count + 1

    it "return win if he win", ->
      @chess.isWin = -> true # mock

      expect(@chess.move @player1, 1, 1).toBe 'win'

  describe "positionBeTaken", ->
    it "false when no any point", ->
      expect(@chess.positionBeTaken 1, 1).toBe false

    it "true when player1 taken 1, 1", ->
      @chess.move @player1, 1, 1
      expect(@chess.positionBeTaken 1, 1).toBe true

    it "true when player2 taken 1, 1", ->
      @chess.move @player1, 3, 1
      @chess.move @player2, 1, 1
      expect(@chess.positionBeTaken 1, 1).toBe true


  describe "canMove", ->
    it "can not when has no player", ->
      chess = new Chess
      expect(->
        chess.canMove @player1
      ).toThrow "length isnt 2"

    it "can not when has 1 player", ->
      chess = new Chess
      chess.join @player1

      expect(->
        chess.canMove @player1
      ).toThrow "length isnt 2"

    it "player1 can move firstly", ->
      expect(@chess.canMove @player1).toBe true

    it "player2 cant move firstly", ->
      expect(@chess.canMove @player2).toBe false

    it "player2 can move after player1 moved", ->
      @chess.move @player1, 3, 3

      expect(@chess.canMove @player2).toBe true

    it "player1 cant after player1 moved", ->
      @chess.move @player1, 1, 1

      expect(@chess.canMove @player1).toBe false

    it "player1 can move after player2 moved", ->
      @chess.move @player1, 1, 1
      @chess.move @player2, 2, 1

      expect(@chess.canMove @player1).toBe true

    it "player2 cant move after player2 moved", ->
      @chess.move @player1, 1, 1
      @chess.move @player2, 2, 1

      expect(@chess.canMove @player2).toBe false

  describe "anotherPlayer", ->
    it "throw exception when no player1", ->
      chess = new Chess
      expect(->
        chess.anotherPlayer @player1
      ).toThrow "length isnt 2"

    it "throw exception when only has one player", ->
      chess = new Chess
      chess.join new Player
      expect(->
        chess.anotherPlayer @player1
      ).toThrow "length isnt 2"

    it "should be player2", ->
      expect(@chess.anotherPlayer(@player1)).toBe @player2

    it "should be player1", ->
      expect(@chess.anotherPlayer(@player2)).toBe @player1

  describe "nextMovePlayer", ->
    it "should be player1 when there is not any point", ->
      expect(@chess.nextMovePlayer()).toBe @player1

    it "should be player2 after player1 move", ->
      @chess.move @player1, 3, 3

      expect(@chess.nextMovePlayer()).toBe @player2

    it "should be player1 again after player2 move", ->
      @chess.move @player1, 3, 3
      @chess.move @player2, 4, 3

      expect(@chess.nextMovePlayer()).toBe @player1

  describe "isWin", ->
    describe "win in horizontal", ->
      it "last point in last", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 1
        @chess.move @player2, 9, 3
        @chess.move @player1, 3, 1
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 1
        @chess.move @player2, 9, 5
        @chess.move @player1, 5, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true
        expect(@chess.winner).toEqual @player1

      it "last point in first", ->
        @chess.move @player1, 5, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 1
        @chess.move @player2, 9, 3
        @chess.move @player1, 3, 1
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 1
        @chess.move @player2, 9, 5
        @chess.move @player1, 1, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in middle", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 1
        @chess.move @player2, 9, 3
        @chess.move @player1, 5, 1
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 1
        @chess.move @player2, 9, 5
        @chess.move @player1, 3, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

    describe "win in vertical", ->
      it "last point in top", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 1, 2
        @chess.move @player2, 9, 3
        @chess.move @player1, 1, 3
        @chess.move @player2, 8, 4
        @chess.move @player1, 1, 4
        @chess.move @player2, 9, 5
        @chess.move @player1, 1, 5 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in bottom", ->
        @chess.move @player1, 1, 5
        @chess.move @player2, 8, 1
        @chess.move @player1, 1, 2
        @chess.move @player2, 9, 3
        @chess.move @player1, 1, 3
        @chess.move @player2, 8, 4
        @chess.move @player1, 1, 4
        @chess.move @player2, 9, 5
        @chess.move @player1, 1, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in middle", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 1, 2
        @chess.move @player2, 9, 3
        @chess.move @player1, 1, 5
        @chess.move @player2, 8, 4
        @chess.move @player1, 1, 4
        @chess.move @player2, 9, 5
        @chess.move @player1, 1, 3 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

    describe "win in left slash", ->
      it "last point in top", ->
        @chess.move @player1, 5, 5
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 2
        @chess.move @player2, 9, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 4
        @chess.move @player2, 9, 5
        @chess.move @player1, 1, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in bottom", ->
        @chess.move @player1, 1, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 2
        @chess.move @player2, 9, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 4
        @chess.move @player2, 9, 5
        @chess.move @player1, 5, 5 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in top", ->
        @chess.move @player1, 5, 5
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 2
        @chess.move @player2, 9, 3
        @chess.move @player1, 1, 1
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 4
        @chess.move @player2, 9, 5
        @chess.move @player1, 3, 3 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

    describe "win in right slash", ->
      it "last point in top", ->
        @chess.move @player1, 1, 5
        @chess.move @player2, 9, 1
        @chess.move @player1, 2, 4
        @chess.move @player2, 9, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 7, 4
        @chess.move @player1, 4, 2
        @chess.move @player2, 8, 5
        @chess.move @player1, 5, 1 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in bottom", ->
        @chess.move @player1, 5, 1
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 4
        @chess.move @player2, 8, 3
        @chess.move @player1, 3, 3
        @chess.move @player2, 9, 4
        @chess.move @player1, 4, 2
        @chess.move @player2, 9, 5
        @chess.move @player1, 1, 5 # player1 win

        expect(@chess.isWin(@player1)).toEqual true

      it "last point in middle", ->
        @chess.move @player1, 1, 5
        @chess.move @player2, 8, 1
        @chess.move @player1, 2, 4
        @chess.move @player2, 8, 3
        @chess.move @player1, 5, 1
        @chess.move @player2, 8, 4
        @chess.move @player1, 4, 2
        @chess.move @player2, 9, 5
        @chess.move @player1, 3, 3 # player1 win

        expect(@chess.isWin(@player1)).toEqual true
