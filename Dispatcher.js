'use strict'

var _ = require('lodash');
var Queue = require('bee-queue');
var StateManager = require('./StateManager');
var CommandBuilder = require('./CommandBuilder');
var JMRIService = require('./JMRIService');
var Promise = require("bluebird");

var config = require('./config');
var tca = require('./trainCommandActions');

function Dispatcher() {
  let self = this;

  self.commandBuilder = new CommandBuilder(config.train)
  self.JMRI = new JMRIService(config.JMRI_IP, self.commandBuilder)

  self.trainState = new StateManager(config.state0.train, tca);
  self.commandQueue = new Queue('command');

  self.commandQueue.process(function(job, done){
    console.log('JOB');
    console.log(job);
    let stateDiff = processCommand.bind(self)(job.data);

    Promise.map(stateDiff, function(feature) {
        let message = self.commandBuilder.fillTemplate(feature, self.trainState.state);
        return self.JMRI.send(message);
      }, {concurrency: 1}).then(function() {
        return self.awsUpdate(self.trainState.state);
      }).then(done);
  });

  self.commandQueue.on('succeeded', function (job, result) {
  console.log('Job ' + job.id + ' succeeded with result: ' + result);
});
}

Dispatcher.prototype.put = function (state) {

  this.commandQueue
    .createJob(state)
    .timeout(1000)
    .save();
}

Dispatcher.prototype.setUpdateCallback = function (callback) {
  this.awsUpdate = callback;
};

var processCommand = function (aws_state) {
  return this.trainState.change(aws_state.command);
}

module.exports = Dispatcher;
