var WebSocketServer = require("ws").Server
var Dashboard = require('./db').Dashboard;
var User = require('./db').User;
var SlackRtmClient = require('slack-client/lib/clients/rtm/client');
var RTM_EVENTS = require('slack-client/lib/clients/events/rtm').EVENTS;

module.exports = function(server) {
  var wss = new WebSocketServer({server: server});
  console.log("websocket server created");
  var rtm = new SlackRtmClient('xoxb-37206040724-wkMoGqvYabweh384xRYeeHiy');
  rtm.start();

  rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {

    if (message.bot_id == 'B137AQPPY') {
      var text = message.attachments[0].fallback;

      var payload = JSON.stringify({
          type: 'github',
          data: {
              content: text
          },
          col:'1',
          row:'1',
          sizex:'1',
          sizey:'1'
      });

      wss.clients.forEach(function(client) {
          client.send(payload);
      });
    }
  });

  wss.on("connection", function(rawSocket) {

    rawSocket.on("close", function() {
      console.log("websocket connection close")
    })
  })

  return wss
}
