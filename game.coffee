class WuziGame
  constructor: (@webSocket)->
    @io = @webSocket.io
    @startObserving()

  startObserving: ->
    @io.sockets.on 'connection', (socket) =>
      gameSession = new WuziGameSession socket

      socket.on 'move', gameSession.moveListener
      socket.on 'register', gameSession.registerListener
      socket.on 'reset_chess', gameSession.resetListener
      socket.on 'disconnect', gameSession.disconnectListener


class WuziGameSession
  constructor: (@socket)->
    @current_user = @socket.handshake.session.current_user
    @chess = chesses[@current_user.roomId]

  moveListener: (data) =>
    result = @chess.move @current_user, parseInt(data.x), parseInt(data.y)
    if result is 'moved'
      @socket.broadcast.emit 'move', {x: data.x, y: data.y, colour: @current_user.colour, user: 'other'}
      @socket.emit 'move', {x: data.x, y: data.y, colour: @current_user.colour, user: 'me'}
    else if result is 'win'
      @socket.broadcast.emit 'notify', "You lost!"
      @socket.emit 'notify', "Congratulations, you win!"

  registerListener: (data) =>
    @chess.join @current_user
    # when the second player join, send a sign to first player to tell him can start.
    if @chess.isFull()
      @socket.broadcast.emit 'register', canMove: true

  resetListener: =>
    if @chess.isWinner(@current_user)
      @chess.reset()
      @socket.broadcast.emit 'reset_chess'
      @socket.emit 'reset_chess', 'start'

  disconnectListener: =>
    @socket.on 'disconnect', ->
      console.log 'a client disconnected...'

module.exports = { WuziGame, WuziGameSession }
