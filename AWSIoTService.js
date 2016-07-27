var awsIot = require('aws-iot-device-sdk');
var config = require('./config');


function AWSIoTService(dispatcher) {
  this.dispatcher = dispatcher;
}

AWSIoTService.prototype.init = function () {
  var self = this;

  self.thingShadows = awsIot.thingShadow(config['aws-iot']);
  self.thingShadows.on('connect', function() {
    console.log("Connected...");
    console.log("Registering...");
    self.thingShadows.register(config.device);
  });

  self.thingShadows.on('foreignStateChange', delta.bind(self));

  self.dispatcher.setUpdateCallback(self.update.bind(self));
};

AWSIoTService.prototype.update = function (state) {
  var self = this;

  self.thingShadows.update(config.device, {'state': {'reported': state}})
};

var delta = function (thingName, operation, stateObject) {
  this.dispatcher.put(stateObject.state.desired);
}


module.exports = AWSIoTService
