g=require('./geaux');
a=g.monitor({which: 'trace', interval: 1000, host: 'google.com'});
a.on('trace', function (hops) { console.log(hops)});
