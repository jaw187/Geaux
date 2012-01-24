var EventEmitter = require('events').EventEmitter,
    util = require('util');

Host = function (host) {
  var PingManager = require('./node-ping').PingManager;
  var pm = new PingManager();

  this.host = host;
  var self = this;
  pm.start(function () {
    var pinger = this.createOnePinger(1000,[host]);
    pinger.on('ping', function (mo) {
      if (mo.rcv > 0) {
        if (typeof mo.avg === "undefined") {
          if (typeof mo.max === "undefined")
            rtt = mo.min;
          else rtt = mo.max;
        }
        else rtt = mo.avg

        if (rtt) self.emit('response',rtt);
        else console.log("asdf");
      }
      else self.emit('drop');
    });
    pinger.start();
  });
}

util.inherits(Host,EventEmitter);

exports.Host = function (host) {
  return new Host(host);
}

