'use strict'

let commands = require('./commands');

function CommandBuilder(train) {
  this.train = train;
}


CommandBuilder.fillTemplate = function (str, data){
  return  str.replace(/%\w+%/g, function(tag) {
    return data[tag] || tag;
  });
};
