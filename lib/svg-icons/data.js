'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionEach = require('lodash/collection/each');

var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

var _raw = require('./raw');

var raw = _interopRequireWildcard(_raw);

var _toData = require('./toData');

var _toData2 = _interopRequireDefault(_toData);

/**
 * Data image strings.
 */
var data = {};
_lodashCollectionEach2['default'](raw, function (svg, name) {
  return data[name] = _toData2['default'](svg);
});
exports['default'] = data;
module.exports = exports['default'];