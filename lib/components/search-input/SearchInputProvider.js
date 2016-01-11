'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('../../redux');

var _selectors = require('../../selectors');

var _store = require('../../store');

var _store2 = _interopRequireDefault(_store);

var _actionNames = require('./actionNames');

var _actionNames2 = _interopRequireDefault(_actionNames);

// Temporary until a new input is implemented here.

var _inputInput = require('../input/Input');

var _inputInput2 = _interopRequireDefault(_inputInput);

var ConnectedSearchInput = _reactRedux.connect(_selectors.searchInputSelector, _redux.mapActionsToProps(_actionNames2['default']))(_inputInput2['default']);

var SearchInputProvider = (function (_Component) {
  _inherits(SearchInputProvider, _Component);

  function SearchInputProvider() {
    _classCallCheck(this, SearchInputProvider);

    _Component.apply(this, arguments);
  }

  SearchInputProvider.prototype.render = function render() {
    return _react2['default'].createElement(
      _reactRedux.Provider,
      { store: _store2['default'] },
      _react2['default'].createElement(ConnectedSearchInput, null)
    );
  };

  return SearchInputProvider;
})(_react.Component);

exports['default'] = SearchInputProvider;
module.exports = exports['default'];