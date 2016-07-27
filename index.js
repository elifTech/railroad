'use strict'

var Dispatcher = require('./Dispatcher');
var AWSIoTService = require('./AWSIoTService');

let dispatcher = new Dispatcher();
let aws = new AWSIoTService(dispatcher);

aws.init();
