'use strict';

exports.__esModule = true;
exports.extractItems = extractItems;
exports.getFocusedItem = getFocusedItem;
exports.setFocusedItem = setFocusedItem;
exports.unsetFocusedItem = unsetFocusedItem;
exports.setSelectedTab = setSelectedTab;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

/**
 * Get all items from all sections.
 */

function extractItems(sections) {
  var items = [];
  sections.forEach(function (section) {
    return items = items.concat(section.items);
  });
  return items;
}

function getItem(sections, fn) {
  var item = undefined;

  sections.some(function (section) {
    item = _lodashCollectionFind2['default'](section.items, fn);
    return Boolean(item);
  });

  return item;
}

/**
 * Get item by id.
 */
function getItemById(sections, id) {
  return getItem(sections, function (item) {
    return item.id === id;
  });
}

/**
 * Get currently focused item.
 */

function getFocusedItem(sections) {
  return getItem(sections, function (item) {
    return item.focused;
  });
}

/**
 * Mark a item as focused. Unmark previously focused one.
 */

function setFocusedItem(sections, id) {
  unsetFocusedItem(sections);
  var item = getItemById(sections, id);
  item.focused = true;
}

/**
 * Mark currently focused item as not focused.
 */

function unsetFocusedItem(sections) {
  sections.forEach(function (section) {
    section.items.forEach(function (item) {
      return item.focused = false;
    });
  });
}

/**
 * Mark a tab at specified index as selected, unmark previously selected one.
 */

function setSelectedTab(tabs, index) {
  tabs.forEach(function (tab) {
    return tab.selected = false;
  });
  tabs[index].selected = true;
}