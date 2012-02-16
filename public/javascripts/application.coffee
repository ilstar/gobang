colours = ['#eee', '#abc', '#ebc', '#daf']
colour = colours[parseInt(Math.random(1) * colours.length)]

drawItem = (item, colour) ->
  item.attr('bgcolor', colour)

socket = io.connect null
socket.on 'connect', ->
  socket.send "hi, I'm connect...."
socket.on 'allNews', (data) ->
  drawItem($("##{data.domId}"), data.colour)
socket.on 'disconnect', ->

jQuery ->
  $('td').click ->
    $item = $(this)
    drawItem($item, colour)
    socket.emit('news', {domId: $item.attr('id'), colour: colour})
