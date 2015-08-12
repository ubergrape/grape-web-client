'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getSelectedSection = getSelectedSection;
exports.setSelectedSection = setSelectedSection;
exports.setFocusedItemAt = setFocusedItemAt;
exports.getTabs = getTabs;
exports.filtersToServiceId = filtersToServiceId;
exports.findById = findById;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _browserDataUtils = require('../browser/dataUtils');

var dataUtils = _interopRequireWildcard(_browserDataUtils);

var getFocusedItem = dataUtils.getFocusedItem;
exports.getFocusedItem = getFocusedItem;
var setFocusedItem = dataUtils.setFocusedItem;
exports.setFocusedItem = setFocusedItem;
var unsetFocusedItem = dataUtils.unsetFocusedItem;
exports.unsetFocusedItem = unsetFocusedItem;
var extractItems = dataUtils.extractItems;
exports.extractItems = extractItems;
var setSelectedTab = dataUtils.setSelectedTab;
exports.setSelectedTab = setSelectedTab;
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
  function get(data, serviceId) {
    var limitPerSection = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    var sections = [];
    var newData = addFilterObjects(_extends({}, data));

    // Group by sections.
    newData.results.forEach(function (result) {
      if (serviceId && result.service !== serviceId) return;

      var section = findById(sections, result.service);
      var service = findById(newData.services, result.service);

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
        result.detail.iconUrl = service.icon_url;
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
  }

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

  return get;
})();

exports.getSections = getSections;
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
    var next = findById(sections, id);
    if (next) next.selected = true;
  }
}

/**
 * Mark an item as focused. Unmark previously focused one.
 */

function setFocusedItemAt(sections, id, index) {
  if (!sections.length) return;
  unsetFocusedItem(sections);
  // Take first id when nothing passed.
  var section = findById(sections, id || sections[0].id);
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

function findById(collection, id) {
  return _lodashCollectionFind2['default'](collection, function (item) {
    return item.id === id;
  });
}