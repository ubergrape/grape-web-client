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

var _SearchBrowserModal = require('./SearchBrowserModal');

var _SearchBrowserModal2 = _interopRequireDefault(_SearchBrowserModal);

var _boundActions = require('../../boundActions');

var ConnectedSearchBrowserModal = _reactRedux.connect(_selectors.searchBrowserSelector, _redux.mapActionsToProps(_actionNames2['default']))(_SearchBrowserModal2['default']);

var SearchBrowserModalProvider = (function (_Component) {
  _inherits(SearchBrowserModalProvider, _Component);

  function SearchBrowserModalProvider() {
    _classCallCheck(this, SearchBrowserModalProvider);

    _Component.apply(this, arguments);
  }

  SearchBrowserModalProvider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    _boundActions.createSearchBrowserState(nextProps);
  };

  SearchBrowserModalProvider.prototype.render = function render() {
    return _react2['default'].createElement(
      _reactRedux.Provider,
      { store: _store2['default'] },
      _react2['default'].createElement(ConnectedSearchBrowserModal, null)
    );
  };

  return SearchBrowserModalProvider;
})(_react.Component);

exports['default'] = SearchBrowserModalProvider;
module.exports = exports['default'];