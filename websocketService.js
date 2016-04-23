var WebSocketServer = require("ws").Server

module.exports = function(server) {
  var wss = new WebSocketServer({server: server})
  console.log("websocket server created")

  wss.on("connection", function(rawSocket) {
    rawSocket.on("close", function() {
      console.log("websocket connection close")
    })
  })

  return wss
}
