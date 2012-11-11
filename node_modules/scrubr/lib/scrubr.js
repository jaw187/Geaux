////
/////  new String() isn't a string, it's an Object
/////  I'm not sayin, I'm just sayin...
////
///// 

var util=require('util'),
    compr = require('compr'),
    tests=require('./tests'),
    scrubers=require('./scrubers').scrubers(),
    def=require('./definition'),
    definition = null;

exports.scrub = function() {
  if (arguments.length > 1) {
    var req = arguments[0],
        res = arguments[1],
        next = arguments[2],
        routes = arguments[3],
        payload = req.body;
  }
  else var payload = arguments[0];

  var failures = [],
      field,
      test,
      args;

  if (definition) {
    for (field in definition) {
      if (definition.hasOwnProperty(field)) {
        if (definition[field].scrub && definition[field].scrub.length > 0) {
          for (var i=0;i<definition[field].scrub.length;i++) {
            if (payload && payload[field] && scrubers[definition[field].scrub[i]]) {
              payload[field] = scrubers[definition[field].scrub[i]](payload[field]);
            }
          }
        }
        for (test in definition[field]) {
          if (test !== 'required' && test !== 'scrub') {
            if (definition[field].hasOwnProperty(test)) { 
              if (payload[field]) {
//TODO Case builds args.  One call to tests.run.  failures from tests.getErrorMessage
                switch(test) {
                  case 'is' :
                    if (!tests.run(test,[payload[field],definition[field].is]))
		      failures.push(field + ' is not a valid ' + definition[field].is);
                    break;
                  case 'isIn' :
                    if (!tests.run('isIn',[payload[field],definition[field].isIn,definition[field].caseinsensitive]))
                      failures.push(field + ' is not a valid value');
                    break;
                  case 'isString' :
                    if (!tests.run('isString',[payload[field]]))
                      failures.push(field + ' is not a string');
                    break;
                  case 'inBounds' :
                    if (!tests.run('inBounds',[payload[field],definition[field].inBounds.upper,definition[field].inBounds.lower])) {
                      failures.push(field + ' is not within the bounds of ' + 
                                    definition[field].inBounds.upper + '(upper) and ' + 
                                    definition[field].inBounds.lower);
                    }
                    break;
                  case 'has' :
                    if (!tests.run('has',[payload[field],definition[field].param]))
                      failures.push(field + ' does not contain a ' + definition[field].param);
                    break;
                  default :
                    failures.push("Bad test for: " + field);
                }  
              }  
              else if (definition[field].required) {
                failures.push(field + " is a required field");
              }
            }
          }
        } 
      }
    }

//MIDDLEWARE LOGIC
    if (req && req.body)
      req.body=payload;

    if (failures.length === 0) {
//OK, ALL TESTS PASSED
      this.pass(next);
      return true;
    }
    else {
//FAIL
      this.fail(failures,req,res,next);
      return false;
    }
  }
  else {
    this.fail(['DEFINITION does not exist'],req,res,next);
    return false;
  }
}

exports.middleware = function (routes) {
  return function (req,res,next) {
    if (req.body && !(compr.compare(req.body,{}))) { 
      exports.scrub(req,res,next,routes);
    }
    else next();
  }
}

exports.define = function (userdef) {
  defCheck = def.validate(userdef);
  if (defCheck === true)
    definition = userdef;

  return defCheck;
}


exports.fail = function (failures,req,res,next) {
  console.log("FAIL");
  for (var i=0;i<failures.length;i++) {
    console.log(failures[i]);
  }

  if (next) { //MIDDLEWARE LOGIC
    if (req) {
      //req.url = url.parse(req.header('referer')).path;

      //WANTED TO USE THE REFERER, BUT HOW CAN YOU TRACK THAT.  CHANGING req.url only affects the route which is served.
/////////  so just switch the method to get and pass along details on failures
      req.method = 'GET';
      req.scrubr = { fail: true, failures: failures };
      next();
    }
  }
}

exports.pass = function (next) {
  console.log("PASSSSSSSSS");
  if (next) next();
}
