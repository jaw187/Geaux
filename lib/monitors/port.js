var tcp = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function TcpPortCheck(conf) {
  var self = this;

  function check() {
    try {
      var client = tcp.connect(conf.port, conf.host, function () {
          self.emit('open');
        })
      .on('error', function () { self.emit('closed'); })
      .on('timeout', function () { self.emit('closed'); });

      client.setTimeout(1000);
    }
    catch (e) {
      self.emit('closed');
    }
  }

  var loop = setInterval(check, conf.interval);
}

util.inherits(TcpPortCheck, EventEmitter);

module.exports = function (conf) {
  if (conf.protocol === 'tcp')
    return new TcpPortCheck(conf);
}
