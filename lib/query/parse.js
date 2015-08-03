'use strict';

exports.__esModule = true;
exports['default'] = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashStringTrimLeft = require('lodash/string/trimLeft');

var _lodashStringTrimLeft2 = _interopRequireDefault(_lodashStringTrimLeft);

var _constants = require('./constants');

/**
 * Get search object from a query string.
 *
 * Query string format:
 *   {trigger}{filter1}:{filter...}:{keywords}
 *
 * Query object format:
 * {
 *    query: String, // original query string
 *    key: String, // filters + keywords
 *    trigger: String, // trigger char (#:@)
 *    filters: [Array], // filters array
 *    search: String // search keywords
 * }
 *
 * Example
 *
 * `parse('#giphy:something')`
 *
 * Returns:
 * ```
 * {
 *   query: '#giphy:something',
 *   key: giphy:somethig,
 *   trigger: '#',
 *   filters: ['giphy'],
 *   search: 'something'
 * }
 * ```
 */

function parse(query) {
  var triggerIndex = _constants.TRIGGERS.indexOf(query[0]);
  var trigger = _constants.TRIGGERS[triggerIndex];
  var key = query.substr(1);
  var filters = key.split(_constants.SEPARATOR);
  var search = filters.pop();
  // We can trim filters, right?
  filters = filters.map(function (filter) {
    return filter.trim();
  });
  search = _lodashStringTrimLeft2['default'](search);

  return {
    query: query,
    key: key,
    trigger: trigger,
    filters: filters,
    search: search
  };
}

module.exports = exports['default'];