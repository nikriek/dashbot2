var WebSocketServer = require("ws").Server
var Dashboard = require('./db').Dashboard;
var User = require('./db').User;
var SlackRtmClient = require('slack-client/lib/clients/rtm/client');
var RTM_EVENTS = require('slack-client/lib/clients/events/rtm').EVENTS;

module.exports = function(server) {
  var wss = new WebSocketServer({server: server})
  console.log("websocket server created")

  wss.on("connection", function(rawSocket) {
    User.findOne({}, function(err, user) {
      var rtm = new SlackRtmClient(user.accessToken, { logLevel: 'debug' });
      rtm.start();
      rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
        console.log('Message:', message);
      });
    });

    rawSocket.on("close", function() {
      console.log("websocket connection close")
    })
  })

  return wss
}
