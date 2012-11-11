var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    Trace;

Trace = function (conf) {
  var self = this;
  this.host = conf.host;
  function trace() {
    var traceroute = require('traceroute');
    traceroute.trace(conf.host, function (err,hops) {
        if (!err) {
          self.emit('trace',hops);
        }
      });
  }
  setInterval(trace,conf.interval);
}

util.inherits(Trace,EventEmitter);

module.exports = function (conf) {
  return new Trace(conf);
}
