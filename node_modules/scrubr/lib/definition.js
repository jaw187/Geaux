var scrubers = require('./scrubers'),
    tests = require('./tests');

exports.validate = function (def) {
  var badTests=[];
  for (field in def) {
    for (test in def[field]) {
      if (test === "scrub") {
        for (var i = 0; i < def[field].scrub; i++) {
          if (!scrubers[def[field].scrub[i]]) {
            badTests.push(s + " is not a known scruber");
          }
        }
      }
      else if (test !== "required" && !tests.exists(test)) {
        badTests.push(test + " is a bad test for " + field);
      }
    }
  }
  if (badTests.length > 0) {
    return new Error(badTests);
  }
  else return true;
}

