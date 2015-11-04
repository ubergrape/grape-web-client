/**
 * Find matches of search in text.
 * TODO once this logic moved to the server, we can remove this code
 * https://github.com/ubergrape/chatgrape/issues/2412
 */
"use strict";

exports.__esModule = true;
exports["default"] = findMatches;

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

module.exports = exports["default"];