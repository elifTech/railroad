var awsIot = require('aws-iot-device-sdk');
var config = require('./config');


/*mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown"
    }
  }
}

var networkInterfaces = require( 'os' ).networkInterfaces( );
networkInterface = networkInterfaces['eth0'] || networkInterfaces['wlan0']
mythingstate["state"]["reported"]["ip"] = networkInterface[0]['address'];*/



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

  self.thingShadows.on('message', delta.bind(self))
  self.thingShadows.on('update', delta.bind(self))
};

var delta = function (thingName, stat, clientToken, stateObject) {
  //console.log(this);
  //console.log('delta');
  console.log(thingName);
  console.log(stat);
  console.log(clientToken);
  console.log(stateObject);

  //this.dispatcher.put(stateObject);
}


module.exports = AWSIoTService
