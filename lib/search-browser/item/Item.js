'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactVisibilitySensor = require('react-visibility-sensor');

var _reactVisibilitySensor2 = _interopRequireDefault(_reactVisibilitySensor);

var _reactPureRender = require('react-pure-render');

var _jss = require('../../jss');

var _style = require('./style');

var style = _interopRequireWildcard(_style);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

/**
 * One grid item.
 */

var Item = (function (_Component) {
  _inherits(Item, _Component);

  function Item() {
    _classCallCheck(this, _Item);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Item.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.focused !== prevProps.focused) {
      this.refs.sensor.check();
      if (this.props.focused) this.onFocus();
    }
  };

  Item.prototype.componentDidMount = function componentDidMount() {
    this.visibilityContainmentNode = _react2['default'].findDOMNode(this.props.visibilityContainment);
  };

  Item.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var _props = this.props;
    var focused = _props.focused;
    var icon = _props.icon;
    var info = _props.info;

    var iconClassName = focused ? classes.iconFocused : classes.icon;
    var metaItemClassName = focused ? classes.metaItemFocused : classes.metaItem;
    // TODO: use svg icons, don't use global selectors.
    var iconClassNames = 'fa fa-lg fa-' + icon + ' ' + iconClassName;
    var state = utils.getState(this.props.detail);
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
          onClick: this.onClick.bind(this),
          className: focused ? classes.containerFocused : classes.container },
        _react2['default'].createElement(
          'div',
          { className: classes.iconContainer },
          _react2['default'].createElement('span', { className: iconClassNames })
        ),
        _react2['default'].createElement(
          'div',
          { className: classes.nameContainer },
          _react2['default'].createElement(
            'div',
            { className: classes.name },
            this.renderName()
          ),
          _react2['default'].createElement(
            'div',
            { className: classes.info },
            info
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: classes.metaContainer },
          this.props.date && _react2['default'].createElement(
            'span',
            { className: metaItemClassName },
            _moment2['default'](this.props.date).format('ddd, MMM D YYYY, h:mm a')
          ),
          state && _react2['default'].createElement(
            'span',
            { className: metaItemClassName },
            state
          )
        )
      )
    );
  };

  Item.prototype.renderName = function renderName() {
    var name = this.props.name;

    var matches = utils.findMatches(name, this.props.search);

    if (matches.length) {
      name = matches.map(function (match, i) {
        return _react2['default'].createElement(match.found ? 'b' : 'span', { key: i }, match.text);
      });
    }

    return name;
  };

  Item.prototype.onFocus = function onFocus() {
    this.props.onFocus({ id: this.props.id });
  };

  Item.prototype.onClick = function onClick() {
    if (this.props.focused) this.props.onSelect({ id: this.props.id });else this.onFocus();
  };

  Item.prototype.onVisibilityChange = function onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.focused) {
      this.props.onInvisible(this, visibilityRect);
    }
  };

  _createClass(Item, null, [{
    key: 'defaultProps',
    value: {
      id: undefined,
      name: undefined,
      date: undefined,
      detail: undefined,
      onFocus: undefined,
      onSelect: undefined,
      onInvisible: undefined,
      visibilityContainment: undefined,
      focused: false
    },
    enumerable: true
  }]);

  var _Item = Item;
  Item = _jss.useSheet(style.rules)(Item) || Item;
  return Item;
})(_react.Component);

exports['default'] = Item;
module.exports = exports['default'];