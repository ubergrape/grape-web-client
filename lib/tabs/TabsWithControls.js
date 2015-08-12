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

var _tabsWithControlsStyle = require('./tabsWithControlsStyle');

var _tabsWithControlsStyle2 = _interopRequireDefault(_tabsWithControlsStyle);

var _Tabs = require('./Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

/**
 * Tabs controls.
 */

var TabsWithControls = (function (_Component) {
  _inherits(TabsWithControls, _Component);

  _createClass(TabsWithControls, null, [{
    key: 'defaultProps',
    value: {
      data: undefined,
      onSelect: undefined
    },
    enumerable: true
  }]);

  function TabsWithControls(props) {
    _classCallCheck(this, _TabsWithControls);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = {
      leftEdge: true,
      rightEdge: true
    };
  }

  TabsWithControls.prototype.componentDidUpdate = function componentDidUpdate() {
    this.setEdgesState();
  };

  TabsWithControls.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var data = this.props.data;

    if (!data.length) return null;

    return _react2['default'].createElement(
      'ul',
      { className: classes.controls },
      !this.state.leftEdge && _react2['default'].createElement(
        'li',
        {
          onClick: this.onScrollPrev.bind(this),
          className: classes.prevArrow },
        _react2['default'].createElement(
          'span',
          null,
          '◀'
        )
      ),
      _react2['default'].createElement(_Tabs2['default'], {
        data: this.props.data,
        onSelect: this.props.onSelect,
        onInvisible: this.onInvisible.bind(this),
        onDidMount: this.onTabsDidMount.bind(this) }),
      !this.state.rightEdge && _react2['default'].createElement(
        'li',
        {
          onClick: this.onScrollNext.bind(this),
          className: classes.nextArrow },
        _react2['default'].createElement(
          'span',
          null,
          '▶'
        )
      )
    );
  };

  TabsWithControls.prototype.setEdgesState = function setEdgesState() {
    if (!this.props.data.length) return;

    var _state = this.state;
    var leftEdge = _state.leftEdge;
    var rightEdge = _state.rightEdge;

    var innerWidth = this.getInnerWidth();
    var outerWidth = this.getOuterWidth();

    if (innerWidth < outerWidth) {
      leftEdge = true;
      rightEdge = true;
    } else {
      var scrollLeft = this.getViewportNode().scrollLeft;
      leftEdge = scrollLeft === 0;
      rightEdge = scrollLeft + outerWidth === innerWidth;
    }

    if (leftEdge !== this.state.leftEdge || rightEdge !== this.state.rightEdge) {
      this.setState({ leftEdge: leftEdge, rightEdge: rightEdge });
    }
  };

  TabsWithControls.prototype.getInnerWidth = function getInnerWidth() {
    var inner = this.tabs.getInnerComponent();
    return _react2['default'].findDOMNode(inner).offsetWidth;
  };

  TabsWithControls.prototype.getOuterWidth = function getOuterWidth() {
    return _react2['default'].findDOMNode(this).offsetWidth;
  };

  TabsWithControls.prototype.getViewportNode = function getViewportNode() {
    return _react2['default'].findDOMNode(this.tabs);
  };

  TabsWithControls.prototype.onScrollNext = function onScrollNext() {
    var viewportNode = this.getViewportNode();
    viewportNode.scrollLeft += viewportNode.offsetWidth;
    this.setEdgesState();
  };

  TabsWithControls.prototype.onScrollPrev = function onScrollPrev() {
    var viewportNode = this.getViewportNode();
    viewportNode.scrollLeft -= viewportNode.offsetWidth;
    this.setEdgesState();
  };

  TabsWithControls.prototype.onInvisible = function onInvisible(item, visibilityRect) {
    var viewportNode = this.getViewportNode();
    var viewportWidth = viewportNode.offsetWidth;
    var itemNode = _react2['default'].findDOMNode(item);
    var itemLeft = itemNode.offsetLeft;
    if (!visibilityRect.left) itemLeft -= viewportWidth - itemNode.offsetWidth;
    viewportNode.scrollLeft = itemLeft;
    this.setEdgesState();
  };

  TabsWithControls.prototype.onTabsDidMount = function onTabsDidMount(tabs) {
    this.tabs = tabs;
  };

  var _TabsWithControls = TabsWithControls;
  TabsWithControls = _jss.useSheet(_tabsWithControlsStyle2['default'])(TabsWithControls) || TabsWithControls;
  return TabsWithControls;
})(_react.Component);

exports['default'] = TabsWithControls;
module.exports = exports['default'];