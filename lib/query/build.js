'use strict';

exports.__esModule = true;
exports['default'] = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

/**
 * Build a query object from a "non complete query" object to fill it with
 * default props.
 */

function build(query) {
  return _parse2['default'](_stringify2['default'](query));
}

module.exports = exports['default'];