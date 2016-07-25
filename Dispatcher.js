'use strict'

let state0 = {

}

function Dispatcher() {

}

Dispatcher.prototype.reset = function () {
  this.state = state0;
}

Dispatcher.prototype.put = function (state) {
  this.state = {}
};

module.exports = Dispatcher;



function init() {
    if (connection.connected) {
        connection.sendUTF('{"type":"throttle","data":{"throttle":"3501","address":3501}}');
        connection.sendUTF('{"type":"power","data":{}}');
        setDirection(direction);
        setTimeout(ping, 1000);
        setTimeout(start, 1000);
    }
}

function start() {
  if (connection.connected) {
      connection.sendUTF('{"type":"throttle","data":{"throttle":"3501","speed":"0.5"}}');
      if(direction)
        setTimeout(stop, 9000);
      else
        setTimeout(stop, 9000);
  }

}

function stop() {
  if (connection.connected) {
      connection.sendUTF('{"type":"throttle","data":{"throttle":"3501","speed":"0.0"}}');
      setTimeout(reverse, 1000);
  }
}

function ping() {
  if (connection.connected) {
      connection.sendUTF('{"type":"ping"}');
      setTimeout(ping, 1000);
  }
}

function reverse() {
  direction = !direction;
  console.log(direction);
  setDirection(direction);
  setTimeout(start, 1000);
}

function setDirection(drct) {
  if (connection.connected) {
      connection.sendUTF('{"type":"throttle","data":{"throttle":"3501","forward":' + drct + '}}');
  }
}
