'use strict';

exports.__esModule = true;
exports.replaceLastQuery = replaceLastQuery;
exports.htmlWhitespacesToText = htmlWhitespacesToText;
exports.splitTextInParagraphs = splitTextInParagraphs;
exports.textToHtml = textToHtml;
exports.isEmpty = isEmpty;
exports.removeEmpty = removeEmpty;
exports.isGrapeObject = isGrapeObject;
exports.findGrapeObjects = findGrapeObjects;
exports.getResultsFromGrapeObjects = getResultsFromGrapeObjects;
exports.getText = getText;
exports.isElement = isElement;
exports.remove = remove;
exports.insert = insert;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashLangToArray = require('lodash/lang/toArray');

var _lodashLangToArray2 = _interopRequireDefault(_lodashLangToArray);

var _componentQuery = require('component-query');

var _componentQuery2 = _interopRequireDefault(_componentQuery);

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

var _lodashStringEscapeRegExp = require('lodash/string/escapeRegExp');

/**
 * Replace last occurrence of grape query within `content` by `replacement`.
 */

var _lodashStringEscapeRegExp2 = _interopRequireDefault(_lodashStringEscapeRegExp);

function replaceLastQuery(replacement, queryStr, content) {
  var r = new RegExp(_lodashStringEscapeRegExp2['default'](queryStr) + '$');
  return content.replace(r, replacement);
}

/**
 * Ensure we have only one type of white spaces.
 */

function htmlWhitespacesToText(text) {
  return text.replace(/\s|&nbsp;/g, ' ');
}

/**
 * Replace newlines by paragraphs, for further usage within contenteditable.
 */

function splitTextInParagraphs(text) {
  var parts = text.split(/\n/);
  parts = parts.map(function (part) {
    return '<p>' + part + '</p>';
  });
  var html = parts.join('');
  return html;
}

/**
 * Convert text to html prepared for contenteditable.
 * - escape html entities
 * - convert whitespaces to html entities
 * - convert new lines to paragraphs
 */

function textToHtml(text) {
  // In case we have html in text.
  var html = _lodashStringEscape2['default'](text);
  html = html.replace(/ /g, '&nbsp;');
  html = splitTextInParagraphs(html);
  return html;
}

/**
 * Returns true if content has no text and no grape objects.
 */

function isEmpty(node) {
  if (!node) return true;
  if (node.childNodes.length > 1) return false;
  if (!node.textContent.trim().length && !findGrapeObjects(node).length) return true;
  return false;
}

/**
 * Recursively remove node and every parent if it is empty until a passed untilNode.
 */

function removeEmpty(node, untilNode) {
  if (node !== untilNode && isEmpty(node)) {
    var _parent = node.parentNode;
    if (_parent && !removeEmpty(_parent, untilNode)) {
      _parent.removeChild(node);
      return true;
    }
  }
  return false;
}

/**
 * True when contains data-object md string.
 */

function isGrapeObject(el) {
  return Boolean(el && el.dataset.object);
}

/**
 * Find elements which are grape objects and contain md data.
 */

function findGrapeObjects(parent) {
  return _lodashLangToArray2['default'](_componentQuery2['default'].all('[data-object]', parent));
}

/**
 * Parse data-result json from passed elements.
 */

function getResultsFromGrapeObjects(node) {
  var elements = findGrapeObjects(node);
  var results = elements.map(function (el) {
    var result = el.dataset.result;

    return result ? JSON.parse(result) : {};
  });
  return results;
}

/**
 * Serialize child nodes and get text content.
 * - Convert html to text.
 * - Convert grape elements to markdown.
 */

function getText(node) {
  // Avoid modifying original nodes.
  var newNode = node.cloneNode(true);

  // Replace all grape object elements by their md representation.
  findGrapeObjects(newNode).forEach(function (el) {
    var text = document.createTextNode(el.dataset.object);
    el.parentNode.replaceChild(text, el);
  });

  // Replace br tags by new lines.
  _lodashLangToArray2['default'](_componentQuery2['default'].all('br', newNode)).forEach(function (el) {
    el.parentNode.replaceChild(document.createTextNode('\n'), el);
  });

  // .textContent will strip all tags, we need to ensure line breaks persist.
  var text = '';
  // Concatenate text contents of paragraphs and separate them by new lines.
  _lodashLangToArray2['default'](_componentQuery2['default'].all('p', newNode)).forEach(function (el, i, elms) {
    text += el.textContent.trim();
    if (i < elms.length - 1) text += '\n';
  });

  return text;
}

/**
 * Check if a node is of type element.
 */

function isElement(node) {
  return node && node.nodeType === document.ELEMENT_NODE;
}

/**
 * Remove node.
 */

function remove(node) {
  var parentNode = node.parentNode;

  if (parentNode) parentNode.removeChild(node);
}

/**
 * Insert a dom node after/before some ref.
 */

function insert(side, newNode, refNode) {
  var beforeNode = side === 'after' ? refNode.nextSibling : refNode;
  var parentNode = refNode.parentNode;

  if (parentNode) parentNode.insertBefore(newNode, beforeNode);
}