var geaux = require('./geaux');

var data='4.2.2.2';

var host = geaux.Host(data);

host.on('response', function (rtt) {
  console.log(rtt);
})
