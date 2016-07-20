var awsIot = require('aws-iot-device-sdk');

var myThingName = 'Railroad';

var thingShadows = awsIot.thingShadow({
   keyPath: './aws/certs/a20f8fc35b-private.pem.key',
  certPath: './aws/certs/a20f8fc35b-certificate.pem.crt',
    caPath: './aws/certs/rootCA.pem',
  clientId: myThingName,
    region: 'us-west-2'
});

mythingstate = {
  "state": {
    "reported": {
      "ip": "unknown",
      "last_command": "unknown"
    }
  }
}

var networkInterfaces = require( 'os' ).networkInterfaces( );
networkInterface = networkInterfaces['eth0'] || networkInterfaces['wlan0']
mythingstate["state"]["reported"]["ip"] = networkInterface[0]['address'];

thingShadows.on('connect', function() {
  console.log("Connected...");
  console.log("Registering...");
  thingShadows.register( myThingName );

  // An update right away causes a timeout error, so we wait about 2 seconds
  setTimeout( function() {
    console.log("Updating my IP address...");
    clientTokenIP = thingShadows.update(myThingName, mythingstate);
    console.log("Update:" + clientTokenIP);
  }, 2500 );
  
  setTimeout( function() {
    console.log("Updating my IP address...");
    clientTokenIP = thingShadows.update(myThingName, mythingstate);
    console.log("Update:" + clientTokenIP);
  }, 4500 );


  // Code below just logs messages for info/debugging
  thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
		console.log('status');
       /*console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));*/
    });

  thingShadows.on('update',
      function(thingName, stateObject) {
		  console.log('update');
         /*console.log('received update '+' on '+thingName+': '+
                     JSON.stringify(stateObject));*/
      });

  thingShadows.on('delta',
      function(thingName, stateObject) {
		  console.log('delta');
          console.log('received delta '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('timeout',
      function(thingName, clientToken) {
         console.log('received timeout for '+ clientToken)
      });

  thingShadows
    .on('close', function() {
      console.log('close');
    });
  thingShadows
    .on('reconnect', function() {
      console.log('reconnect');
    });
  thingShadows
    .on('offline', function() {
      console.log('offline');
    });
  thingShadows
    .on('error', function(error) {
      console.log('error', error);
    });

});
