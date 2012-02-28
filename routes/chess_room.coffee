Player = require "#{__dirname}/../models/player"
Chess = require "#{__dirname}/../models/chess"

class ChessRoom
  create: (req, res) ->
    roomId = "#{req.session.current_user.id}-#{new Date().getTime()}"
    chesses[roomId] ?= new Chess

    res.redirect "/rooms/#{roomId}"

  show: (req, res) ->
    req.session.current_user ?= new Player
    req.session.current_user.roomId ?= req.params.id

    res.render 'chess', current_user: req.session.current_user
    
module.exports = new ChessRoom
