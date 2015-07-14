'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.init = init;
exports.getSections = getSections;
exports.getTabs = getTabs;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashCollectionIndexBy = require('lodash/collection/indexBy');

var _lodashCollectionIndexBy2 = _interopRequireDefault(_lodashCollectionIndexBy);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _lodashObjectValues = require('lodash/object/values');

var _lodashObjectValues2 = _interopRequireDefault(_lodashObjectValues);

var _browserDataUtils = require('../browser/dataUtils');

var dataUtils = _interopRequireWildcard(_browserDataUtils);

var _grid = require('./grid');

var grid = _interopRequireWildcard(_grid);

var _emojiMeta = require('../emoji/meta');

var _emojiMeta2 = _interopRequireDefault(_emojiMeta);

var _emoji = require('../emoji');

var emoji = _interopRequireWildcard(_emoji);

var _emojiIcon = require('../emoji/Icon');

var _emojiIcon2 = _interopRequireDefault(_emojiIcon);

var _itemStyle = require('./item/style');

var itemStyle = _interopRequireWildcard(_itemStyle);

var CATEGORY_ORDER = {
  emoticons: 0,
  nature: 1,
  objects: 2,
  places: 3,
  other: 4
};

var getFocusedItem = dataUtils.getFocusedItem;
exports.getFocusedItem = getFocusedItem;
var setFocusedItem = dataUtils.setFocusedItem;
exports.setFocusedItem = setFocusedItem;
var setSelectedTab = dataUtils.setSelectedTab;
exports.setSelectedTab = setSelectedTab;
var getItem = grid.getItem;
exports.getItem = getItem;

var sections = {};

var META_MAP = _lodashCollectionIndexBy2['default'](_emojiMeta2['default'], 'name');

sections.emoji = (function () {
  var staticSections = [];

  _emojiMeta2['default'].forEach(function (data) {
    var section = _lodashCollectionFind2['default'](staticSections, function (item) {
      return item.id === data.cat;
    });

    if (!section) {
      section = {
        id: data.cat,
        label: data.cat,
        itemNames: [],
        items: [],
        selected: false
      };
      staticSections.push(section);
    }

    section.itemNames.push(data.name);
  });

  staticSections = staticSections.sort(function (section1, section2) {
    return CATEGORY_ORDER[section1.id] - CATEGORY_ORDER[section2.id];
  });

  return staticSections;
})();

function init() {
  if (!emoji.get()) return;

  // Populate emoji sections with items if we have them in js-emoji.
  sections.emoji.forEach(function (section) {
    section.items = [];
    section.itemNames.forEach(function (name) {
      var item = emoji.get(name);
      if (item) section.items.push(item);
    });
  });

  sections.customEmoji = [{
    id: 'customEmoji',
    label: 'Custom',
    selected: false,
    items: _lodashObjectValues2['default'](emoji.getCustom())
  }];
}

function getSections(facet, search) {
  var found = sections[facet];

  if (search) {
    found = [];
    sections[facet].forEach(function (section) {
      var items = section.items.filter(function (item) {
        if (item.name.indexOf(search) >= 0) return true;
        var metaItem = META_MAP[item.name];
        if (!metaItem) return false;
        return metaItem.aliases.some(function (alias) {
          return alias.indexOf(search) >= 0;
        });
      });
      if (items.length) found.push(_extends({}, section, { items: items }));
    });
  }

  // Select first item of the first section.
  var firstItemId = _lodashObjectGet2['default'](found, '[0].items[0].id');
  if (firstItemId) setFocusedItem(found, firstItemId);
  return found;
}

function getTabs(options) {
  var tabs = [];

  if (!emoji.get()) return tabs;

  var stats = emoji.getStats();

  if (stats.emoji) {
    var smiley = emoji.get('smiley');
    var style = _extends({}, emoji.getSliceStyle(smiley.id), itemStyle.TAB_ICON);
    tabs.push({
      id: 'emoji',
      label: 'Emoji',
      amount: stats.emoji,
      selected: !options.selected || options.selected === 'emoji',
      icon: _react2['default'].createElement(_emojiIcon2['default'], { style: style })
    });
  }

  if (stats.customEmoji) {
    var style = _extends({ backgroundImage: 'url(' + options.orgLogo + ')' }, itemStyle.TAB_ICON);
    tabs.push({
      id: 'customEmoji',
      label: 'Grapemoji',
      amount: stats.customEmoji,
      selected: options.selected === 'customEmoji',
      icon: _react2['default'].createElement(_emojiIcon2['default'], { style: style })
    });
  }

  return tabs;
}