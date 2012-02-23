count = 0
colours = ['#eee', '#abc', '#ebc', '#daf']

class Player
  constructor: ->
    @id = ++count
    @name = "Player #{count}"
    @colour = colours[parseInt(Math.random(1) * colours.length)]

module.exports = Player
