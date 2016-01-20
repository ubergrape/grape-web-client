'use strict';

exports.__esModule = true;
exports['default'] = getColored;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _raw = require('./raw');

var raw = _interopRequireWildcard(_raw);

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

var cache = {};

/**
 * Modifies `fill` and `stroke` attribute of `path`, caches resulting svg string.
 */

function getColored(_ref) {
  var name = _ref.name;
  var color = _ref.color;

  var key = name + color;

  if (!cache[key]) {
    cache[key] = _dom2['default'](raw[name]).find('path').attr('fill', color).attr('stroke', color).data();
  }

  return cache[key];
}

module.exports = exports['default'];