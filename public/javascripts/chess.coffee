class GameClient
  constructor: (@user)->
    @socket = io.connect null

  start: ->
    @socket.on 'connect', @connectListener
    @socket.on 'move', @moveListener
    @socket.on 'reset_chess', @resetChessListener
    @socket.on 'notify', @notificationListener
    @socket.on 'win', @winListener
    @socket.on 'lost', @lostListener
    @socket.on 'register', @registerListener

  move: (x, y) ->
    if @placeIsTaken(x, y)
      alert "you can't move here, the place was be taken!"
    else
      @socket.emit 'move', {x, y}

  reset: ->
    @socket.emit 'reset_chess'

  drawItem: (x, y, colour) ->
    $("td[data-x=#{x}][data-y=#{y}]").attr('bgcolor', colour)

  resetChessRoom: ->
    $('td[bgcolor]').removeAttr 'bgcolor'

  placeIsTaken: (x, y) ->
    $("td[data-x=#{x}][data-y=#{y}]").attr('bgcolor')?

  ###### Listeners #######

  connectListener: =>
    @socket.emit 'register'

  moveListener: (data) =>
    @drawItem(data.x, data.y, data.colour)
    @user.canMove = data.user isnt 'me'

  resetChessListener: (data) =>
    @resetChessRoom()
    if data is 'start'
      @user.canMove = true

  winListener: () ->
    alert "Congratulations, you become the winner!"
    $('#reset_chess').show()

  lostListener: () ->
    alert "Oh so bad, you lost!"

  notificationListener: (data) ->
    alert data

  registerListener: (data) =>
    # data format: {canMove: true/false}
    @user.canMove = data.canMove

user = {}
game = new GameClient(user)
game.start()

jQuery ->
  $('td').click ->
    if user.canMove
      $item = $(this)
      x = $item.data('x')
      y = $item.data('y')
      game.move(x, y)
    else
      alert "you can't move"

  $('#reset_chess').click ->
    game.reset()
    $(this).hide()
