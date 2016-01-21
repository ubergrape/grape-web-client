'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFiniteList = require('react-finite-list');

var _reactFiniteList2 = _interopRequireDefault(_reactFiniteList);

var _grapeWebLibSvgIconsGetColored = require('grape-web/lib/svg-icons/getColored');

var _grapeWebLibSvgIconsGetColored2 = _interopRequireDefault(_grapeWebLibSvgIconsGetColored);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _actionsStyle = require('./actionsStyle');

var _actionsStyle2 = _interopRequireDefault(_actionsStyle);

/**
 * Document actions.
 */

var Actions = (function (_Component) {
  _inherits(Actions, _Component);

  function Actions() {
    _classCallCheck(this, _Actions);

    _Component.apply(this, arguments);
  }

  Actions.prototype.renderItem = function renderItem(_ref) {
    var item = _ref.item;
    var focused = _ref.focused;
    var classes = this.props.sheet.classes;

    var focusedClass = '';
    var iconColor = _grapeThemeDistBaseColors2['default'].grayBlueDark;
    if (focused) {
      focusedClass = this.props.focused ? classes.actionFocused : classes.actionFocusedInactive;
      if (this.props.focused) iconColor = _grapeThemeDistBaseColors2['default'].white;
    }

    var hovered = this.props.hoveredAction === item;
    if (hovered && !this.props.focused) {
      focusedClass = classes.actionFocused;
      iconColor = _grapeThemeDistBaseColors2['default'].white;
    }

    var icon = _grapeWebLibSvgIconsGetColored2['default']({ name: item.icon, color: iconColor });
    var backgroundImage = 'url(\'' + icon + '\')';

    return _react2['default'].createElement(
      'div',
      {
        className: classes.action + ' ' + focusedClass,
        onMouseEnter: this.props.onFocus.bind(null, item),
        onMouseLeave: this.props.onBlur.bind(null, item) },
      _react2['default'].createElement('span', { style: { backgroundImage: backgroundImage }, className: classes.icon }),
      _react2['default'].createElement(
        'span',
        { className: classes.text },
        item.text
      )
    );
  };

  Actions.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(_reactFiniteList2['default'], {
      className: classes.actions,
      renderItem: this.renderItem.bind(this),
      items: this.props.items,
      onSelect: this.props.onSelect,
      focused: this.props.focusedAction,
      ref: 'list' });
  };

  _createClass(Actions, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      items: _react.PropTypes.array,
      focused: _react.PropTypes.bool,
      focusedAction: _react.PropTypes.object,
      hoveredAction: _react.PropTypes.object,
      onFocus: _react.PropTypes.func,
      onBlur: _react.PropTypes.func,
      onSelect: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      focused: false
    },
    enumerable: true
  }]);

  var _Actions = Actions;
  Actions = _grapeWebLibJss.useSheet(_actionsStyle2['default'])(Actions) || Actions;
  return Actions;
})(_react.Component);

exports['default'] = Actions;
module.exports = exports['default'];