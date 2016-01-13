'use strict';

exports.__esModule = true;
var types = ['NOOP', 'FOCUS_SEARCH_BROWSER_ITEM', 'CREATE_SEARCH_BROWSER_STATE', 'SELECT_SEARCH_BROWSER_ITEM', 'SELECT_SEARCH_BROWSER_TAB', 'SET_SEARCH_BROWSER_FILTERS'];

exports['default'] = types.reduce(function (map, type) {
  map[type] = type;
  return map;
}, {});
module.exports = exports['default'];