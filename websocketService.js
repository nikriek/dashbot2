var WebSocketServer = require("ws").Server
var Dashboard = require('./db').Dashboard;
var User = require('./db').User;
var SlackRtmClient = require('slack-client/lib/clients/rtm/client');
var RTM_EVENTS = require('slack-client/lib/clients/events/rtm').EVENTS;

module.exports = function(server) {
  var wss = new WebSocketServer({server: server});

  wss.on("connection", function(rawSocket) {

    rawSocket.on("close", function() {
      console.log("websocket connection close")
    })
  })

  return wss
}
