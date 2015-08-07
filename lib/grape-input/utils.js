'use strict';

exports.__esModule = true;
exports.isExternalSearch = isExternalSearch;
exports.canShowBrowser = canShowBrowser;
exports.isBrowserType = isBrowserType;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

var _lodashObjectGet = require('lodash/object/get');

/**
 * Returns true if search is external.
 */

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

function isExternalSearch(data) {
  return _lodashObjectGet2['default'](data, 'search.type') === 'external';
}

/**
 * Returns true if browser can be shown.
 */

function canShowBrowser(prevState, nextState) {
  if (prevState === undefined) prevState = {};
  var query = nextState.query;
  var data = nextState.data;

  if (!nextState.browser) return false;

  if (nextState.isLoading) return true;

  var isClosed = !prevState.browser;
  var isSearch = nextState.browser === 'search';
  var noResults = !data || _lodashLangIsEmpty2['default'](data.results);
  var hasSearch = query && query.search.length > 0;
  var closedBySpace = hasSearch && query.search[query.search.length - 1] === ' ';

  if (isClosed && noResults && hasSearch) return false;

  if (isSearch && noResults && closedBySpace) return false;

  return true;
}

/**
 * Returns true if type will br rendered using grape-browser.
 */

function isBrowserType(type) {
  return type && (type === 'search' || type === 'emoji');
}