'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _emoji = require('../emoji');

var Emoji = (function () {
  function Emoji(options) {
    _classCallCheck(this, Emoji);

    this.shortname = options.shortname;
  }

  Emoji.prototype.toHTML = function toHTML() {
    return _emoji.replace(this.shortname);
  };

  Emoji.prototype.toString = function toString() {
    return this.shortname;
  };

  return Emoji;
})();

exports['default'] = Emoji;
module.exports = exports['default'];