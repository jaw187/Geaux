var PingManager = require('./node-ping').PingManager;
pm=new PingManager();

var mongo=require('./mongodb-wrapper');
var db = mongo.db('10.7.0.7',27017,'geaux');
db.collection("pings");

Host = function (host) {
  this.host=host;
  var that=this;
  pm.start(function () {
    var pinger = this.createOnePinger(1000,[host]);
    pinger.on('ping', function (mo) {
      if (mo.rcv > 0) {
        that.up(mo.avg);
      }
      else that.down();
    });
    pinger.start();
  });
}

Host.prototype.up = function (rtt) {
  //console.log(this.host + ' - ' + rtt);
  db.pings.save({
    who: this.host,
    when: new Date(),
    rtt: rtt,
    up: true
  });
}

Host.prototype.down = function () {
  //console.log(this.host + ' is down');
  db.pings.save({
    who: this.host,
    when: new Date(),
    rtt: -1,
    up: false
  });
}

test=new Host('216.182.1.1');
two=new Host('core1.tdc.nwt.tellurian.net');
three=new Host('core1.tdc.los.tellurian.net');
four=new Host('8.8.8.8');
five=new Host('4.2.2.2');
