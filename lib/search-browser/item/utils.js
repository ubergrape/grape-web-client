'use strict';

exports.__esModule = true;
exports.getState = getState;
exports.findMatches = findMatches;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

/**
 * Find state meta.
 */

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

function getState(detail) {
  if (!detail || _lodashLangIsEmpty2['default'](detail.meta)) return '';
  var state = _lodashCollectionFind2['default'](detail.meta, function (meta) {
    return meta.label === 'State';
  });
  if (state) return state.value;
}

/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */

function findMatches(text, search) {
  var lowerText = text.toLowerCase();
  var lowerSearch = search.toLowerCase();
  var parts = lowerText.split(lowerSearch);
  var matches = [];
  if (parts.length === 1) return matches;

  var index = 0;
  parts.forEach(function (part) {
    var match = text.substr(index, part.length);

    if (match) {
      matches.push({
        text: match,
        found: false
      });
      index += match.length;
    }

    match = text.substr(index, search.length);

    if (match) {
      matches.push({
        text: match,
        found: true
      });
      index += search.length;
    }
  });

  return matches;
}