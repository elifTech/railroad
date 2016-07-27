'use strict'

var _ = require('lodash');

module.exports = {
  'move_forward': function move_forward(state) {
    let newState = _.cloneDeep(state);

    newState.direction = true;
    if(state.speed <= 0.0 || state.direction !== newState.direction){
      newState.speed = 0.1;
    }

    return newState;
  },
  'move_backward': function move_backward(state) {
    let newState = _.cloneDeep(state);

    newState.direction = false;
    if(state.speed <= 0.0 || state.direction !== newState.direction){
      newState.speed = 0.1;
    }

    return newState;
  },
  'speed_up': function speed_up(state) {
    let newState = _.cloneDeep(state);

    if(state.speed < 1.0) {
      newState.speed = state.speed + 0.1;
    }

    return newState;
  },
  'speed_down': function speed_up(state) {
    let newState = _.cloneDeep(state);

    if(state.speed > 0.0) {
      newState.speed = state.speed - 0.1;
    }

    return newState;
  },
  'lights_on': function lights_on(state) {
    let newState = _.cloneDeep(state);
    newState.lights = true;
    return newState;
  },
  'lights_off': function lights_off(state) {
    let newState = _.cloneDeep(state);
    newState.lights = false;
    return newState;
  },
  'stop': function stop(state) {
    let newState = _.cloneDeep(state);
    newState.speed = 0.0;
    return newState;
  }
}
