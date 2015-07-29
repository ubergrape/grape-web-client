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

var Input = (function (_Component) {
  _inherits(Input, _Component);

  _createClass(Input, null, [{
    key: 'defaultProps',
    value: {
      onInput: undefined,
      onKeyDown: undefined,
      delay: undefined
    },
    enumerable: true
  }]);

  function Input(props) {
    _classCallCheck(this, _Input);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Input.prototype.componentDidMount = function componentDidMount() {
    this.focus();
  };

  Input.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    return _react2['default'].createElement('input', {
      type: "text",
      className: classes.input,
      ref: "input",
      onChange: this.onInputDebounced.bind(this),
      onKeyDown: this.props.onKeyDown });
  };

  Input.prototype.focus = function focus() {
    return _react2['default'].findDOMNode(this.refs.input).focus();
  };

  Input.prototype.onInput = function onInput(e) {
    var value = e.target.value;

    this.props.onInput({ value: value });
  };

  Input.prototype.onInputDebounced = function onInputDebounced(e) {
    var delay = this.props.delay;

    if (!delay) return this.onInput(e);
    clearTimeout(this.inputTimeoutId);
    this.inputTimeoutId = setTimeout(this.onInput.bind(this, e.nativeEvent), delay);
  };

  var _Input = Input;
  Input = _jss.useSheet(_style2['default'])(Input) || Input;
  return Input;
})(_react.Component);

exports['default'] = Input;
module.exports = exports['default'];