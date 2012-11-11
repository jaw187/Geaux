
/*
 * GET home page.
 */

exports.graph = function(req, res){
  res.render('graph', { 'host' : req.param.host });
};
