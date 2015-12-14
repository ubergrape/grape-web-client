'use strict';

exports.__esModule = true;
exports.ensureSpace = ensureSpace;
exports.parseAndReplace = parseAndReplace;
exports.parseEmoji = parseEmoji;
exports.getObjectsPositions = getObjectsPositions;
exports.getTextAndObjects = getTextAndObjects;
exports.getTokenUnderCaret = getTokenUnderCaret;
exports.getQuery = getQuery;
exports.isFocused = isFocused;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectsUtils = require('../objects/utils');

var _queryParse = require('../query/parse');

var _queryParse2 = _interopRequireDefault(_queryParse);

var _lodashString = require('lodash/string');

var _queryConstants = require('../query/constants');

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
var linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g;

// white space or new line
var emptySpaceReEexp = /^\s$/;

function tokenWithoutTrigger(token, type) {
  return token[0] === _objectsUtils.getTrigger(type) ? token.substr(1) : token;
}

function tokenWithTrigger(token, type) {
  var label = _objectsUtils.getTrigger(type);
  return token[0] === label ? token : label + token;
}

/**
 * Get data map from md object.
 */
function toData(text, url) {
  var parts = url.slice(5).split('|');

  return {
    id: tokenWithoutTrigger(parts[2], parts[1]),
    name: tokenWithoutTrigger(text, parts[1]),
    slug: parts[3].replace('/chat/', ''),
    service: parts[0],
    type: parts[1],
    url: parts[3]
  };
}

/**
 * Get all indexes for substring:
 * start and end index i.e. [[0, 5], [10, 15]]
 */
function getPositions(sub, str) {
  var subLen = sub.length;
  var positions = [];

  var startIndex = 0;
  var index = str.indexOf(sub, startIndex);
  while (index > -1) {
    startIndex = index + subLen;
    positions.push([index, startIndex]);
    index = str.indexOf(sub, startIndex);
  }
  return positions;
}

function getEmojiConfig(token) {
  return {
    type: 'emoji',
    shortname: token,
    content: token
  };
}

/*
 * Add space before or after string,
 * if there is no space or new line.
 */

function ensureSpace(where, str) {
  var result = str || ' ';

  switch (where) {
    case 'before':
      if (!emptySpaceReEexp.test(result[0])) result = ' ' + result;
      break;
    case 'after':
      if (!emptySpaceReEexp.test(result.slice(-1))) result = result + ' ';
      break;
    default:
  }

  return result;
}

/**
 * Parse all md links and convert them to array of data.
 */

function parseAndReplace(content) {
  var configs = [];
  var text = content.replace(linkRegExp, function (match, token, url) {
    var config = toData(token, url);
    configs.push(config);
    return tokenWithTrigger(token, config.type);
  });

  text = text.replace(_queryConstants.EMOJI_REGEX, function (match) {
    configs.push(getEmojiConfig(match));
    return match;
  });

  return { configs: configs, text: text };
}

/**
 * Parse emoji smiles, like ':smile:'
 */

function parseEmoji(content) {
  var data = [];
  var emoji = content.match(_queryConstants.EMOJI_REGEX);
  if (emoji) data = emoji.map(getEmojiConfig);
  return data;
}

/**
 * Get associated object of tokens (grape objects)
 * and theirs positions. i.e. {token: [[0, 5], [10, 15]]}
 */

function getObjectsPositions(objects, text) {
  var objectsPositions = {};

  Object.keys(objects).forEach(function (key) {
    objectsPositions[key] = getPositions(key, text);
  });

  return objectsPositions;
}

/**
 * Get an array of substrings and tokens (grape objects) in
 * order of appearance.
 */

function getTextAndObjects(objects, text) {
  var content = undefined;
  var tokens = Object.keys(objects);

  if (tokens.length) {
    (function () {
      var tokensRegExp = new RegExp(tokens.map(_lodashString.escapeRegExp).join('|'), 'g');
      var keysInText = text.match(tokensRegExp);
      content = [];
      text.split(tokensRegExp).forEach(function (substr, i, arr) {
        content.push(substr);
        if (i < arr.length - 1) content.push(objects[keysInText[i]]);
      });
    })();
  } else {
    content = [text];
  }

  return content;
}

/**
 * Traverse string and get token if
 * caret is inside or right after/before, otherwise return false.
 * Token here is 'grape object' or 'possible grape object'
 * i.e. '@Developmend' or '@develo'
 */

function getTokenUnderCaret(string, caretPostion) {
  var token = {
    text: '',
    position: []
  };

  var position = token.position;

  while (position.length < 2) {
    var nextSymbolIndex = position.length ? caretPostion : caretPostion - 1;
    var previousSymbolIndex = nextSymbolIndex;
    var tailFound = false;

    while (!tailFound) {
      var nextSymbol = string[nextSymbolIndex];

      if (nextSymbol && emptySpaceReEexp.test(nextSymbol) || nextSymbolIndex < 0 || nextSymbolIndex === string.length) {
        position.push(previousSymbolIndex);
        tailFound = true;
        break;
      }

      if (position.length) {
        token.text = token.text + string[nextSymbolIndex];
      } else {
        token.text = string[nextSymbolIndex] + token.text;
      }

      previousSymbolIndex = nextSymbolIndex;
      nextSymbolIndex = position.length ? nextSymbolIndex + 1 : nextSymbolIndex - 1;
    }
  }

  return Boolean(token.text) && token;
}

/**
 * Return query if value is query or false
 */

function getQuery(value, selectionEnd) {
  var token = getTokenUnderCaret(value, selectionEnd);
  var isQuery = Boolean(token.text && token.text.match(_queryConstants.QUERY_REGEX));

  return isQuery ? _queryParse2['default'](token.text) : false;
}

/**
 * Check if an element is focused.
 */

function isFocused(node) {
  return node === document.activeElement;
}