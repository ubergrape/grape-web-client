'use strict';

exports.__esModule = true;
exports.isExternalSearch = isExternalSearch;
exports.canShowBrowser = canShowBrowser;
exports.isBrowserType = isBrowserType;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _queryConstants = require('../query/constants');

/**
 * Returns true if search is external.
 */

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
  var browser = nextState.browser;

  if (!nextState.browser) return false;

  if (nextState.isLoading) return true;

  var isClosed = !prevState.browser;
  var isSearch = browser === 'search';
  var noResults = !data || _lodashLangIsEmpty2['default'](data.results);
  var hasSearch = query && query.search.length > 0;
  var closedBySpace = hasSearch && query.search[query.search.length - 1] === ' ';

  var isDataList = browser === 'emojiSuggest' || browser === 'user';
  if (isDataList && _lodashLangIsEmpty2['default'](data)) return false;

  if (isClosed && noResults && hasSearch) return false;

  if (isSearch && noResults && closedBySpace) return false;

  return true;
}

/**
 * Returns true if type will be rendered using grape-browser.
 */

function isBrowserType(typeOrTrigger) {
  return typeOrTrigger === _queryConstants.SEARCH_TRIGGER || typeOrTrigger === 'search';
}