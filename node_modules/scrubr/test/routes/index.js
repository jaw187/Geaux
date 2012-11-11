
exports.form = function (req,res) {
  if (req.scrubr && req.scrubr.failures) {
    fail=req.scrubr.failures;
    body=req.body;
  }
  else {
    fail=[];
    body={};
  }
  res.render('form',{ title: 'Scrubr', payload: body, failures: fail });
};

exports.form_success= function (req,res) {
  res.render('form_success',{ title: 'Scrubr', payload: req.body });
};
