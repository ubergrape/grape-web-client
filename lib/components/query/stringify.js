'use strict';

exports.__esModule = true;
exports['default'] = stringify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

var _constants = require('./constants');

/**
 * Convert query obj to query string.
 */

function stringify(query) {
  var filters = '';
  if (!_lodashLangIsEmpty2['default'](query.filters)) filters = query.filters.join(_constants.SEPARATOR) + _constants.SEPARATOR;

  return (query.trigger || '') + filters + (query.search || '');
}

module.exports = exports['default'];