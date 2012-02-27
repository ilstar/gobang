colour = "#efd"

drawItem = (x, y, colour) ->
  $("td[data-x=#{x}][data-y=#{y}]").attr('bgcolor', colour)

resetChessRoom = ->
  $('td[bgcolor]').removeAttr 'bgcolor'

user = window.user
socket = io.connect null

socket.on 'connect', ->
  socket.emit 'register'

socket.on 'allNews', (data) ->
  drawItem(data.x, data.y, data.colour)
  user.canMove = true

socket.on 'reset_chess', (data) ->
  resetChessRoom()
  if data is 'start'
    user.canMove = true

socket.on 'win', (data) ->
  if data.user is 'you'
    alert 'you win'
  else
    alert 'so bad, he win!'

socket.on 'register', (data) ->
  # data format: {canMove: true/false}
  user.canMove = data.canMove

jQuery ->
  $('td').click ->
    if user.canMove
      $item = $(this)
      x = $item.attr('data-x')
      y = $item.attr('data-y')
      drawItem(x, y, colour)
      user.canMove = false
      socket.emit('move', {x, y})
      user.canMove = false
    else
      alert "you can't move"

  $('#reset_chess').click ->
    socket.emit('reset_chess')
