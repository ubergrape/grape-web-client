'use strict';

exports.__esModule = true;
exports.searchInputKeyPress = searchInputKeyPress;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _constantsActionTypes = require('../constants/actionTypes');

var types = _interopRequireWildcard(_constantsActionTypes);

function searchInputKeyPress(event) {
  return {
    type: types.SEARCH_INPUT_KEY_PRESS,
    payload: {
      event: event
    }
  };
}