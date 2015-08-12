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

var _iconStyle = require('./iconStyle');

var _iconStyle2 = _interopRequireDefault(_iconStyle);

/**
 * Styled icon component.
 */

var Icon = (function (_Component) {
  _inherits(Icon, _Component);

  function Icon() {
    _classCallCheck(this, _Icon);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Icon.prototype.render = function render() {
    return(
      // Space inside is required for webkit browsers. Otherwise icon won't get
      // removed by backspace within contenteditable. Precondition is some text before.
      _react2['default'].createElement(
        'i',
        {
          className: this.props.className || this.props.sheet.classes.icon,
          style: this.props.style,
          title: this.props.name,
          'data-object': this.props.name },
        ' '
      )
    );
  };

  _createClass(Icon, null, [{
    key: 'defaultProps',
    value: {
      name: undefined,
      style: undefined,
      className: undefined
    },
    enumerable: true
  }]);

  var _Icon = Icon;
  Icon = _jss.useSheet(_iconStyle2['default'])(Icon) || Icon;
  return Icon;
})(_react.Component);

exports['default'] = Icon;
module.exports = exports['default'];