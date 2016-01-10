'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFiniteList = require('react-finite-list');

var _reactFiniteList2 = _interopRequireDefault(_reactFiniteList);

var _grapeWebLibSvgIconsData = require('grape-web/lib/svg-icons/data');

var icons = _interopRequireWildcard(_grapeWebLibSvgIconsData);

var _grapeWebLibJss = require('grape-web/lib/jss');

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

  Actions.prototype.onSelect = function onSelect() /* action */{};

  Actions.prototype.renderItem = function renderItem(_ref) {
    var item = _ref.item;
    var focused = _ref.focused;
    var classes = this.props.sheet.classes;

    var backgroundImage = 'url(\'' + icons[item.icon] + '\')';
    var focusedClass = '';
    if (focused) {
      focusedClass = this.props.focused ? classes.actionFocused : classes.actionFocusedBg;
    }

    return _react2['default'].createElement(
      'div',
      { className: classes.action + ' ' + focusedClass },
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
      items: this.props.actions,
      renderItem: this.renderItem.bind(this),
      onSelect: this.onSelect.bind(this),
      ref: 'list' });
  };

  _createClass(Actions, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      actions: _react.PropTypes.array,
      focused: _react.PropTypes.bool
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      actions: [{
        type: 'attach',
        text: 'Attach to message',
        icon: 'comment'
      }, {
        type: 'open',
        text: 'Open',
        icon: 'iconLink'
      }],
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