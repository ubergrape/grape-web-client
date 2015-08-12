'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRender = require('react-pure-render');

var _jss = require('../jss');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

/**
 * Button component
 */

var Button = (function (_Component) {
  _inherits(Button, _Component);

  function Button() {
    _classCallCheck(this, _Button);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Button.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(
      'button',
      {
        onClick: this.props.onClick,
        className: classes.button + ' ' + this.props.className },
      this.props.text
    );
  };

  _createClass(Button, null, [{
    key: 'defaultProps',
    value: {
      text: 'My Button',
      className: '',
      onClick: undefined
    },
    enumerable: true
  }]);

  var _Button = Button;
  Button = _jss.useSheet(_style2['default'])(Button) || Button;
  return Button;
})(_react.Component);

exports['default'] = Button;
module.exports = exports['default'];