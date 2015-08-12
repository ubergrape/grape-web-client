'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _lodashFunctionDebounce = require('lodash/function/debounce');

var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

var _reactPureRender = require('react-pure-render');

var _jss = require('../jss');

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

var _gridStyle = require('./gridStyle');

var _gridStyle2 = _interopRequireDefault(_gridStyle);

/**
 * Items renderer/scroller.
 */

var Grid = (function (_Component) {
  _inherits(Grid, _Component);

  _createClass(Grid, null, [{
    key: 'defaultProps',
    value: {
      Item: undefined,
      className: '',
      data: undefined,
      section: {},
      onFocus: undefined,
      onSelect: undefined,
      onDidMount: undefined
    },
    enumerable: true
  }]);

  function Grid(props) {
    _classCallCheck(this, _Grid);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.sections = {};
    this.items = {};
    this.onScrollStop = _lodashFunctionDebounce2['default'](this.onScrollStop, 30);
  }

  Grid.prototype.componentWillUnmount = function componentWillUnmount() {
    this.sections = {};
    this.items = {};
  };

  Grid.prototype.componentDidMount = function componentDidMount() {
    var onDidMount = this.props.onDidMount;

    if (onDidMount) onDidMount(this);
  };

  Grid.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var currFocused = this.props.focusedItem;
    var prevFocused = prevProps.focusedItem;
    if (currFocused && prevFocused && prevFocused.id !== currFocused.id) {
      this.onFocus({ id: currFocused.id });
    }
  };

  Grid.prototype.render = function render() {
    var _this = this;

    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(
      'div',
      {
        className: classes.grid + ' ' + this.props.className,
        onScroll: this.onScroll.bind(this) },
      this.props.data.map(function (data) {
        return _react2['default'].createElement(_Section2['default'], _extends({}, data, _lodashObjectPick2['default'](_this.props, 'onSelect', 'Item'), _this.props.section, {
          onFocus: _this.onFocus.bind(_this),
          onInvisible: _this.onInvisible.bind(_this),
          onDidMount: _this.onSectionDidMount.bind(_this),
          visibilityContainment: _this,
          key: data.id }));
      })
    );
  };

  Grid.prototype.getSectionComponent = function getSectionComponent(id) {
    return this.sections[id];
  };

  Grid.prototype.getItemComponent = function getItemComponent(id) {
    var component = undefined;
    if (!id) return component;

    _lodashCollectionFind2['default'](this.sections, function (section) {
      component = _lodashCollectionFind2['default'](section.items, function (item) {
        return item.props.id === id;
      });
      return Boolean(component);
    });

    return component;
  };

  Grid.prototype.onFocus = function onFocus(data) {
    this.props.onFocus(data);
  };

  Grid.prototype.onInvisible = function onInvisible(item, visibilityRect) {
    if (this.scrolling) return;

    var viewPortNode = _react2['default'].findDOMNode(this);
    var itemNode = _react2['default'].findDOMNode(item);
    var itemTop = itemNode.offsetTop;

    // Scrolling up.
    var scrollTop = itemTop;

    // Scrolling down.
    if (visibilityRect.top) {
      var viewPortHeight = viewPortNode.offsetHeight;
      var itemHeight = this.itemHeight;
      if (!itemHeight) itemHeight = itemNode.offsetHeight;
      scrollTop = itemTop - viewPortHeight + itemHeight;
    }

    viewPortNode.scrollTop = scrollTop;
  };

  Grid.prototype.onScroll = function onScroll() {
    this.scrolling = true;
    this.onScrollStop();
  };

  Grid.prototype.onScrollStop = function onScrollStop() {
    this.scrolling = false;
  };

  Grid.prototype.onSectionDidMount = function onSectionDidMount(component) {
    this.sections[component.props.id] = component;
  };

  var _Grid = Grid;
  Grid = _jss.useSheet(_gridStyle2['default'])(Grid) || Grid;
  return Grid;
})(_react.Component);

exports['default'] = Grid;
module.exports = exports['default'];