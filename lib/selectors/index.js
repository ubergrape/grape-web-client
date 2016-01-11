'use strict';

exports.__esModule = true;

var _reselect = require('reselect');

var searchInputSelector = _reselect.createSelector(function (state) {
  return state.searchInput;
}, function (state) {
  return state;
});
exports.searchInputSelector = searchInputSelector;