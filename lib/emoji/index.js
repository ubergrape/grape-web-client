'use strict';

exports.__esModule = true;
exports.getStats = getStats;
exports.defineCustom = defineCustom;
exports.getCustom = getCustom;
exports.get = get;
exports.getIndex = getIndex;
exports.filter = filter;
exports.setSheet = setSheet;
exports.replace = replace;
exports.getSliceStyle = getSliceStyle;

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