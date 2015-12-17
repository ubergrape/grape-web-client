'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _reactPureRender = require('react-pure-render');

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var Datalist = (function (_Component) {
  _inherits(Datalist, _Component);

  _createClass(Datalist, null, [{
    key: 'propTypes',
    value: {
      data: _react.PropTypes.array,
      className: _react.PropTypes.string,
      onDidMount: _react.PropTypes.func,
      onSelect: _react.PropTypes.func,
      sheet: _react.PropTypes.object.isRequired
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      data: [],
      className: '',
      onDidMount: _lodashUtilityNoop2['default'],
      onSelect: _lodashUtilityNoop2['default']
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

  Datalist.prototype.onMouseOver = function onMouseOver(item) {
    this.focus(item);
  };

  Datalist.prototype.onMouseDown = function onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault();
    this.props.onSelect(this.state.focused);
  };

  Datalist.prototype.createState = function createState(props) {
    var data = props.data;

    var focused = data[0];
    return { data: data, focused: focused };
  };

  Datalist.prototype.focus = function focus(id) {
    var _this = this;

    var data = this.state.data;

    var index = _lodashArrayFindIndex2['default'](data, function (item) {
      return item === _this.state.focused;
    });
    var item = undefined;

    if (typeof id == 'string') {
      if (id === 'next') index++;else if (id === 'prev') index--;
      item = data[index];
    } else item = id;

    if (!item) return;

    this.setState({ focused: item });
  };

  Datalist.prototype.renderItems = function renderItems(listItem, i) {
    var focused = listItem === this.state.focused;
    var _props$sheet$classes = this.props.sheet.classes;
    var item = _props$sheet$classes.item;
    var itemFocused = _props$sheet$classes.itemFocused;
    var icon = _props$sheet$classes.icon;
    var name = _props$sheet$classes.name;
    var note = _props$sheet$classes.note;
    var noteFocused = _props$sheet$classes.noteFocused;

    return _react2['default'].createElement(
      'div',
      {
        onMouseDown: this.onMouseDown.bind(this),
        onMouseOver: this.onMouseOver.bind(this, listItem),
        className: item + ' ' + (focused ? itemFocused : ''),
        key: i },
      _react2['default'].createElement(
        'span',
        { className: icon },
        listItem.icon
      ),
      _react2['default'].createElement(
        'span',
        { className: name },
        listItem.name
      ),
      _react2['default'].createElement(
        'span',
        { className: note + ' ' + (focused ? noteFocused : '') },
        listItem.note
      )
    );
  };

  Datalist.prototype.render = function render() {
    var data = this.state.data;

    if (!data.length) return null;

    var classes = this.props.sheet.classes;

    return _react2['default'].createElement(
      'div',
      { className: classes.container + ' ' + this.props.className },
      data.map(this.renderItems.bind(this))
    );
  };

  var _Datalist = Datalist;
  Datalist = _grapeWebLibJss.useSheet(_style2['default'])(Datalist) || Datalist;
  return Datalist;
})(_react.Component);

exports['default'] = Datalist;
module.exports = exports['default'];