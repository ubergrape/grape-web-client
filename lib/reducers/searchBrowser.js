'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = reduce;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _constantsActionTypes = require('../constants/actionTypes');

var types = _interopRequireWildcard(_constantsActionTypes);

var _componentsBrowserDataUtils = require('../components/browser/dataUtils');

var warn = console.warn;

warn = warn.bind(console);

// Service/icon map.
// TODO it should be a service implementation detail.
var serviceIconMap = {
  github: 'github',
  googledrive: 'file',
  gcal: 'calendar',
  trello: 'trello',
  dropbox: 'dropbox',
  filters: 'search'
};

/**
 * Get sections based data structure.
 *
 * {
 *   label: 'Google drive',
 *   service: 'googledrive',
 *   icon: 'file',
 *   results: [
 *     {
 *       id: '10',
 *       type: 'file',
 *       name: '1. Tagging+GitHub.mp4',
 *       info: '/UberGrape/ChatGrape/...',
 *       date: ...
 *     }
 *   ]
 * }
 */
var getSections = (function () {
  /**
   * Generate data for queries section.
   */
  function addFilterObjects(data) {
    var queries = data.search.queries;

    if (!queries.length) return data;

    // Add fake service.
    var service = {
      hidden: true,
      count: queries.length,
      id: 'filters',
      key: 'filters',
      label: 'Queries'
    };

    var results = queries.map(function (query) {
      return {
        id: query.id,
        name: 'Search ' + query.name,
        type: service.id,
        container: '#' + query.query,
        service: service.id
      };
    });

    data.services = [service].concat(data.services);
    data.results = [].concat(results, data.results);

    return data;
  }

  return function get(data, serviceId) {
    var limitPerSection = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    var sections = [];
    var newData = addFilterObjects(_extends({}, data));

    // Group by sections.
    newData.results.forEach(function (result) {
      if (serviceId && result.service !== serviceId) return;

      var section = _componentsBrowserDataUtils.findById(sections, result.service);
      var service = _componentsBrowserDataUtils.findById(newData.services, result.service);

      if (!service) {
        warn('No service corresponding the item.', result);
        return;
      }

      // We have no section for this service yet.
      if (!section) {
        section = {
          id: result.service,
          label: service.label,
          items: [],
          selected: false
        };
        sections.push(section);
      }

      if (serviceId || section.items.length < limitPerSection || result.service === 'filters') {
        if (!result.detail) result.detail = {};
        if (service.icon_url) result.detail.iconUrl = service.icon_url;
        section.items.push({
          id: result.id,
          type: result.type,
          name: result.name,
          info: result.container,
          date: result.start,
          focused: false,
          icon: serviceIconMap[result.service],
          detail: result.detail,
          search: newData.search.text
        });
      }
    });

    // Select first result of the first section.
    if (sections[0] && sections[0].items[0]) sections[0].items[0].focused = true;

    return sections;
  };
})();

/**
 * Get a section which is currently selected.
 */
function getSelectedSection(sections) {
  return _lodashCollectionFind2['default'](sections, function (section) {
    return section.selected;
  });
}

/**
 * Mark section as selected. Unmark previously selected one.
 */
function setSelectedSection(sections, id) {
  var curr = getSelectedSection(sections);
  if (curr) curr.selected = false;
  if (id) {
    var next = _componentsBrowserDataUtils.findById(sections, id);
    if (next) next.selected = true;
  }
}

/**
 * Mark an item as focused. Unmark previously focused one.
 */
function setFocusedItemAt(sections, id, index) {
  if (!sections.length) return;
  _componentsBrowserDataUtils.unsetFocusedItem(sections);
  // Take first id when nothing passed.
  var section = _componentsBrowserDataUtils.findById(sections, id || sections[0].id);
  if (section) section.items[index].focused = true;
}

/**
 * Get data for tabs representation.
 */
function getTabs(items, serviceId) {
  if (items === undefined) items = [];

  if (!items.length) return items;

  var visibleItems = items.filter(function (item) {
    return !item.hidden && item.count !== undefined;
  });

  var tabs = visibleItems.map(function (item) {
    return {
      label: item.label,
      amount: item.count,
      id: item.id,
      selected: serviceId === item.id
    };
  });

  var total = 0;
  tabs.forEach(function (tab) {
    return total += tab.amount || 0;
  });

  tabs.unshift({
    label: 'All',
    amount: total,
    selected: !serviceId
  });

  return tabs;
}

/**
 * Get service id from the data using filters array.
 */
function filtersToServiceId(_ref) {
  var _ref$services = _ref.services;
  var services = _ref$services === undefined ? [] : _ref$services;
  var filters = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  if (filters[0]) {
    var service = _lodashCollectionFind2['default'](services, function (_ref2) {
      var key = _ref2.key;
      return key === filters[0];
    });
    if (service) return service.id;
  }
  return '';
}

/**
 * Returns a new state with focused item according selector.
 */
function focusItem(selector, state) {
  var sections = state.sections;

  var id = selector;

  if (selector === 'next' || selector === 'prev') {
    var selectedSection = getSelectedSection(sections);
    var items = selectedSection ? selectedSection.items : _componentsBrowserDataUtils.extractItems(sections);
    var focusedIndex = _lodashArrayFindIndex2['default'](items, function (item) {
      return item.focused;
    });
    var newItem = undefined;

    if (selector === 'next') {
      newItem = items[focusedIndex + 1];
      if (!newItem) newItem = items[0];
    } else if (selector === 'prev') {
      newItem = items[focusedIndex - 1];
      if (!newItem) newItem = items[items.length - 1];
    }

    id = newItem.id;
  }

  _componentsBrowserDataUtils.setFocusedItem(sections, id);

  return _extends({}, state, {
    sections: sections,
    focusedItem: _componentsBrowserDataUtils.getFocusedItem(sections)
  });
}

function createState(nextProps, prevState) {
  var data = nextProps.data;

  var inputDelay = nextProps.isExternal ? nextProps.externalServicesInputDelay : undefined;

  if (!data) {
    return _extends({}, prevState, nextProps, {
      sections: [],
      tabs: [],
      inputDelay: inputDelay,
      focusedItem: undefined
    });
  }

  var serviceId = undefined;
  if (prevState.filters) {
    serviceId = filtersToServiceId(data, prevState.filters);
  }

  var sections = getSections(data, serviceId, nextProps.maxItemsPerSectionInAll);

  var selectedSection = getSelectedSection(sections);
  if (selectedSection) sections = [selectedSection];

  var tabs = getTabs(data.services, serviceId);

  var focusedItem = _componentsBrowserDataUtils.getFocusedItem(sections);

  return _extends({}, prevState, nextProps, { sections: sections, tabs: tabs, inputDelay: inputDelay, focusedItem: focusedItem });
}

/**
 * Select tab.
 *
 * @param {String} selector can be tab id or "prev" or "next"
 */
function selectTab(selector, state) {
  var tabs = state.tabs;

  var currIndex = _lodashArrayFindIndex2['default'](tabs, function (tab) {
    return tab.selected;
  });
  var newIndex = undefined;

  if (selector === 'next') {
    newIndex = currIndex + 1;
    if (!tabs[newIndex]) newIndex = 0;
  } else if (selector === 'prev') {
    newIndex = currIndex - 1;
    if (newIndex < 0) newIndex = tabs.length - 1;
  } else {
    newIndex = _lodashArrayFindIndex2['default'](tabs, function (tab) {
      return tab.id === selector;
    });
  }

  var id = tabs[newIndex].id;

  _componentsBrowserDataUtils.setSelectedTab(tabs, newIndex);
  var sections = getSections(state.data, id, state.maxItemsPerSectionInAll);
  setSelectedSection(sections, id);
  setFocusedItemAt(sections, id, 0);

  var service = _componentsBrowserDataUtils.findById(state.data.services, id);
  var filters = service ? [service.key] : [];
  var focusedItem = _componentsBrowserDataUtils.getFocusedItem(sections);

  return _extends({}, state, {
    tabs: tabs,
    sections: sections,
    filters: filters,
    focusedItem: focusedItem
  });
}

/**
 * Finds an element index in a list by selector "prev" or "next".
 * If selector goes to the undefined position, first or last element will be selected.
 */
function findIndexBySelector(selector, list, validation) {
  var currIndex = _lodashArrayFindIndex2['default'](list, validation);
  var index = undefined;

  if (selector === 'next') {
    index = list[currIndex + 1] ? currIndex + 1 : 0;
  }

  if (selector === 'prev') {
    index = list[currIndex - 1] ? currIndex - 1 : list.length - 1;
  }

  return index;
}

function focusAction(selector, state) {
  var actions = state.actions;

  var newIndex = findIndexBySelector(selector, actions, function (action) {
    return action === state.focusedAction;
  });
  return _extends({}, state, { focusedAction: state.actions[newIndex] });
}

function execAction(state) {
  var action = state.focusedAction;
  var item = state.focusedItem;

  if (action.type === 'insert') {
    state.onSelectItem({ item: item });
    return _extends({}, state, {
      filters: [],
      search: ''
    });
  }

  if (action.type === 'open') {
    var res = _lodashCollectionFind2['default'](state.data.results, function (_ref3) {
      var id = _ref3.id;
      return id === item.id;
    });
    // TODO make it MacGap compatible.
    window.open(res.url);
  }

  return state;
}

function navigate(action, state) {
  switch (action) {
    case 'select':
      if (state.focusedItem.type === 'filters') return state;
      if (state.focusedList === 'actions') return execAction(state);
      return _extends({}, state, { focusedList: 'actions' });
    case 'back':
      if (state.focusedList === 'objects') return state;
      return _extends({}, state, { focusedList: 'objects' });
    case 'prev':
    case 'next':
      if (state.focusedList === 'objects') {
        return focusItem(action, state);
      }
      if (state.focusedList === 'actions') {
        return focusAction(action, state);
      }
      break;
    default:
  }
}

var actions = [{
  type: 'insert',
  text: 'Insert into message',
  icon: 'comment'
}, {
  type: 'open',
  text: 'Open',
  icon: 'iconLink'
}];

var initialState = {
  height: 400,
  className: '',
  maxItemsPerSectionInAll: 5,
  isExternal: false,
  isLoading: false,
  canAddIntegrations: false,
  externalServicesInputDelay: 500,
  focusedList: 'objects',
  actions: actions,
  focusedAction: actions[0],
  onAddIntegration: _lodashUtilityNoop2['default'],
  onSelectItem: _lodashUtilityNoop2['default'],
  onSelectFilter: _lodashUtilityNoop2['default'],
  onDidMount: _lodashUtilityNoop2['default'],
  onChange: _lodashUtilityNoop2['default'],
  onAbort: _lodashUtilityNoop2['default'],
  onBlur: _lodashUtilityNoop2['default']
};

function reduce(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case types.CREATE_SEARCH_BROWSER_STATE:
      return createState(action.payload.props, state);
    case types.FOCUS_SEARCH_BROWSER_ITEM:
      return focusItem(action.payload.selector, state);
    case types.SELECT_SEARCH_BROWSER_TAB:
      return selectTab(action.payload.selector, state);
    case types.NAVIGATE_SEARCH_BROWSER:
      return navigate(action.payload.action, state);
    case types.SET_SEARCH_BROWSER_FILTERS:
    case types.SELECT_SEARCH_BROWSER_ITEM:
      return _extends({}, state, action.payload);
    default:
      return state;
  }
}

module.exports = exports['default'];