////  All strings are trimmed of white space
//
//    If you write a test, you need to write a method for the DEFINITION 
///   which constructs the parameters passed to test.
////
///   This method will call exports.run(which,arguments).

var util=require('util'),
    compr=require('compr'),
    EXPRESSIONS=require('./exprson').expressions();
    ERRMSGS = {},
    TESTS=null;

TESTS = {
  'has' : function (value,param) {
    if (typeof value === 'Object')
      if (value[param] || value[param] === false || value[param] === null)
        return true;

    return false;
  },

  'is' : function (value,expression) {
    if (typeof value === 'string') {
      if (EXPRESSIONS[expression] && util.isRegExp(EXPRESSIONS[expression])) {
        value = value.trim();
        return (EXPRESSIONS[expression].test(value));
      }
    }

    return false;
  },

  'isIn' : function (value,list,caseinsensitive) {
    if (typeof value.trim === "function") value=value.trim();

    for (var i=0;i<list.length;i++) {
      if (compr.compare(list[i],value))
        return true;
      if (caseinsensitive && typeof list[i] === 'string' && typeof value === 'string') {
        if (value.toUpperCase() === list[i].toUpperCase()) 
          return true
      }
    }
    return false;
  },

  'isString' : function (value) {
    return typeof value === 'string';
  },

  'isArray' : function (value) {
    return util.isArray(value);
  },

  'isDate' : function (value) {
    return util.isDate(value);
  },

 'inBounds' : function (value,upperBound,lowerBound) {
    if (typeof value === typeof upperBound && typeof upperBound === typeof lowerBound && typeof lowerBound === 'number')
      return (lowerBound <= value && value <= upperBound);

    return false;
  },
  _addTest : function (name,test,errmsg) {
    if (typeof name === "string" && typeof test === 'function') {
      if (!TESTS[name]) {
        TESTS[name]=test;
        ERRMSGS[name]=errmsg;
        return true;
      }
      else return new Error("Test exists");
    }
    else return new Error("Invalid Name or Test");
  },
  _deleteTest : function (name) {
    if (typeof name === "string") {
      if (TESTS[name]) {
        TESTS[name]=null;
        ERRMSGS[name]=null;
        return true;
      }
      else return new Error("Test does not exsit");
    }
    else return new Error("Bad test name");
  },
  _redefineTest : function (name,test,errmsg) {
    var d = this._deleteTest(name);
    if (d === true) {
      return this._addTest(name);
    }
    return d;
  }
};

exports.exists = function (name) {
  if (TESTS[name]) return true;
  else return false;
}

exports.addTest = function (name,test,errmsg) {
  return TESTS._addTest(name,test,errmsg);
}
exports.deleteTest = function (name) {
  return TESTS._deleteTest(name);
}
exports.run = function (which,args) {
  if (args && args.length > 0) 
    return TESTS[which].apply(args[0],args);

  return false; //EVERY TEST REQUIRES INPUT
}
exports.getErrorMessage = function (which) {
  if (typeof which === "string") {
    if (ERRMSG[which]) return ERRMSG[which];
    else return false;
  }
  
  return false;
}
