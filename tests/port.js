var net = require('net');

var client = net.connect(81, 'google.com', function () { console.log('connect'); })
  .on('error', function () { console.log('err'); })
  .on('timeout', function () { console.log('timeout');});
  client.setTimeout(1000);
  

var udp = require('dgram');
var udpclient = udp.createSocket("udp4", function (msg,rinfo) {
  console.log(msg + " ----- " + rinfo.address + ":" + rinfo.port);
  });
var message = new Buffer(" asdf ");
udpclient.on("message", function (msg, rinfo) {
  console.log(msg + " -- " + rinfo.address + ":" + rinfo.port);
});
udpclient.on("error", function (e) {
    console.log("ASDFFFFFF");
  });
udpclient.on("close", function () {
    console.log("ASDF");
  });
udpclient.bind();

udpclient.send(message, 0,message.length, 1234, '0.0.0.0', function (err,bytes) {
  }); 
udpclient.send(message, 0,message.length, 11234, '0.0.0.0');
udpclient.send(message, 0,message.length, 11234, '0.0.0.0');
