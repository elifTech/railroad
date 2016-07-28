'use strict'

var WebSocketClient = require('websocket').client;
var Promise = require("bluebird");


function JMRIService(ip, commandBuilder) {
  var self = this;

  self.serveIP = ip;
  self.commandBuilder = commandBuilder;

  var server = new WebSocketClient();
  server.on('connect', connectHandler.bind(self));
  server.on('connectFailed', (error) =>
              console.log('Connect Error: ' + error.toString())
            );
  server.connect('ws://' + ip + ':12080/json/');
  this.server = server;
}

var connectHandler = function(connection) {
  var self = this;

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
  self.init();

};


JMRIService.prototype.send = function (message) {
  var self = this;

  console.log('Sent: ' + message);

  return new Promise(function (resolve, reject) {
      if (self.connection.connected) {
        self.connection.sendUTF(message);
        resolve();
      }
    }).delay(1000);
};

JMRIService.prototype.init = function () {
  var self = this;

  self.send(self.commandBuilder.fillTemplate('set_address'));
  self.send(self.commandBuilder.fillTemplate('power'));

  setInterval(self.beat.bind(self), 1000);
};

JMRIService.prototype.stop = function () {
  var self = this;

  self.send(self.commandBuilder.fillTemplate('emergency_stop'));
};

JMRIService.prototype.beat = function () {
  var self = this;

  self.send(self.commandBuilder.fillTemplate('ping'))
}

module.exports = JMRIService;
