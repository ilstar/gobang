count = 0

class Player
  constructor: ->
    @id = ++count
    @name = "Player #{count}"

module.exports = Player
