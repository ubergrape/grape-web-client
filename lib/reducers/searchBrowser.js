'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = reduce;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _constantsActionTypes = require('../constants/actionTypes');

var types = _interopRequireWildcard(_constantsActionTypes);

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
  search: '',
  filters: [],
  actions: actions,
  focusedAction: actions[0],
  onAddIntegration: _lodashUtilityNoop2['default'],
  onSelectItem: _lodashUtilityNoop2['default'],
  onSelectFilter: _lodashUtilityNoop2['default'],
  onDidMount: _lodashUtilityNoop2['default'],
  onChange: _lodashUtilityNoop2['default'],
  onAbort: _lodashUtilityNoop2['default'],
  onBlur: _lodashUtilityNoop2['default'],
  onInput: _lodashUtilityNoop2['default']
};

function reduce(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case types.CREATE_SEARCH_BROWSER_STATE:
    case types.FOCUS_SEARCH_BROWSER_ITEM:
    case types.NAVIGATE_SEARCH_BROWSER:
    case types.FOCUS_SEARCH_BROWSER_ACTION:
    case types.HOVER_SEARCH_BROWSER_ACTION:
    case types.EXEC_SEARCH_BROWSER_ACTION:
    case types.SELECT_SEARCH_BROWSER_TAB:
    case types.SET_SEARCH_BROWSER_FILTERS:
    case types.SELECT_SEARCH_BROWSER_ITEM:
    case types.INPUT_SEARCH_BROWSER_SEARCH:
      return _extends({}, state, action.payload);
    case types.RESET_SEARCH_BROWSER_STATE:
      return initialState;
    default:
      return state;
  }
}

module.exports = exports['default'];