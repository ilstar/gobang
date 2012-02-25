Player = require "#{__dirname}/../models/player"

class Home
  index: (req, res) ->
    req.session.current_user ?= new Player
    res.render 'index'

module.exports = new Home
