var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    http = require('http'),
    https = require('https'),
    ben = require('ben'),
    HttpRTT;

HttpRtt = function (conf) {
  var self = this;
  this.host = conf.host;
  function testHost() {
    function test(done) {
      var client = (conf.ssl && conf.ssl === true)? https:http;
      client.get({ host: self.host }, function (res) {
          ////logic for confirm valid response
          done();
        }).on('error', function (e) {
            reportError(e);
          });
    }
    
    function reportError(e) {
      self.emit('httprtt',e);
    }

    ben.async(1,test,function (ms) {
        self.emit('httprtt',ms);
      }); 
  }

  var loop = setInterval(testHost,conf.interval);
}

util.inherits(HttpRtt,EventEmitter);

module.exports = function (conf) {
  return new HttpRtt(conf);
}
