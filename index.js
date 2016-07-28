'use strict'

var Dispatcher = require('./Dispatcher');
var AWSIoTService = require('./AWSIoTService');

var dispatcher = new Dispatcher();
var aws = new AWSIoTService(dispatcher);

aws.init();
