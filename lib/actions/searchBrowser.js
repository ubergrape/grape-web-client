'use strict';

exports.__esModule = true;
exports.focusSearchBrowserItem = focusSearchBrowserItem;
exports.setSearchBrowserFilters = setSearchBrowserFilters;
exports.selectSearchBrowserItem = selectSearchBrowserItem;
exports.selectSearchBrowserTab = selectSearchBrowserTab;
exports.createSearchBrowserState = createSearchBrowserState;
exports.navigateSearchBrowser = navigateSearchBrowser;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _constantsActionTypes = require('../constants/actionTypes');

var types = _interopRequireWildcard(_constantsActionTypes);

var _selectors = require('../selectors');

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

var _componentsBrowserDataUtils = require('../components/browser/dataUtils');

function focusSearchBrowserItem(selector) {
  return {
    type: types.FOCUS_SEARCH_BROWSER_ITEM,
    payload: {
      selector: selector
    }
  };
}

function setSearchBrowserFilters(filters) {
  return {
    type: types.SET_SEARCH_BROWSER_FILTERS,
    payload: {
      filters: filters,
      search: ''
    }
  };
}

function selectSearchBrowserItem(id) {
  return function (dispatch) {
    var state = _selectors.searchBrowserSelector(_store2['default'].getState());
    var item = id ? _componentsBrowserDataUtils.getItemById(state.sections, id) : _componentsBrowserDataUtils.getFocusedItem(state.sections);

    if (item.type === 'filters') {
      var service = _componentsBrowserDataUtils.findById(state.data.services, item.id);
      var filters = service ? [service.key] : [];
      dispatch(setSearchBrowserFilters(filters));
      return;
    }

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_ITEM,
      payload: {
        focusedItem: item
      }
    });
  };
}

function selectSearchBrowserTab(selector) {
  return {
    type: types.SELECT_SEARCH_BROWSER_TAB,
    payload: {
      selector: selector
    }
  };
}

function createSearchBrowserState(props) {
  return {
    type: types.CREATE_SEARCH_BROWSER_STATE,
    payload: {
      props: props
    }
  };
}

function navigateSearchBrowser(action) {
  return {
    type: types.NAVIGATE_SEARCH_BROWSER,
    payload: {
      action: action
    }
  };
}