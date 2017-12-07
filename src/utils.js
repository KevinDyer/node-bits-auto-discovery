(() => {
  'use strict';

  function isNonEmptyString(str) {
    return 'string' === typeof(str) && 0 < str.length;
  }

  module.exports.isNonEmptyString = isNonEmptyString;
})();
