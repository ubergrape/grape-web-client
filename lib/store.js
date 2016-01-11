'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('./reducers');

var reducers = _interopRequireWildcard(_reducers);

var createStoreWithMiddleware = _redux.applyMiddleware(_reduxThunk2['default'])(_redux.createStore);
var reducer = _redux.combineReducers(reducers);
var store = createStoreWithMiddleware(reducer);

exports['default'] = store;
module.exports = exports['default'];