'use strict';

exports.__esModule = true;

var _reselect = require('reselect');

var searchBrowserSelector = _reselect.createSelector(function (state) {
  return state.searchBrowser;
}, function (state) {
  return state;
});
exports.searchBrowserSelector = searchBrowserSelector;