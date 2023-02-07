//백엔드 장비 전역변수들 모음

String.prototype.format = function() {
  var formatted = this;
  for (var arg in arguments) {
      formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }
  return formatted;
};

var BackLocalGlobal = {
    StringSET: null,
    ncount:0
  }
  
  module.exports = BackLocalGlobal;


