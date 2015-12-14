'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _reactPureRender = require('react-pure-render');

var _grapeWebLibJss = require('grape-web/lib/jss');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _queryConstants = require('../query/constants');

var _queryModel = require('../query/Model');

var _queryModel2 = _interopRequireDefault(_queryModel);

var _queryParse = require('../query/parse');

var _queryParse2 = _interopRequireDefault(_queryParse);

var Input = (function (_Component) {
  _inherits(Input, _Component);

  _createClass(Input, null, [{
    key: 'propTypes',
    value: {
      onInput: _react.PropTypes.func,
      onKeyDown: _react.PropTypes.func,
      onChangeFilters: _react.PropTypes.func,
      onBlur: _react.PropTypes.func,
      sheet: _react.PropTypes.object.isRequired,
      type: _react.PropTypes.string,
      focused: _react.PropTypes.bool,
      filters: _react.PropTypes.array,
      search: _react.PropTypes.string
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      onInput: _lodashUtilityNoop2['default'],
      onKeyDown: _lodashUtilityNoop2['default'],
      onChangeFilters: _lodashUtilityNoop2['default'],
      onBlur: _lodashUtilityNoop2['default'],
      type: undefined,
      focused: true,
      filters: undefined,
      search: undefined
    },
    enumerable: true
  }]);

  function Input(props) {
    _classCallCheck(this, _Input);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.query = new _queryModel2['default']({ onChange: this.onChangeQuery.bind(this) });
    this.query.set({
      trigger: _queryConstants.TYPES[this.props.type],
      filters: props.filters,
      search: props.search
    }, { silent: true });
    this.state = this.createState(props);
  }

  Input.prototype.componentDidMount = function componentDidMount() {
    if (this.state.focused) this.focus();
  };

  Input.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.filters && String(nextProps.filters) !== String(this.query.get('filters'))) {
      this.onChangeFilters(nextProps);
    }

    if (nextProps.search !== undefined && nextProps.search !== this.query.get('search')) {
      this.query.set('search', nextProps.search, { silent: true });
    }
    var nextState = this.createState(nextProps);
    this.setState(nextState);
  };

  Input.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.state.focused && !prevState.focused) {
      this.focus();
    }
  };

  Input.prototype.onInput = function onInput(e) {
    var queryStr = _queryConstants.TYPES[this.props.type] + e.target.value;
    var query = _queryParse2['default'](queryStr);
    this.query.set(query);
  };

  Input.prototype.onBlur = function onBlur() {
    this.setState({ focused: false });
    this.props.onBlur();
  };

  Input.prototype.onChangeQuery = function onChangeQuery() {
    var query = this.query.toJSON();
    this.setState({ value: query.key });
    this.props.onInput(query);
  };

  Input.prototype.onKeyDown = function onKeyDown(e) {
    e.detail = { query: this.query.toJSON() };
    this.props.onKeyDown(e);
  };

  Input.prototype.onChangeFilters = function onChangeFilters(_ref) {
    var filters = _ref.filters;

    this.query.set('filters', filters, { silent: true });
    this.props.onChangeFilters(this.state.value);
  };

  Input.prototype.createState = function createState(_ref2) {
    var focused = _ref2.focused;

    return {
      focused: focused,
      value: this.query.get('key')
    };
  };

  Input.prototype.focus = function focus() {
    return _reactDom2['default'].findDOMNode(this.refs.input).focus();
  };

  Input.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    return _react2['default'].createElement('input', {
      value: this.state.value,
      type: 'text',
      className: classes.input,
      ref: 'input',
      'data-test': 'input',
      onChange: this.onInput.bind(this),
      onKeyDown: this.onKeyDown.bind(this),
      onBlur: this.onBlur.bind(this) });
  };

  var _Input = Input;
  Input = _grapeWebLibJss.useSheet(_style2['default'])(Input) || Input;
  return Input;
})(_react.Component);

exports['default'] = Input;
module.exports = exports['default'];