'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVisibilitySensor = require('react-visibility-sensor');

var _reactVisibilitySensor2 = _interopRequireDefault(_reactVisibilitySensor);

var _reactPureRender = require('react-pure-render');

var _jss = require('../jss');

var _tabStyle = require('./tabStyle');

/**
 * One tab tab.
 */

var style = _interopRequireWildcard(_tabStyle);

var Tab = (function (_Component) {
  _inherits(Tab, _Component);

  function Tab() {
    _classCallCheck(this, _Tab);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Tab.prototype.componentDidMount = function componentDidMount() {
    this.visibilityContainmentNode = _react2['default'].findDOMNode(this.props.visibilityContainment);
  };

  Tab.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.refs.sensor.check();
    }
  };

  Tab.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var _props = this.props;
    var icon = _props.icon;
    var amount = _props.amount;
    var label = _props.label;
    var selected = _props.selected;

    var className = selected ? classes.containerSelected : classes.container;
    return _react2['default'].createElement(
      _reactVisibilitySensor2['default'],
      {
        onChange: this.onVisibilityChange.bind(this),
        containment: this.visibilityContainmentNode,
        active: false,
        ref: 'sensor' },
      _react2['default'].createElement(
        'li',
        { className: className, onMouseDown: this.onMouseDown.bind(this) },
        icon,
        _react2['default'].createElement(
          'span',
          { className: classes.text },
          label,
          amount != null && _react2['default'].createElement(
            'span',
            { className: classes.amount },
            amount
          )
        )
      )
    );
  };

  Tab.prototype.checkVisibility = function checkVisibility() {
    this.refs.sensor.check();
  };

  Tab.prototype.onMouseDown = function onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault();
    this.props.onSelect({ id: this.props.id });
  };

  Tab.prototype.onVisibilityChange = function onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.selected) {
      this.props.onInvisible(this, visibilityRect);
    }
  };

  _createClass(Tab, null, [{
    key: 'defaultProps',
    value: {
      onSelect: undefined,
      onInvisible: undefined,
      getContainmentNode: undefined,
      selected: false,
      icon: undefined,
      label: undefined,
      amount: undefined,
      id: undefined
    },
    enumerable: true
  }]);

  var _Tab = Tab;
  Tab = _jss.useSheet(style.rules)(Tab) || Tab;
  return Tab;
})(_react.Component);

exports['default'] = Tab;
module.exports = exports['default'];