var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    monitors = require('./monitors');

exports.monitor = function (init) {
  switch (init.which) {
  case 'ping':
    return new monitors.ping(init);
    break;
  case 'trace':
    return new monitors.trace(init);
    break;
  case 'httprtt' :
    return new monitors.httprtt(init);
    break;
  }

  return null;
}
