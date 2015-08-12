'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRender = require('react-pure-render');

var _jss = require('../jss');

var _tabsStyle = require('./tabsStyle');

var _tabsStyle2 = _interopRequireDefault(_tabsStyle);

var _Tab = require('./Tab');

var _Tab2 = _interopRequireDefault(_Tab);

/**
 * Tabs container.
 */

var Tabs = (function (_Component) {
  _inherits(Tabs, _Component);

  function Tabs() {
    _classCallCheck(this, _Tabs);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Tabs.prototype.componentDidMount = function componentDidMount() {
    this.props.onDidMount(this);
  };

  Tabs.prototype.render = function render() {
    var _this = this;

    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(
      'div',
      { className: classes.tabs },
      _react2['default'].createElement(
        'ul',
        { className: classes.inner, ref: 'inner' },
        this.props.data.map(function (item) {
          var id = item.id || 'all';
          return _react2['default'].createElement(_Tab2['default'], _extends({}, item, {
            onSelect: _this.props.onSelect,
            onInvisible: _this.props.onInvisible,
            visibilityContainment: _this,
            key: id,
            ref: id }));
        })
      )
    );
  };

  Tabs.prototype.getInnerComponent = function getInnerComponent() {
    return this.refs.inner;
  };

  _createClass(Tabs, null, [{
    key: 'defaultProps',
    value: {
      data: undefined,
      onSelect: undefined,
      onInvisible: undefined,
      onDidMount: undefined
    },
    enumerable: true
  }]);

  var _Tabs = Tabs;
  Tabs = _jss.useSheet(_tabsStyle2['default'])(Tabs) || Tabs;
  return Tabs;
})(_react.Component);

exports['default'] = Tabs;
module.exports = exports['default'];