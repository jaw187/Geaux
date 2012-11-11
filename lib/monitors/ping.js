var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    Ping;

Ping = function (conf) {
  var PingManager = require('node-ping').PingManager;
  var pm = new PingManager();

  this.host = conf.host;
  this.which = conf.which;

  var self = this;
  
  pm.start(function () {
    var pinger = this.createOnePinger(conf.interval,[conf.host]);
    pinger.on('ping', function (mo) {
      if (mo.rcv > 0) {
        if (typeof mo.avg === "undefined") {
          if (typeof mo.max === "undefined")
            rtt = mo.min;
          else rtt = mo.max;
        }
        else rtt = mo.avg

        if (rtt) self.emit('response',rtt);
        else {
          //UNREACHABLE
          self.emit('unreachable');
        }
      }
      else self.emit('drop');
    });
    pinger.start();
  });
}

util.inherits(Ping,EventEmitter);

module.exports = function (conf) {
  return new Ping(conf);
}
