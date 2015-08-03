'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jss = require('../jss');

var _reactPureRender = require('react-pure-render');

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var Datalist = (function (_Component) {
  _inherits(Datalist, _Component);

  _createClass(Datalist, null, [{
    key: 'defaultProps',
    value: {
      data: [],
      className: '',
      onDidMount: undefined,
      onSelect: undefined
    },
    enumerable: true
  }]);

  function Datalist(props) {
    _classCallCheck(this, _Datalist);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = this.createState(this.props);
  }

  Datalist.prototype.componentDidMount = function componentDidMount() {
    this.props.onDidMount(this);
  };

  Datalist.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps));
  };

  Datalist.prototype.render = function render() {
    var _this = this;

    var classes = this.props.sheet.classes;
    var data = this.state.data;

    if (!data.length) return null;

    return _react2['default'].createElement(
      'div',
      { className: classes.container + ' ' + this.props.className },
      data.map(function (item, i) {
        return _react2['default'].createElement(
          'div',
          {
            onMouseDown: _this.onMouseDown.bind(_this),
            onMouseOver: _this.onMouseOver.bind(_this, item),
            className: classes[item === _this.state.focused ? 'itemFocused' : 'item'],
            key: i },
          _react2['default'].createElement(
            'span',
            { className: classes.icon },
            item.icon
          ),
          _react2['default'].createElement(
            'span',
            { className: classes.name },
            item.name
          )
        );
      })
    );
  };

  Datalist.prototype.createState = function createState(props) {
    var data = props.data;

    var focused = data[0];
    return { data: data, focused: focused };
  };

  Datalist.prototype.focus = function focus(id) {
    var _this2 = this;

    var data = this.state.data;

    var index = _lodashArrayFindIndex2['default'](data, function (item) {
      return item === _this2.state.focused;
    });
    var item = undefined;

    if (typeof id == 'string') {
      if (id === 'next') index++;else if (id === 'prev') index--;
      item = data[index];
    } else item = id;

    if (!item) return;

    this.setState({ focused: item });
  };

  Datalist.prototype.onMouseOver = function onMouseOver(item) {
    this.focus(item);
  };

  Datalist.prototype.onMouseDown = function onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault();
    this.props.onSelect(this.state.focused);
  };

  var _Datalist = Datalist;
  Datalist = _jss.useSheet(_style2['default'])(Datalist) || Datalist;
  return Datalist;
})(_react.Component);

exports['default'] = Datalist;
module.exports = exports['default'];