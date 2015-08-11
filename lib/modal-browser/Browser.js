'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRender = require('react-pure-render');

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _reactOverlaysLibModal = require('react-overlays/lib/Modal');

var _reactOverlaysLibModal2 = _interopRequireDefault(_reactOverlaysLibModal);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _jss = require('../jss');

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */

var ModalBrowser = (function (_Component) {
  _inherits(ModalBrowser, _Component);

  _createClass(ModalBrowser, null, [{
    key: 'defaultProps',
    value: {
      onAbort: _lodashUtilityNoop2['default'],
      browser: undefined
    },
    enumerable: true
  }]);

  function ModalBrowser(props) {
    _classCallCheck(this, _ModalBrowser);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = _extends({}, this.props, {
      show: true
    });
  }

  ModalBrowser.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    this.setState(newProps);
  };

  ModalBrowser.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    var Browser = this.props.browser;

    return _react2['default'].createElement(
      _reactOverlaysLibModal2['default'],
      {
        show: this.state.show,
        className: classes.modal,
        backdropClassName: classes.backdrop,
        onHide: this.onHide.bind(this) },
      _react2['default'].createElement(Browser, _extends({}, this.state, {
        className: classes.browser }))
    );
  };

  ModalBrowser.prototype.onHide = function onHide() {
    this.setState({ show: false });
    this.props.onAbort({ reason: 'modalHide' });
  };

  var _ModalBrowser = ModalBrowser;
  ModalBrowser = _jss.useSheet(_style2['default'])(ModalBrowser) || ModalBrowser;
  return ModalBrowser;
})(_react.Component);

exports['default'] = ModalBrowser;
module.exports = exports['default'];