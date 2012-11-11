Scrubr
======
Because we can never trust data a client sends to us.

Scrubr contains a set of utilities to parse a payload against a definition.  It can be used on it's own or it can be used as middleware for Connect.

When used as Middleware for Connect or Express, Scrubr can be run against all data in req.body.  Define data once and then write logic in templates which display form data.  See Middleware Example below.

Install
-------
```
$ npm install scrubr
```

Example
-------

```javascript
scrubr = require('scrubr')

definition = {
  username: { is: 'username', required: true, scrub:['sql'] },
  password: { is: 'password', required: true },
  state: { isIn: [ 'NJ', 'CA' ] },
  comment: { isString: true, scrub: ['html','sql'] },
  age : { inBounds: { upper: 10, lower: 5 } }
}

body = {
  username : 'james',
  password : 'HHHHjjjj1111',
  state : 'NJ',
  comment : 'a',
  age : 6
}

scrubr.define(definition);

scrubr.scrub(body);
//// PASSSSSSS

body.age=22;
scrubr.scrub(body);
//// FAIL
// age is not within the bounds of 10(upper) and 5
```

Middleware
----------
### Assumptions
  - Forms use the same path.  GET is used to display the form and POST is used to parse the form.

### Example
```javascript
var scrubr = require('scrubr');
    scrubr.define({
      username: { is: 'username', required: ['/form']},
      attack: { isString: true, scrub: ['SQL','HTML']}
    });

//////// NOTE THAT REQUIRED CAN BE AN ARRAY OF PATHS WHERE THIS FIELD IS REQUIRED

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(scrubr.middleware());
  ....
  });

app.get('/form',routes.form);
app.post('/form',routes.form_success);
```

In routes/index.js

```javascript
exports.form = function (req,res) {
  if (req.scrubr && req.scrubr.failures) {
    fail=req.scrubr.failures;
    body=req.body;
  }
  else {
    fail=false;
    req.body=false;
  }
  res.render('form',{ title: 'Scrubr', body: req.body, failures: fail });
};

exports.form_success= function (req,res) {
  res.render('form_success',{ title: 'Scrubr', body: req.body });
};
```

Later on....in form.jade

```
h1= title
p Welcome to #{title}
-if (failures)
  #failures
    h2 Failures
    ul
      -failures.forEach(function (failure) {
        li.failure=failure
      -})

form(method='post', action='/form')
  #username
    span Username
    -if (body.username)
      input(type='text', name='username')=body.username
    -else
      input(type='text', name='username')

  #attackstring
    span Attack String
    -if (payload.attack)
      input(type='text', name='attack', value='#{payload.attack}')
    -else
      input(type='text,', name='attack')

  #btn
    input(type='submit')
```

