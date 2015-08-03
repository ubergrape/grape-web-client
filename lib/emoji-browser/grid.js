'use strict';

exports.__esModule = true;
exports.getItem = getItem;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashCollectionFind = require('lodash/collection/find');

/**
 * Get item from sections.
 */

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

function getItem(sections, dir) {
  var length = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

  if (dir === 'next' || dir === 'prev') {
    return findHorizontalItem(sections, length, dir);
  }

  if (dir === 'nextRow' || dir === 'prevRow') {
    return findVerticalItem(sections, length, dir.substr(0, 4));
  }
}

/**
 * Find a next or prev item when moving horizontally on the grid.
 *
 * Edge cases are:
 * - We are already on the last item of the current row, we need to move to the
 * first item of the same row.
 * - We are on the first item of the current row, we need to move to the last one.
 * - Row is not full.
 */
function findHorizontalItem(sections, length, dir) {
  var section = getCurrentSection(sections);
  var items = section.items;

  var index = _lodashArrayFindIndex2['default'](section.items, function (item) {
    return item.focused;
  });
  var row = Math.floor(index / length);
  var shift = index - row * length;

  if (dir === 'next') {
    if (items[index + 1] && shift + 1 < length) index++;else index = index - shift;
  } else {
    if (items[index - 1] && shift) index--;else if (items[index + length - 1]) index = index + length - 1;else index = items.length - 1;
  }

  return items[index];
}

/**
 * Find a next or prev item when moving vertically on the grid.
 *
 * Edge cases are:
 * - We are already on the last row of the current section, we need to
 * move to the next section.
 * - We are on the last row of the last section, we need to move to the
 * first section.
 * - Next row has no item at current position shift, we need to go to the
 * next row until we find one.
 */
function findVerticalItem(sections, length, dir) {
  var currSection = getCurrentSection(sections);
  var currIndex = _lodashArrayFindIndex2['default'](currSection.items, function (item) {
    return item.focused;
  });
  var currRow = Math.floor(currIndex / length);
  var shift = currIndex - currRow * length;
  var nextRow = currRow + (dir === 'next' ? 1 : -1);

  function findItem() {
    var _again = true;

    _function: while (_again) {
      nextIndex = item = rowsAmount = rowsAmount = undefined;
      _again = false;

      var nextIndex = nextRow * length + shift;
      var item = currSection.items[nextIndex];

      if (item) return item;

      if (dir === 'next') {
        var rowsAmount = getRowsAmount(currSection, length);
        // Last row of the current section.
        if (nextRow > rowsAmount - 1) {
          nextRow = 0;
          currSection = getNextSection(sections, currSection);
        } else nextRow++;
      } else {
        // First row of the current section.
        if (nextRow < 0) {
          currSection = getPrevSection(sections, currSection);
          var rowsAmount = getRowsAmount(currSection, length);
          nextRow = rowsAmount - 1;
        } else nextRow--;
      }

      _again = true;
      continue _function;
    }
  }

  return findItem();
}

function getCurrentSection(sections) {
  return _lodashCollectionFind2['default'](sections, function (section) {
    return section.items.some(function (item) {
      return item.focused;
    });
  });
}

function getNextSection(sections, current) {
  var index = _lodashArrayFindIndex2['default'](sections, function (section) {
    return section.id === current.id;
  });
  var next = sections[index + 1];
  return next ? next : sections[0];
}

function getPrevSection(sections, current) {
  var index = _lodashArrayFindIndex2['default'](sections, function (section) {
    return section.id === current.id;
  });
  var prev = sections[index - 1];
  return prev ? prev : sections[sections.length - 1];
}

function getRowsAmount(section, length) {
  return Math.ceil(section.items.length / length);
}