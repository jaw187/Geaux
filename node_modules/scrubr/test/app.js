
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

var scrubr = require('../index');
    scrubr.define({
      username: { is: 'username', required: ['/form']},
      attack: { isString: true, scrub: ['SQL','HTML']} 
    });

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(scrubr.middleware());
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

app.get('/form',routes.form);
app.post('/form',routes.form_success);

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
