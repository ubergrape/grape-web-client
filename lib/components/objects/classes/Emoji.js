'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var tokenType = 'emoji';

var Emoji = (function () {
  function Emoji(options) {
    _classCallCheck(this, Emoji);

    this.tokenType = tokenType;
    this.shortname = options.shortname;
    this.content = options.shortname;
    this.str = this.toString();
  }

  Emoji.prototype.toString = function toString() {
    return this.shortname;
  };

  return Emoji;
})();

exports['default'] = Emoji;
module.exports = exports['default'];