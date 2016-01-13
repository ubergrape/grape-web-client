'use strict';

exports.__esModule = true;
exports.focusSearchBrowserItem = focusSearchBrowserItem;
exports.setSearchBrowserFilters = setSearchBrowserFilters;
exports.selectSearchBrowserItem = selectSearchBrowserItem;
exports.createSearchBrowserState = createSearchBrowserState;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _constantsActionTypes = require('../constants/actionTypes');

var types = _interopRequireWildcard(_constantsActionTypes);

var _selectors = require('../selectors');

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

var _componentsQueryBuild = require('../components/query/build');

var _componentsQueryBuild2 = _interopRequireDefault(_componentsQueryBuild);

var _componentsQueryConstants = require('../components/query/constants');

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
    var trigger = _componentsQueryConstants.TYPES.search;

    if (item.type === 'filters') {
      var service = _componentsBrowserDataUtils.findById(state.data.services, item.id);
      var filters = service ? [service.key] : [];
      dispatch(setSearchBrowserFilters(filters));
      //const query = buildQuery({trigger, filters})
      //state.onSelectFilter(query)
      return;
    }

    var query = _componentsQueryBuild2['default']({
      trigger: trigger,
      filters: state.filters,
      search: state.search
    });

    dispatch({
      type: types.SELECT_SEARCH_BROWSER_ITEM,
      payload: {
        focusedItem: item
      }
    });

    state.onSelectItem({ item: item, query: query });
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