exports.expressions = function() {
  return {
    'username' : /^[A-z][A-Za-z0-9]{4,14}$/i,
    'password' : /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    'email' : /\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i,
    'phone' : /^[0-9\-\+\s\.\(\)]{5,16}$/,
    'address' : /^[A-z0-9\-\+\s\.,]+$/,
    'url' : /^((http|https|ftp):\/\/)?([A-z0-9\-]\.)*[A-z0-9\-]+\.[A-z0-9]{2,4}[A-z0-9\/+=%&_\.~?\-]*$/,
    'twitter' : /(@)?[A-z0-9_]+/,
    'facebook' : /^[A-z0-9\.]{5,}$/
  }
}

