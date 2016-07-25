'use strict'

var WebSocketClient = require('websocket').client;


function JMRIService(ip) {
  let self = this

  self.serveIP = ip

  let server = new WebSocketClient();
  server.on('connect', connectHandler.bind(self));
  server.on('connectFailed', (error) =>
              console.log('Connect Error: ' + error.toString())
            );
  server.connect('ws://' + ip + ':12080/json/');
  this.server = server;
}

var connectHandler = function(connection) {
  let self = this;

  connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
      console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log("Received: '" + message.utf8Data + "'");
      }
  });

  self.connection = connection;
};


JMRIService.prototype.send = function (message) {
  var self = this;

  if (connection.connected) {
    connection.sendUTF(JSON.stringify(message))
  }
};
