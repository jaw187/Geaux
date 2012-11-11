
/*
 * GET home page.
 */

var mongo=require('./mongodb-wrapper'),
    db = mongo.db('10.7.0.7',27017,'geaux');
db.collection("pings");


exports.index = function(req, res){
  db.pings.distinct("who", function (err,hosts) { 
    if (!err) res.render('index', { 'hosts' : hosts });
  });
};

exports.pingform = function(req, res){
  res.render('pingform');
};

exports.ping = function (req,res) {
  res.render('ping', { 'host' : req.body.host });
};

exports.traceform = function(req,res) {
  res.render('traceform');
};

exports.trace = function (req,res) {
  res.render('trace', { 'host' : req.body.host });
}

exports.httprttform = function (req,res) {
  res.render('httprttform');
}

exports.httprtt = function (req,res) {
  res.render('httprtt', { 'url' : req.body.url });
}

exports.portform = function (req,res) {
  res.render('portform');
}

exports.port = function (req,res) {
  res.render('port', { 'host' : req.body.host, 'port' : req.body.port });
}
