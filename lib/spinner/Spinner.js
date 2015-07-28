'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jss = require('../jss');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var Spinner = (function (_Component) {
  _inherits(Spinner, _Component);

  _createClass(Spinner, null, [{
    key: 'defaultProps',
    value: {
      active: false,
      delay: 1000,
      image: undefined,
      overlay: false
    },
    enumerable: true
  }]);

  function Spinner(props) {
    _classCallCheck(this, _Spinner);

    _Component.call(this, props);
    this.state = this.createState(this.props);
  }

  Spinner.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    this.setState(this.createState(props));
  };

  Spinner.prototype.componentDidMount = function componentDidMount() {
    var _this = this;

    if (this.state.active) return;
    this.timeoutId = setTimeout(function () {
      _this.setState({ active: true });
    }, this.props.delay);
  };

  Spinner.prototype.componentWillUnmount = function componentWillUnmount() {
    clearTimeout(this.timeoutId);
  };

  Spinner.prototype.createState = function createState(props) {
    return _extends({}, props);
  };

  Spinner.prototype.render = function render() {
    if (!this.state.active) return null;
    var classes = this.props.sheet.classes;

    var backgroundImage = 'url(' + this.props.image + ')';
    var className = classes.spinner;
    if (this.props.overlay) className += ' ' + classes.overlay;
    // TODO use svg.
    return _react2['default'].createElement('div', { className: className, style: { backgroundImage: backgroundImage } });
  };

  var _Spinner = Spinner;
  Spinner = _jss.useSheet(_style2['default'])(Spinner) || Spinner;
  return Spinner;
})(_react.Component);

exports['default'] = Spinner;
module.exports = exports['default'];