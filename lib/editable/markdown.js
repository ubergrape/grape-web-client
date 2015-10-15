'use strict';

exports.__esModule = true;
exports.replace = replace;
exports.parse = parse;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _objects = require('../objects');

var objects = _interopRequireWildcard(_objects);

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
var linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g;

/**
 * Replace md links which use cg protocol to our html representation.
 */

function replace(content) {
  return content.replace(linkRegExp, function (match, text, url) {
    if (url.indexOf('cg://') === 0) return toHTML(text, url);
    return match;
  });
}

/**
 * Parse all md links and convert them to array of data.
 */

function parse(content) {
  var data = [];
  content.replace(linkRegExp, function (match, text, url) {
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
  return objects.create('search', data).toHTML();
}