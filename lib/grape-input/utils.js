'use strict';

exports.__esModule = true;
exports.findServiceById = findServiceById;
exports.isExternalSearch = isExternalSearch;
exports.canSuggest = canSuggest;
exports.detectService = detectService;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

var _lodashObjectGet = require('lodash/object/get');

/**
 * Get service object by id.
 */

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

function findServiceById(id, data) {
  return _lodashCollectionFind2['default'](data.services, function (service) {
    return service.id === id;
  });
}

/**
 * Returns true if search is external.
 */

function isExternalSearch(data) {
  return _lodashObjectGet2['default'](data, 'search.type') === 'external';
}

/**
 * Returns true if autocomplete can be shown.
 */

function canSuggest(prevState, nextState) {
  if (prevState === undefined) prevState = {};
  var query = nextState.query;
  var disabled = nextState.disabled;
  var data = nextState.data;

  if (!nextState.type || disabled) return false;

  var isClosed = prevState.type == null;
  var isSearch = nextState.type === 'search';
  var noResults = !data || _lodashLangIsEmpty2['default'](data.results);
  var hasSearch = query && query.search.length > 0;
  var closedBySpace = hasSearch && query.search[query.search.length - 1] === ' ';

  if (isClosed && isSearch && noResults && hasSearch) return false;

  if (isSearch && noResults && closedBySpace) return false;

  return true;
}

/**
 * Get service id from the data using service key.
 */

function detectService(queryObj, data) {
  var key = _lodashObjectGet2['default'](queryObj, 'filters[0]');
  if (!key) return '';
  var service = _lodashCollectionFind2['default'](data.services, function (item) {
    return item.key === key;
  });
  if (service) return service.id;
}