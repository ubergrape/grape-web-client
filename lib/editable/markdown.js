'use strict';

exports.__esModule = true;
exports.replace = replace;
exports.parse = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectsSearch = require('../objects/Search');

var _objectsSearch2 = _interopRequireDefault(_objectsSearch);

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
var regExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g;

/**
 * Replace md links which use cg protocol to our html representation.
 */

function replace(content) {
  return content.replace(regExp, function (match, text, url) {
    if (url.indexOf('cg://') === 0) return toHTML(text, url);
    return match;
  });
}

/**
 * Parse all md links and convert them to array of data.
 */

function parse(content) {
  var data = [];
  content.replace(regExp, function (match, text, url) {
    data.push(toData(text, url));
  });
  return data;
}

/**
 * Get data map from md object.
 */
function toData(text, url) {
  var parts = url.slice(5).split('|');
  return {
    name: text,
    service: parts[0],
    type: parts[1],
    id: parts[2],
    url: parts[3]
  };
}

/**
 * Build html element for md object.
 */
function toHTML(text, url) {
  var data = toData(text, url);
  return new _objectsSearch2['default'](data).toHTML();
}