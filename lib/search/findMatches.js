'use strict';

exports.__esModule = true;
exports['default'] = findMatches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashStringEscapeRegExp = require('lodash/string/escapeRegExp');

var _lodashStringEscapeRegExp2 = _interopRequireDefault(_lodashStringEscapeRegExp);

/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */

function findMatches(text, search) {
  var searchArr = typeof search == 'string' ? [search] : search;
  var lowerSearchArr = searchArr.map(function (value) {
    return value.toLowerCase();
  });
  var searchRegExpStr = searchArr.map(function (searchStr) {
    return '(' + _lodashStringEscapeRegExp2['default'](searchStr) + ')';
  }).join('|');
  var regExp = new RegExp('\\b' + searchRegExpStr + '\\b', 'gi');

  return text.split(regExp).reduce(function (matches, value) {
    if (!value) return matches;
    var found = lowerSearchArr.indexOf(value.toLowerCase()) !== -1;
    matches.push({
      text: value,
      found: found
    });
    return matches;
  }, []);
}

module.exports = exports['default'];