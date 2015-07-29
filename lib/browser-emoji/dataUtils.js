'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.init = init;
exports.getSections = getSections;
exports.getSection = getSection;
exports.getTabs = getTabs;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashCollectionIndexBy = require('lodash/collection/indexBy');

var _lodashCollectionIndexBy2 = _interopRequireDefault(_lodashCollectionIndexBy);

var _lodashObjectValues = require('lodash/object/values');

var _lodashObjectValues2 = _interopRequireDefault(_lodashObjectValues);

var _lodashArrayCompact = require('lodash/array/compact');

var _lodashArrayCompact2 = _interopRequireDefault(_lodashArrayCompact);

var _lodashLangClone = require('lodash/lang/clone');

var _lodashLangClone2 = _interopRequireDefault(_lodashLangClone);

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

var EMOJI_CATEGORY_ORDER = {
  emoticons: 0,
  nature: 1,
  objects: 2,
  places: 3,
  other: 4
};

var EMOJI_CATEGORY_ICON = {
  search: 'mag',
  emoticons: 'smiley',
  nature: 'four_leaf_clover',
  objects: 'soccer',
  places: 'airplane',
  other: '1234',
  grapemoji: 'grapemoji'
};

var EMOJI_META_MAP = _lodashCollectionIndexBy2['default'](_emojiMeta2['default'], 'name');

var allSections = [];

var getFocusedItem = dataUtils.getFocusedItem;
exports.getFocusedItem = getFocusedItem;
var setFocusedItem = dataUtils.setFocusedItem;
exports.setFocusedItem = setFocusedItem;
var setSelectedTab = dataUtils.setSelectedTab;
exports.setSelectedTab = setSelectedTab;
var getItem = grid.getItem;
exports.getItem = getItem;

function init() {
  if (!emoji.get()) return;

  _emojiMeta2['default'].forEach(function (data) {
    var section = _lodashCollectionFind2['default'](allSections, function (item) {
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
      allSections.push(section);
    }

    section.itemNames.push(data.name);
  });

  allSections = allSections.sort(function (section1, section2) {
    return EMOJI_CATEGORY_ORDER[section1.id] - EMOJI_CATEGORY_ORDER[section2.id];
  });

  // Populate emoji sections with items if we have them in js-emoji.
  allSections.forEach(function (section) {
    section.items = [];
    section.itemNames.forEach(function (name) {
      var item = emoji.get(name);
      if (item) section.items.push(item);
    });
  });

  allSections.push({
    id: 'grapemoji',
    label: 'grapemoji',
    selected: false,
    items: _lodashObjectValues2['default'](emoji.getCustom())
  });
}

function getSections(search) {
  var facet = arguments.length <= 1 || arguments[1] === undefined ? 'emoticons' : arguments[1];

  var ret = allSections;

  if (search && facet === 'search') {
    ret = ret.map(function (section) {
      var items = section.items.filter(function (item) {
        if (item.name.indexOf(search) >= 0) return true;
        var metaItem = EMOJI_META_MAP[item.name];
        if (!metaItem) return false;
        return metaItem.aliases.some(function (alias) {
          return alias.indexOf(search) >= 0;
        });
      });
      if (items.length) return _extends({}, section, { items: items });
    });
    ret = _lodashArrayCompact2['default'](ret);
  }

  if (ret.length) {
    if (facet) {
      var section = _lodashCollectionFind2['default'](ret, function (_ref) {
        var id = _ref.id;
        return id === facet;
      });
      if (section) ret = [section];
    }
    setFocusedItem(ret, ret[0].items[0].id);
  }

  return ret;
}

function getSection(sections, facet) {
  var section = _lodashCollectionFind2['default'](sections, function (_ref2) {
    var id = _ref2.id;
    return id === facet;
  });
  if (section) setFocusedItem([section], section.items[0].id);
  return section;
}

function getTabs(_ref3) {
  var hasSearch = _ref3.hasSearch;
  var selected = _ref3.selected;
  var orgLogo = _ref3.orgLogo;

  if (!allSections.length) return [];

  var sections = _lodashLangClone2['default'](allSections);

  if (hasSearch) sections.unshift({ id: 'search' });

  var tabs = sections.map(function (_ref4) {
    var id = _ref4.id;

    var iconId = EMOJI_CATEGORY_ICON[id];
    var style = undefined;

    if (iconId === 'grapemoji') {
      style = _extends({
        backgroundImage: 'url(' + orgLogo + ')'
      }, itemStyle.TAB_ICON);
    } else {
      var smiley = emoji.get(iconId);
      style = _extends({}, emoji.getSliceStyle(smiley.id), itemStyle.TAB_ICON);
    }

    var icon = _react2['default'].createElement(_emojiIcon2['default'], { style: style });
    return { id: id, selected: false, icon: icon };
  });

  var tab = undefined;
  if (selected) tab = _lodashCollectionFind2['default'](tabs, function (_ref5) {
    var id = _ref5.id;
    return id === selected;
  });else tab = tabs[0];
  tab.selected = true;

  return tabs;
}