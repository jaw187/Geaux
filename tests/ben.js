var ben = require('ben');

var http = require('http');

function testFn(done) {
  http.get({host: 'google.com'}, function (res) { done(); }).on('error', function (e) { console.log('asdf'); done(); });
  
}
ben.async(10, testFn, function (ms) {
    console.log(ms);
  }) ;
