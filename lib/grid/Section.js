'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _reactPureRender = require('react-pure-render');

var _jss = require('../jss');

var _sectionStyle = require('./sectionStyle');

/**
 * One grid section which has a title and items.
 */

var _sectionStyle2 = _interopRequireDefault(_sectionStyle);

var Section = (function (_Component) {
  _inherits(Section, _Component);

  _createClass(Section, null, [{
    key: 'defaultProps',
    value: {
      contentClassName: '',
      onDidMount: undefined
    },
    enumerable: true
  }]);

  function Section(props) {
    _classCallCheck(this, _Section);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.items = {};
  }

  Section.prototype.componentDidMount = function componentDidMount() {
    this.props.onDidMount(this);
  };

  Section.prototype.render = function render() {
    var _this = this;

    var classes = this.props.sheet.classes;
    var Item = this.props.Item;

    return _react2['default'].createElement(
      'section',
      null,
      _react2['default'].createElement(
        'header',
        { className: classes.header },
        this.props.label
      ),
      _react2['default'].createElement(
        'div',
        { className: this.props.contentClassName, ref: "content" },
        this.props.items.map(function (data, i) {
          var props = _lodashObjectPick2['default'](_this.props, 'onFocus', 'onSelect', 'onInvisible', 'visibilityContainment');
          return _react2['default'].createElement(Item, _extends({}, data, props, {
            key: 'item' + i,
            onDidMount: _this.onItemDidMount.bind(_this),
            onWillUnmount: _this.onItemWillUnmount.bind(_this) }));
        })
      )
    );
  };

  Section.prototype.getContentComponent = function getContentComponent() {
    return this.refs.content;
  };

  Section.prototype.onItemDidMount = function onItemDidMount(item) {
    this.items[item.props.id] = item;
  };

  Section.prototype.onItemWillUnmount = function onItemWillUnmount(item) {
    delete this.items[item.props.id];
  };

  var _Section = Section;
  Section = _jss.useSheet(_sectionStyle2['default'])(Section) || Section;
  return Section;
})(_react.Component);

exports['default'] = Section;
module.exports = exports['default'];