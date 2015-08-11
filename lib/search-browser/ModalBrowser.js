'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _modalBrowserBrowser = require('../modal-browser/Browser');

var _modalBrowserBrowser2 = _interopRequireDefault(_modalBrowserBrowser);

var _Browser = require('./Browser');

var _Browser2 = _interopRequireDefault(_Browser);

var SearchModalBrowser = (function (_Component) {
  _inherits(SearchModalBrowser, _Component);

  function SearchModalBrowser() {
    _classCallCheck(this, SearchModalBrowser);

    _Component.apply(this, arguments);
  }

  SearchModalBrowser.prototype.render = function render() {
    return _react2['default'].createElement(_modalBrowserBrowser2['default'], _extends({}, this.props, { browser: _Browser2['default'] }));
  };

  return SearchModalBrowser;
})(_react.Component);

exports['default'] = SearchModalBrowser;
module.exports = exports['default'];