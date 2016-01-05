'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactOverlaysLibModal = require('react-overlays/lib/Modal');

var _reactOverlaysLibModal2 = _interopRequireDefault(_reactOverlaysLibModal);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _Browser = require('./Browser');

var _Browser2 = _interopRequireDefault(_Browser);

var _modalStyle = require('./modalStyle');

var _modalStyle2 = _interopRequireDefault(_modalStyle);

// Those methods will lead to ModalBrowser being removed from tree,
// however the Modal component needs to get show: false
var proxiMethodsToHideModal = ['onHide', 'onAbort', 'onSelectItem', 'onAddIntegration'];

var ModalBrowser = (function (_Component) {
  _inherits(ModalBrowser, _Component);

  _createClass(ModalBrowser, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      onAbort: _react.PropTypes.func
    },
    enumerable: true
  }]);

  function ModalBrowser(props) {
    var _this = this;

    _classCallCheck(this, _ModalBrowser);

    _Component.call(this, props);
    this.state = { show: true };
    this.proxyCallbacksMap = proxiMethodsToHideModal.reduce(function (map, method) {
      map[method] = _this.proxyCallback.bind(_this, method);
      return map;
    }, {});
  }

  ModalBrowser.prototype.onHideModal = function onHideModal() {
    this.setState({ show: false });
  };

  ModalBrowser.prototype.proxyCallback = function proxyCallback(method) {
    var _this2 = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.setState({ show: false }, function () {
      var _props;

      (_props = _this2.props)[method].apply(_props, args);
    });
  };

  ModalBrowser.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(
      _reactOverlaysLibModal2['default'],
      {
        show: this.state.show,
        className: classes.modal,
        backdropClassName: classes.backdrop,
        onHide: this.onHideModal.bind(this) },
      _react2['default'].createElement(_Browser2['default'], _extends({}, this.props, {
        className: classes.browser
      }, this.proxyCallbacksMap))
    );
  };

  var _ModalBrowser = ModalBrowser;
  ModalBrowser = _grapeWebLibJss.useSheet(_modalStyle2['default'])(ModalBrowser) || ModalBrowser;
  return ModalBrowser;
})(_react.Component);

exports['default'] = ModalBrowser;
module.exports = exports['default'];