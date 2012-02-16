colours = ['#eee', '#abc', '#ebc', '#daf']
colour = colours[parseInt(Math.random(1) * colours.length)]

drawItem = (item, colour) ->
  item.attr('bgcolor', colour)

user = window.user
socket = io.connect null

socket.on 'connect', ->
  socket.emit 'register', user_id: user.id
socket.on 'allNews', (data) ->
  console.log data
  drawItem($("##{data.domId}"), data.colour)
  user.flag = data.count % 2 is (user.id - 1)

socket.on 'register', (data) ->
  # data format: {flag: true/false}
  user.flag = data.flag
socket.on 'disconnect', ->

jQuery ->
  $('td').click ->
    if user.flag
      $item = $(this)
      drawItem($item, colour)
      socket.emit('move', {domId: $item.attr('id'), colour: colour})
      user.flag = false
    else
      alert "you can't move"
