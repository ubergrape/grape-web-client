'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _redux = require('redux');

var _store = require('./store');

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

delete actions.__esModule;
exports['default'] = _redux.bindActionCreators(actions, _store.dispatch);
module.exports = exports['default'];