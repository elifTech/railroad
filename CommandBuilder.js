'use strict'

var commands = require('./commands');

function CommandBuilder(train) {
  this.train = train;
}


CommandBuilder.prototype.fillTemplate = function (command, data){
  data = data || {};
  data['id'] = this.train;
  return  commands[command].replace(/%\w+%/g, function(tag) {
    return data[tag.toLowerCase().replace(/%/g,'')].toString() || tag;
  });
};

module.exports = CommandBuilder;
