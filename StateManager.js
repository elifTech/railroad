'use strict'

var _ = require('lodash');

var state0 = {
  speed: 0.0,
  direction: true,
  light: false
}

function StateManager (state0, commandActions) {
  this.state0 = _.cloneDeep(state0);
  this.state = _.cloneDeep(state0);
  this.commandActions = commandActions;
  this.history = [];
}

StateManager.prototype.change = function (command) {
  var oldState = this.state;
  this.history.push(this.state);
  this.state = this.commandActions[command](oldState);

  return diff(oldState, this.state);
};

StateManager.prototype.reset = function () {
  this.state = _.cloneDeep(this.state0);
};


var diff = function(oldObj, newObj) {
  return _(newObj).map(
            function(val, key){
              if (newObj[key] !== oldObj[key]) {
                return key;
              }
              else {
                return 'x';
              }
            }
          )
          .filter(
            function (val) { return val != 'x'}
          ).value();
}

module.exports = StateManager;
