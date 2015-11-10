'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _raw = require('./raw');

var raw = _interopRequireWildcard(_raw);

/**
 * Raw svg strings.
 */
exports.raw = raw;

/**
 * Data image strings.
 */
var data = {};
exports.data = data;
for (var _name in raw) {
  data[_name] = 'data:image/svg+xml;utf8,' + raw[_name];
}