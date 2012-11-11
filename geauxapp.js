/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer()
    ,io = require('socket.io').listen(app);

io.configure(function () {
  io.set('transports',['htmlfile', 'xhr-polling', 'jsonp-polling']);
  io.set('log level', 1);
});

var geaux = require('./geaux');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/ping', routes.pingform);
app.post('/ping', routes.ping);
app.get('/trace', routes.traceform);
app.post('/trace', routes.trace);

app.listen(10700);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


//SOCKET.IO

io.sockets.on('connection',function (socket) {
  var host;
  socket.on('init',function (init) {
    host = geaux.monitor(data);
    host.on('response', function (rtt) {
      socket.emit('response',rtt);
    });

    host.on('drop', function () {
      socket.emit('drop');
    });  

    host.on('trace', function (hops) {
        socket.emit('trace',hops);
      });
  });
});
