drawItem = (x, y, colour) ->
  $("td[data-x=#{x}][data-y=#{y}]").attr('bgcolor', colour)

resetChessRoom = ->
  $('td[bgcolor]').removeAttr 'bgcolor'

user = {}

class GameClient
  constructor: ()->
    @socket = io.connect null

  start: ->
    @socket.on 'connect', @connectListener
    @socket.on 'allNews', @allNewsListener
    @socket.on 'reset_chess', @resetChessListener
    @socket.on 'win', @winListener
    @socket.on 'register', @registerListener

  connectListener: =>
    @socket.emit 'register'

  allNewsListener: (data) ->
    drawItem(data.x, data.y, data.colour)
    user.canMove = data.user isnt 'me'

  resetChessListener: (data) ->
    resetChessRoom()
    if data is 'start'
      user.canMove = true

  winListener: (data) ->
    if data.user is 'you'
      alert 'you win'
    else
      alert 'so bad, he win!'

  registerListener: (data) ->
    # data format: {canMove: true/false}
    user.canMove = data.canMove

game = new GameClient
game.start()

jQuery ->
  $('td').click ->
    if user.canMove
      $item = $(this)
      x = $item.data('x')
      y = $item.data('y')
      game.socket.emit('move', {x, y})
    else
      alert "you can't move"

  $('#reset_chess').click ->
    game.socket.emit('reset_chess')
