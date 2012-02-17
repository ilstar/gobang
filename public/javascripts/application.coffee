colour = "#efd"

drawItem = (x, y, colour) ->
  $("td[data-x=#{x}][data-y=#{y}]").attr('bgcolor', colour)

user = window.user
socket = io.connect null

socket.on 'connect', ->
  socket.emit 'register', user_id: user.id
socket.on 'allNews', (data) ->
  drawItem(data.x, data.y, data.colour)
  user.canMove = not user.canMove

socket.on 'register', (data) ->
  # data format: {canMove: true/false}
  user.canMove = data.canMove
socket.on 'disconnect', ->

jQuery ->
  $('td').click ->
    if user.canMove
      $item = $(this)
      x = $item.attr('data-x')
      y = $item.attr('data-y')
      drawItem(x, y, colour)
      socket.emit('move', {x, y})
    else
      alert "you can't move"
