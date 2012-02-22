class Chess
  constructor: ->
    @players = []
    @chess = {}

  join: (player) ->
    if @canJoin()
      if @players.length is 0 then @player1 = player else @player2 = player
      @players = @players.concat player
      @chess[player] = []

  move: (player, x, y) ->
    return if not @canMove(player)
    @chess[player] = @chess[player].concat {x, y}

  nextMovePlayer: ->
    throw "no player" if @players.length is 0
    @player1 if @players.length is 1
    if @canMove(@player1) then @player1 else @player2
  canJoin: ->
    @players.length isnt 2
  canMove: (player) ->
    switch @players.length
      when 0
        throw "no player"
      when 1
        @player1
      else
        if player is @player1
          @chess[@player1].length is @chess[@player2].length
        else if player is @player2
          @chess[@player1].length is (@chess[@player2].length + 1)
        else
          throw "exception"
  anotherPlayer: (player) ->
    throw "Players.length is not 2" if @players.length < 2
    if @players[0] is player then @players[1] else @players[0]
  isWin: (player) ->
    chess = @chess[player]
    lastChess = chess[chess.length - 1]

    # check horizontal
    horizontalChessX = []
    xs = [(lastChess.x - 4)..(lastChess.x + 4)]
    for c in chess when c.y is lastChess.y
      index = xs.indexOf c.x
      xs.splice index, 1
    return true if xs[0] is lastChess.x + 1 # first five
    return true if xs[xs.length - 1] is lastChess.x - 1 # last five
    for i in [1..xs.length - 1]
      return true if xs[i] - xs[i - 1] is 6

    # check vertical
    verticalChessX = []
    ys = [(lastChess.y - 4)..(lastChess.y + 4)]
    for c in chess when c.x is lastChess.x
      index = ys.indexOf c.y
      ys.splice index, 1
    return true if ys[0] is lastChess.y + 1 # top five
    return true if ys[ys.length - 1] is lastChess.y - 1 # bottom five
    for i in [1..ys.length - 1]
      return true if ys[i] - ys[i - 1] is 6

    # check left slash
    leftSlash = [
      {x: lastChess.x - 4, y: lastChess.y - 4},
      {x: lastChess.x - 3, y: lastChess.y - 3},
      {x: lastChess.x - 2, y: lastChess.y - 2},
      {x: lastChess.x - 1, y: lastChess.y - 1},
      {x: lastChess.x, y: lastChess.y},
      {x: lastChess.x + 1, y: lastChess.y + 1},
      {x: lastChess.x + 2, y: lastChess.y + 2},
      {x: lastChess.x + 3, y: lastChess.y + 3},
      {x: lastChess.x + 4, y: lastChess.y + 4},
    ]

    for c in chess
      for i in [0..leftSlash.length - 1]
        s = leftSlash[i]
        if c.x is s.x and c.y is s.y
          leftSlash.splice i, 1
          break
    return true if leftSlash[0].x is lastChess.x + 1 and leftSlash[0].y is lastChess.y + 1
    return true if leftSlash[leftSlash.length - 1].x is lastChess.x - 1 and leftSlash[leftSlash.length - 1].y is lastChess.y - 1
    for i in [1..leftSlash.length - 1]
      return true if leftSlash[i].x - leftSlash[i - 1].x is 6 and leftSlash[i].y - leftSlash[i - 1].y is 6

    # check right slash
    rightSlash = [
      {x: lastChess.x - 4, y: lastChess.y + 4},
      {x: lastChess.x - 3, y: lastChess.y + 3},
      {x: lastChess.x - 2, y: lastChess.y + 2},
      {x: lastChess.x - 1, y: lastChess.y + 1},
      {x: lastChess.x, y: lastChess.y},
      {x: lastChess.x + 1, y: lastChess.y - 1},
      {x: lastChess.x + 2, y: lastChess.y - 2},
      {x: lastChess.x + 3, y: lastChess.y - 3},
      {x: lastChess.x + 4, y: lastChess.y - 4},
    ]

    for c in chess
      for i in [0..rightSlash.length - 1]
        s = rightSlash[i]
        if c.x is s.x and c.y is s.y
          rightSlash.splice i, 1
          break
    return true if rightSlash[0].x is lastChess.x + 1 and rightSlash[0].y is lastChess.y - 1
    return true if rightSlash[rightSlash.length - 1].x is lastChess.x - 1 and rightSlash[rightSlash.length - 1].y is lastChess.y + 1
    for i in [1..rightSlash.length - 1]
      return true if rightSlash[i].x - rightSlash[i - 1].x is 6 and rightSlash[i].y - rightSlash[i - 1].y is -6

module.exports = Chess
