var traceroute = require('traceroute');

function trace() {
  traceroute.trace('google.com', function (err,hops) {
      console.log(hops);
    });
}

setInterval(trace,1000);

