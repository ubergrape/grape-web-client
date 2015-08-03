'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _parse = require('./parse');

/**
 * A simplified model for query object.
 * Its designed to get notified if query has changed.
 */

var _parse2 = _interopRequireDefault(_parse);

var Model = (function () {
  function Model(options) {
    _classCallCheck(this, Model);

    this.options = options;
    this.reset();
  }

  Model.prototype.set = function set(key, value) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var attrs = undefined;
    var options = opts;

    // We only want to modify one key of the current attrs.
    if (typeof key == 'string') {
      this.attrs[key] = value;
      attrs = this.attrs;
    } else {
      attrs = key;
      if (value) options = value;
    }

    var hash = _stringify2['default'](attrs);
    if (hash === this.hash) return false;

    // Because parse will setup the object correctly.
    this.hash = hash;
    this.attrs = _parse2['default'](hash);
    if (!options.silent) this.options.onChange(hash);

    return true;
  };

  Model.prototype.get = function get(name) {
    return this.attrs[name];
  };

  Model.prototype.toJSON = function toJSON() {
    return this.attrs;
  };

  Model.prototype.reset = function reset() {
    this.attrs = _parse2['default']('');
    this.hash = '';
  };

  Model.prototype.isEmpty = function isEmpty() {
    return !this.hash;
  };

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];