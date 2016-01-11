'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = reduce;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _constantsActionTypes = require('../constants/actionTypes');

var types = _interopRequireWildcard(_constantsActionTypes);

var initialState = {};

function reduce(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case types.SEARCH_INPUT_KEY_PRESS:
      return _extends({}, state, action.payload);
    default:
      return state;
  }
}

module.exports = exports['default'];