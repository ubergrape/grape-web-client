'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _keyname = require('keyname');

var _keyname2 = _interopRequireDefault(_keyname);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _browserStyle = require('./browserStyle');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

var _tabsTabsWithControls = require('../tabs/TabsWithControls');

var _tabsTabsWithControls2 = _interopRequireDefault(_tabsTabsWithControls);

var _itemItem = require('./item/Item');

var _itemItem2 = _interopRequireDefault(_itemItem);

var _emptyEmpty = require('../empty/Empty');

var _emptyEmpty2 = _interopRequireDefault(_emptyEmpty);

var _grapeWebLibSpinnerSpinner = require('grape-web/lib/spinner/Spinner');

var _grapeWebLibSpinnerSpinner2 = _interopRequireDefault(_grapeWebLibSpinnerSpinner);

var _inputInput = require('../input/Input');

var _inputInput2 = _interopRequireDefault(_inputInput);

var _services = require('./services');

var services = _interopRequireWildcard(_services);

/**
 * Main search browser component.
 */

var Browser = (function (_Component) {
  _inherits(Browser, _Component);

  function Browser() {
    _classCallCheck(this, _Browser);

    _Component.apply(this, arguments);
  }

  Browser.prototype.componentDidMount = function componentDidMount() {
    this.props.onDidMount(this);
  };

  Browser.prototype.onFocusItem = function onFocusItem(_ref) {
    var id = _ref.id;

    if (this.props.focusedItem.id === id) return;
    this.props.focusSearchBrowserItem(id);
  };

  Browser.prototype.onSelectItem = function onSelectItem() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var id = _ref2.id;

    this.ignoreScheduledInput();
    this.props.selectSearchBrowserItem(id);
  };

  Browser.prototype.onSelectTab = function onSelectTab(_ref3) {
    var id = _ref3.id;

    this.props.selectSearchBrowserTab(id);
  };

  Browser.prototype.onKeyDown = function onKeyDown(e) {
    if (!this.props.data) return;

    this.ignoreScheduledInput();

    switch (_keyname2['default'](e.keyCode)) {
      case 'down':
        this.props.navigateSearchBrowser('next');
        e.preventDefault();
        break;
      case 'up':
        this.props.navigateSearchBrowser('prev');
        e.preventDefault();
        break;
      case 'enter':
        this.props.navigateSearchBrowser('select');
        e.preventDefault();
        break;
      case 'backspace':
        this.props.navigateSearchBrowser('back');
        e.preventDefault();
        break;
      case 'tab':
        this.props.selectSearchBrowserTab(e.shiftKey ? 'prev' : 'next');
        e.preventDefault();
        break;
      default:
    }
  };

  Browser.prototype.onInput = function onInput(query) {
    var _this = this;

    this.setState({
      search: query.search,
      filters: query.filters
    }, function () {
      var onInput = _this.props.onInput;
      var inputDelay = _this.state.inputDelay;

      if (!inputDelay) return onInput(query);
      clearTimeout(_this.onInputTimeoutId);
      _this.onInputTimeoutId = setTimeout(onInput.bind(null, query), inputDelay);
    });
  };

  Browser.prototype.onMouseDown = function onMouseDown(e) {
    // Avoids loosing focus and though caret position in input.
    e.preventDefault();
  };

  Browser.prototype.onAbort = function onAbort(data) {
    // After abortion we don't care about scheduled inputs.
    clearTimeout(this.onInputTimeoutId);
    this.props.onAbort(data);
  };

  // After selection we don't care about scheduled inputs.

  Browser.prototype.ignoreScheduledInput = function ignoreScheduledInput() {
    clearTimeout(this.onInputTimeoutId);
  };

  Browser.prototype.renderContent = function renderContent() {
    var _props = this.props;
    var sections = _props.sections;
    var data = _props.data;

    if (!data) return null;

    if (data.results.length && sections.length) return this.renderService(sections);

    var hasSearch = Boolean(_lodashObjectGet2['default'](data, 'search.text'));
    var hasService = Boolean(_lodashObjectGet2['default'](data, 'search.container'));

    if (hasSearch || hasService) return _react2['default'].createElement(_emptyEmpty2['default'], { text: 'Nothing found' });

    if (this.props.isExternal) {
      var text = 'Write the search term to search ' + data.search.service + '.';
      return _react2['default'].createElement(_emptyEmpty2['default'], { text: text });
    }

    // We have no search, no results and its not an external search.
    // Yet we can always render queries suggestions.
    return this.renderService(sections);
  };

  Browser.prototype.renderService = function renderService(data) {
    var Service = services.Default;
    return _react2['default'].createElement(Service, _extends({}, this.props, {
      Item: _itemItem2['default'],
      data: data,
      onFocus: this.onFocusItem.bind(this),
      onSelect: this.onSelectItem.bind(this) }));
  };

  Browser.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    var content = this.renderContent();
    var inlineStyle = {
      height: content ? this.props.height : 'auto'
    };

    return _react2['default'].createElement(
      'div',
      {
        className: classes.browser + ' ' + this.props.className,
        style: inlineStyle,
        onMouseDown: this.onMouseDown.bind(this),
        'data-test': 'search-browser' },
      _react2['default'].createElement(
        'div',
        { className: classes.inputContainer },
        _react2['default'].createElement('span', { className: classes.searchIcon }),
        _react2['default'].createElement(_inputInput2['default'], {
          onKeyDown: this.onKeyDown.bind(this),
          onInput: this.onInput.bind(this),
          onChangeFilters: this.props.onSelectFilter,
          focused: this.props.focused,
          filters: this.props.filters,
          search: this.props.search,
          className: classes.input,
          type: 'search',
          placeholder: 'Grape Search' })
      ),
      this.props.tabs && _react2['default'].createElement(_tabsTabsWithControls2['default'], { data: this.props.tabs, onSelect: this.onSelectTab.bind(this) }),
      content,
      this.props.isLoading && _react2['default'].createElement(_grapeWebLibSpinnerSpinner2['default'], { image: this.props.images.spinner })
    );
  };

  _createClass(Browser, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      onDidMount: _react.PropTypes.func,
      onSelectFilter: _react.PropTypes.func,
      onSelectItem: _react.PropTypes.func,
      onInput: _react.PropTypes.func,
      onAbort: _react.PropTypes.func,
      focusSearchBrowserItem: _react.PropTypes.func,
      selectSearchBrowserItem: _react.PropTypes.func,
      selectSearchBrowserTab: _react.PropTypes.func,
      navigateSearchBrowser: _react.PropTypes.func,
      focusedItem: _react.PropTypes.object,
      focused: _react.PropTypes.bool,
      data: _react.PropTypes.object,
      sections: _react.PropTypes.array,
      maxItemsPerSectionInAll: _react.PropTypes.number,
      container: _react.PropTypes.element,
      isExternal: _react.PropTypes.bool,
      externalServicesInputDelay: _react.PropTypes.number,
      isLoading: _react.PropTypes.bool,
      images: _react.PropTypes.object,
      height: _react.PropTypes.number,
      className: _react.PropTypes.string,
      tabs: _react.PropTypes.array,
      search: _react.PropTypes.string,
      filters: _react.PropTypes.array
    },
    enumerable: true
  }]);

  var _Browser = Browser;
  Browser = _grapeWebLibJss.useSheet(_browserStyle2['default'])(Browser) || Browser;
  return Browser;
})(_react.Component);

exports['default'] = Browser;
module.exports = exports['default'];