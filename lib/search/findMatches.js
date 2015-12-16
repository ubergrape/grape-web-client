/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */
'use strict';

exports.__esModule = true;
exports['default'] = findMatches;

function findMatches(text, search) {
  var words = text.toLowerCase().split(/\b/);
  var searchArr = typeof search == 'string' ? [search] : search;
  var lowerSearchArr = searchArr.map(function (str) {
    return str.toLowerCase();
  });
  return words.map(function (word) {
    return {
      text: word,
      found: lowerSearchArr.indexOf(word) !== -1
    };
  });
}

module.exports = exports['default'];