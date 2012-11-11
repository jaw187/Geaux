var SQL_SINGLE_QUOTE_REPLACEMENT = '&#146;';

exports.scrubers = function () {
  return {
    'SQL' : function (val) {
      if (val.replace) {
        val = val.replace(/'/g,SQL_SINGLE_QUOTE_REPLACEMENT);
        return val; 
      }
      else {
        //ERROR
      
      }
    },
    'HTML' : function (val) {
      if (typeof val === "string") {
        // Google Caja's HTML Sanitizer
        // https://github.com/theSmaw/Caja-HTML-Sanitizer
        return require('sanitizer').sanitize(val);
      }
      else {
        //ERROR
      }
    }
  };
};
