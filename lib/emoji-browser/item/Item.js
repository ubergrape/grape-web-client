'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _jss = require('../../jss');

var _style = require('./style');

var style = _interopRequireWildcard(_style);

/**
 * One grid item.
 */

var Item = (function (_Component) {
  _inherits(Item, _Component);

  _createClass(Item, null, [{
    key: 'defaultProps',
    value: {
      id: undefined,
      icon: undefined,
      onFocus: undefined,
      onSelect: undefined,
      onInvisible: undefined,
      onDidMount: undefined,
      onWillUnmount: undefined,
      visibilityContainment: undefined,
      focused: false
    },
    enumerable: true
  }]);

  function Item(props) {
    _classCallCheck(this, _Item);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = _extends({}, props);
  }

  Item.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    this.setState(_extends({}, newProps));
  };

  Item.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.state.focused !== prevState.focused) {
      this.refs.sensor.check();
      if (this.state.focused) this.onFocus();
    }
  };

  Item.prototype.componentDidMount = function componentDidMount() {
    this.visibilityContainmentNode = _react2['default'].findDOMNode(this.props.visibilityContainment);
    this.props.onDidMount(this);
  };

  Item.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.onWillUnmount(this);
  };

  Item.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var _state = this.state;
    var id = _state.id;
    var icon = _state.icon;
    var focused = _state.focused;

    return _react2['default'].createElement(
      _reactVisibilitySensor2['default'],
      {
        onChange: this.onVisibilityChange.bind(this),
        containment: this.visibilityContainmentNode,
        active: false,
        ref: 'sensor' },
      _react2['default'].createElement(
        'div',
        {
          className: focused ? classes.itemFocused : classes.item,
          onClick: this.onClick.bind(this),
          onMouseOver: this.onMouseOver.bind(this),
          key: id },
        icon
      )
    );
  };

  Item.prototype.onVisibilityChange = function onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.state.focused) {
      this.props.onInvisible(this, visibilityRect);
    }
  };

  Item.prototype.onFocus = function onFocus() {
    this.props.onFocus({ id: this.state.id });
  };

  Item.prototype.onClick = function onClick() {
    this.props.onSelect({ id: this.state.id });
  };

  Item.prototype.onMouseOver = function onMouseOver() {
    this.onFocus();
  };

  var _Item = Item;
  Item = _jss.useSheet(style.rules)(Item) || Item;
  return Item;
})(_react.Component);

exports['default'] = Item;
module.exports = exports['default'];