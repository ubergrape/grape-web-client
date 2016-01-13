'use strict';

exports.__esModule = true;
exports.getSliceStyle = getSliceStyle;
exports.getStats = getStats;
exports.defineCustom = defineCustom;
exports.getCustom = getCustom;
exports.get = get;
exports.getIndex = getIndex;
exports.filter = filter;
exports.setSheet = setSheet;
exports.replace = replace;
exports.defaultRank = defaultRank;
exports.sortByRankAndLength = sortByRankAndLength;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionEach = require('lodash/collection/each');

var _lodashCollectionEach2 = _interopRequireDefault(_lodashCollectionEach);

var _jsEmoji = require('js-emoji');

var _jsEmoji2 = _interopRequireDefault(_jsEmoji);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var _iconIcon = require('../icon/Icon');

var _iconIcon2 = _interopRequireDefault(_iconIcon);

var map = undefined;
var customMap = {};
var index = [];
var sheetUrl = undefined;
var stats = {};

_jsEmoji2['default'].init_colons();

var colonsRegExp = _jsEmoji2['default'].rx_colons;

/**
 * Creates an index out of the map.
 */
function createIndex() {
  var newIndex = [];
  _lodashCollectionEach2['default'](map, function (item) {
    newIndex.push(item);
  });
  _lodashCollectionEach2['default'](customMap, function (item) {
    newIndex.push(item);
  });
  return newIndex;
}

function getSliceStyle(id) {
  var px = _jsEmoji2['default'].data[id][4];
  var py = _jsEmoji2['default'].data[id][5];
  var mul = 100 / (_jsEmoji2['default'].sheet_size - 1);

  return {
    backgroundPosition: mul * px + '% ' + mul * py + '%',
    backgroundSize: _jsEmoji2['default'].sheet_size + '00%',
    backgroundImage: 'url(' + sheetUrl + ')'
  };
}

/**
 * Create map from emoji colons.
 */
function createMap() {
  var newMap = {};
  stats.emoji = 0;
  _lodashCollectionEach2['default'](_jsEmoji2['default'].map.colons, function (id, name) {
    var style = getSliceStyle(id);
    var shortname = ':' + name + ':';
    newMap[name] = {
      id: id,
      name: name,
      shortname: shortname,
      icon: _react2['default'].createElement(_iconIcon2['default'], { name: shortname, style: style }),
      style: style,
      type: 'emoji'
    };
    stats.emoji++;
  });

  return newMap;
}

function getStats() {
  return stats;
}

/**
 * Define custom emojis.
 * @param {Object} emojis map of name:url pairs.
 */

function defineCustom(emojis) {
  stats.customEmoji = 0;
  _lodashCollectionEach2['default'](emojis, function (url, name) {
    var style = { backgroundImage: 'url(' + url + ')' };
    var shortname = ':' + name + ':';
    customMap[name] = {
      id: url,
      name: name,
      shortname: shortname,
      icon: _react2['default'].createElement(_iconIcon2['default'], { name: shortname, style: style }),
      style: style,
      type: 'customEmoji'
    };
    stats.customEmoji++;
  });
  index = createIndex();
}

/**
 * Get custom emoji map.
 */

function getCustom() {
  return customMap;
}

/**
 * Get emoji data.
 */

function get(shortName) {
  if (!shortName) return map;
  var name = shortName.replace(/:/g, '');
  return map[name] || customMap[name];
}

/**
 * Get index array.
 */

function getIndex() {
  return index;
}

/**
 * Filter emojis by key.
 */

function filter(key) {
  return index.filter(function (item) {
    return item.name.indexOf(key.toLowerCase()) >= 0;
  });
}

/**
 * Set icons image slice url.
 */

function setSheet(url) {
  sheetUrl = url;
  map = createMap();
  index = createIndex();
}

/**
 * Replace :smile: by html icon.
 */

function replace(text) {
  return text.replace(colonsRegExp, function (name) {
    var def = get(name);
    return def ? _reactDomServer2['default'].renderToStaticMarkup(def.icon) : name;
  });
}

/**
 * Return hardcoded rank for some emoji
 */

function defaultRank(value) {
  switch (value) {
    case 'thumbsup':
      return 6;
    case 'smile':
      return 5;
    case 'wink':
      return 4;
    case 'disappointed':
      return 3;
    case 'cry':
      return 2;
    case 'point_up':
      return 1;
    default:
      return 0;
  }
}

/**
 * Sort emoji list by rank and length
 */

function sortByRankAndLength(data) {
  var ranked = data.map(function (item) {
    item.rank = defaultRank(item.name);
    return item;
  });

  return ranked.sort(function (a, b) {
    var aRank = a.rank;
    var bRank = b.rank;
    if (aRank > bRank) return -1;
    if (bRank > aRank) return 1;
    if (aRank === bRank) {
      var aLength = a.name.length;
      var bLength = b.name.length;
      if (aLength < bLength) return -1;
      if (bLength < aLength) return 1;
      return 0;
    }
  });
}