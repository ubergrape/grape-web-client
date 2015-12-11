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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

var _lodashCollectionFilter = require('lodash/collection/filter');

var _lodashCollectionFilter2 = _interopRequireDefault(_lodashCollectionFilter);

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashStringCapitalize = require('lodash/string/capitalize');

var _lodashStringCapitalize2 = _interopRequireDefault(_lodashStringCapitalize);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _keyname = require('keyname');

var _keyname2 = _interopRequireDefault(_keyname);

var _reactPureRender = require('react-pure-render');

var _searchBrowserBrowser = require('../search-browser/Browser');

var _searchBrowserBrowser2 = _interopRequireDefault(_searchBrowserBrowser);

var _emojiBrowserBrowser = require('../emoji-browser/Browser');

var _emojiBrowserBrowser2 = _interopRequireDefault(_emojiBrowserBrowser);

var _objectsStyle = require('../objects/style');

var objectStyle = _interopRequireWildcard(_objectsStyle);

var _objects = require('../objects');

var objects = _interopRequireWildcard(_objects);

var _highlightedTextareaHighlightedTextarea = require('../highlighted-textarea/HighlightedTextarea');

var _highlightedTextareaHighlightedTextarea2 = _interopRequireDefault(_highlightedTextareaHighlightedTextarea);

var _maxSizeMaxSize = require('../max-size/MaxSize');

var _maxSizeMaxSize2 = _interopRequireDefault(_maxSizeMaxSize);

var _datalistDatalist = require('../datalist/Datalist');

var _datalistDatalist2 = _interopRequireDefault(_datalistDatalist);

var _mentionsMentions = require('../mentions/mentions');

var mentions = _interopRequireWildcard(_mentionsMentions);

var _queryConstants = require('../query/constants');

var _queryModel = require('../query/Model');

var _queryModel2 = _interopRequireDefault(_queryModel);

var _globalEventGlobalEvent = require('../global-event/GlobalEvent');

var _globalEventGlobalEvent2 = _interopRequireDefault(_globalEventGlobalEvent);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var PUBLIC_METHODS = ['setTextContent', 'getTextContent'];

/**
 * Uses all types of auto completes to provide end component.
 */

var Input = (function (_Component) {
  _inherits(Input, _Component);

  _createClass(Input, null, [{
    key: 'propTypes',
    value: {
      onDidMount: _react.PropTypes.func.isRequired,
      container: _react.PropTypes.object,
      isLoading: _react.PropTypes.bool,
      hasIntegrations: _react.PropTypes.bool,
      canAddIntegrations: _react.PropTypes.bool,
      placeholder: _react.PropTypes.string,
      disabled: _react.PropTypes.bool,
      sheet: _react.PropTypes.object.isRequired,
      customEmojis: _react.PropTypes.object,
      images: _react.PropTypes.object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      maxCompleteItems: 12,
      browser: undefined,
      data: undefined,
      images: {},
      contentObjects: [],
      customEmojis: undefined,
      placeholder: undefined,
      focused: false,
      disabled: false,
      hasIntegrations: false,
      canAddIntegrations: true,
      isLoading: false,
      onAbort: undefined,
      onEditPrevious: undefined,
      onSubmit: undefined,
      onAddSearchBrowserIntegration: _lodashUtilityNoop2['default'],
      onInsertItem: _lodashUtilityNoop2['default'],
      onDidMount: _lodashUtilityNoop2['default']
    },
    enumerable: true
  }]);

  function Input(props) {
    _classCallCheck(this, _Input);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.query = new _queryModel2['default']({ onChange: this.onChangeQuery.bind(this) });
    this.exposePublicMethods();
    this.state = this.createState(this.props);
  }

  Input.prototype.componentDidMount = function componentDidMount() {
    objectStyle.sheet.attach();
    this.setTrigger(this.state.browser);
    var onDidMount = this.props.onDidMount;

    if (onDidMount) onDidMount(this);
  };

  Input.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var newEmojiSheet = _lodashObjectGet2['default'](nextProps, 'images.emojiSheet');
    var currEmojiSheet = _lodashObjectGet2['default'](this.props, 'images.emojiSheet');
    if (newEmojiSheet !== currEmojiSheet) {
      _emojiBrowserBrowser2['default'].init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis
      });
    }

    this.setState(this.createState(nextProps));
  };

  Input.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
    if (nextState.browser !== this.state.browser) {
      this.setTrigger(nextState.browser);
    }
  };

  Input.prototype.componentWillUnmount = function componentWillUnmount() {
    objectStyle.sheet.detach();
  };

  Input.prototype.onEditPrevious = function onEditPrevious() {
    this.emit('editPrevious');
  };

  Input.prototype.onSubmit = function onSubmit(data) {
    this.query.reset();
    this.emit('submit', data);
  };

  Input.prototype.onAbort = function onAbort() {
    var _this = this;

    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var currentBrowser = this.state.browser;
    this.closeBrowser({ textareaFocused: true }, function () {
      _this.emit('abort', _extends({}, data, { browser: currentBrowser }));
    });
  };

  Input.prototype.onSelectSearchBrowserItem = function onSelectSearchBrowserItem(_ref) {
    var item = _ref.item;
    var query = _ref.query;

    this.insertItem(item, query);
  };

  Input.prototype.onSelectSearchBrowserFilter = function onSelectSearchBrowserFilter(query) {
    this.emit('selectFilter', query);
  };

  Input.prototype.onSelectEmojiBrowserItem = function onSelectEmojiBrowserItem(_ref2) {
    var item = _ref2.item;
    var query = _ref2.query;

    this.insertItem(item, query);
  };

  Input.prototype.onSelectDatalistItem = function onSelectDatalistItem(item) {
    this.insertItem(item, this.query.toJSON());
  };

  Input.prototype.onAddSearchBrowserIntegration = function onAddSearchBrowserIntegration() {
    var _this2 = this;

    this.closeBrowser(null, function () {
      _this2.emit('addIntegration');
    });
  };

  Input.prototype.onInsertItem = function onInsertItem(item, query) {
    var type = item.type;
    var service = item.service;

    var rank = 0;

    var results = _lodashObjectGet2['default'](this.state, 'data.results');
    if (!_lodashLangIsEmpty2['default'](results)) {
      var resultsWithoutFilters = _lodashCollectionFilter2['default'](results, function (res) {
        return res.type !== 'filters';
      });
      var index = _lodashArrayFindIndex2['default'](resultsWithoutFilters, function (res) {
        return res.id === item.id;
      });
      rank = index + 1;
      service = resultsWithoutFilters[index].service;
    }

    this.emit('insertItem', { query: query, type: type, service: service, rank: rank });
  };

  Input.prototype.onDidMount = function onDidMount(name, ref) {
    this[name] = ref;
  };

  Input.prototype.onKeyDown = function onKeyDown(e) {
    switch (this.state.browser) {
      case 'user':
        this.navigateDatalist(e);
        break;
      default:
    }
  };

  Input.prototype.onBlurBrowser = function onBlurBrowser() {
    var _this3 = this;

    this.blurTimeoutId = setTimeout(function () {
      _this3.closeBrowser();
    }, 50);
  };

  Input.prototype.onBlurWindow = function onBlurWindow() {
    clearTimeout(this.blurTimeoutId);
  };

  Input.prototype.onChangeQuery = function onChangeQuery(newQueryStr) {
    this.textarea.addQueryString(newQueryStr);
  };

  Input.prototype.onInputSearchBrowser = function onInputSearchBrowser(data) {
    this.emit('complete', data);
    this.emit('change');
  };

  Input.prototype.onInputResize = function onInputResize() {
    this.emit('resize');
  };

  Input.prototype.onChangeInput = function onChangeInput() {
    var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (query) {
      // If it is a browser trigger, we don't reopen browser, but let user type
      // whatever he wants.
      // If its a mentioning, user types the search.
      // TODO migrate mentioning to the browser.
      if (!query.key || !utils.isBrowserType(query.trigger)) {
        this.query.set(query, { silent: true });
        this.emit('complete', this.query.toJSON());
      }
    } else if (!this.query.isEmpty()) {
      // Query has been removed or caret position changed, for datalist only.
      this.query.reset();
      if (this.state.browser) this.onAbort({ reason: 'deleteTrigger' });
    }
    this.emit('change');
  };

  Input.prototype.setTrigger = function setTrigger(browser) {
    if (!browser) return;
    this.query.set('trigger', _queryConstants.TYPES[browser]);
  };

  Input.prototype.getTextContent = function getTextContent() {
    return this.textarea ? this.textarea.getTextWithMarkdown() : '';
  };

  Input.prototype.setTextContent = function setTextContent(text, options) {
    this.query.reset();
    this.textarea.setTextContent(text, options);
  };

  Input.prototype.exposePublicMethods = function exposePublicMethods() {
    var _this4 = this;

    var container = this.props.container;

    if (!container) return;
    PUBLIC_METHODS.forEach(function (method) {
      return container[method] = _this4[method].bind(_this4);
    });
  };

  Input.prototype.createState = function createState(nextProps) {
    var state = _lodashObjectPick2['default'](nextProps, 'browser', 'data', 'isLoading');
    state.textareaFocused = nextProps.focused;
    if (state.browser === 'user') state.data = mentions.map(state.data);
    if (_lodashLangIsArray2['default'](state.data)) state.data = state.data.slice(0, nextProps.maxCompleteItems);
    state.query = this.query.toJSON();
    var canShowBrowser = utils.canShowBrowser(this.state, state);
    if (!canShowBrowser) state.browser = null;
    state.browserOpened = this.state ? this.state.browserOpened : false;
    if (canShowBrowser) state.browserOpened = true;
    return state;
  };

  Input.prototype.closeBrowser = function closeBrowser(state, callback) {
    this.setState(_extends({
      browser: null,
      browserOpened: false
    }, state), callback);
  };

  /**
   * Keyboard navigation for the datalist (mention, emoji).
   */

  Input.prototype.navigateDatalist = function navigateDatalist(e) {
    var datalist = this.datalist;

    if (!datalist) return;

    switch (_keyname2['default'](e.keyCode)) {
      case 'down':
      case 'tab':
        datalist.focus('next');
        e.preventDefault();
        break;
      case 'up':
        datalist.focus('prev');
        e.preventDefault();
        break;
      case 'enter':
        this.insertItem(datalist.state.focused);
        e.preventDefault();
        break;
      default:
    }
  };

  Input.prototype.insertItem = function insertItem(item, query) {
    if (item) {
      var results = _lodashObjectGet2['default'](this.state, 'data.results');
      var data = _lodashCollectionFind2['default'](results, function (res) {
        return res.id === item.id;
      }) || item;
      var object = objects.create(data.type, data);
      this.setState({ contentObjects: [].concat(this.state.contentObjects, [object]) });
      this.replaceQuery(object);
    }
    this.onInsertItem(item, query);
    this.closeBrowser({ textareaFocused: true });
    this.query.reset();
  };

  Input.prototype.replaceQuery = function replaceQuery(replacement) {
    this.setState({ textareaFocused: true });
    this.textarea.replaceQuery(replacement);
  };

  Input.prototype.insertQuery = function insertQuery() {
    this.setState({ textareaFocused: true });
  };

  /**
   * Emit DOM event.
   */

  Input.prototype.emit = function emit(type, data) {
    var capType = _lodashStringCapitalize2['default'](type);
    var name = 'grape' + capType;
    var event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: data
    });
    _reactDom2['default'].findDOMNode(this).dispatchEvent(event);
    name = 'on' + capType;
    var callback = this.props[name];
    if (callback) callback(data);
  };

  Input.prototype.renderBrowser = function renderBrowser(options) {
    var _state = this.state;
    var browser = _state.browser;
    var browserOpened = _state.browserOpened;
    var data = _state.data;

    if (!browser || !browserOpened) return null;

    if (browser === 'search') {
      return _react2['default'].createElement(_searchBrowserBrowser2['default'], _extends({}, options, {
        data: data,
        isLoading: this.props.isLoading,
        hasIntegrations: this.props.hasIntegrations,
        canAddIntegrations: this.props.canAddIntegrations,
        onAbort: this.onAbort.bind(this),
        onSelectItem: this.onSelectSearchBrowserItem.bind(this),
        onSelectFilter: this.onSelectSearchBrowserFilter.bind(this),
        onAddIntegration: this.onAddSearchBrowserIntegration.bind(this),
        onInput: this.onInputSearchBrowser.bind(this),
        onBlur: this.onBlurBrowser.bind(this),
        onDidMount: this.onDidMount.bind(this, 'browser') }));
    }

    if (browser === 'emoji') {
      return _react2['default'].createElement(_emojiBrowserBrowser2['default'], _extends({}, options, {
        customEmojis: this.props.customEmojis,
        onAbort: this.onAbort.bind(this),
        onSelectItem: this.onSelectEmojiBrowserItem.bind(this),
        onBlur: this.onBlurBrowser.bind(this),
        onDidMount: this.onDidMount.bind(this, 'browser') }));
    }

    return _react2['default'].createElement(_datalistDatalist2['default'], _extends({}, options, {
      data: data,
      onSelect: this.onSelectDatalistItem.bind(this),
      onDidMount: this.onDidMount.bind(this, 'datalist') }));
  };

  Input.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var data = this.state.data;

    var isExternal = utils.isExternalSearch(data);
    var browser = this.renderBrowser({
      isExternal: isExternal,
      className: classes.browser,
      images: this.props.images
    });

    return _react2['default'].createElement(
      'div',
      {
        onKeyDown: this.onKeyDown.bind(this),
        className: classes.input,
        'data-test': 'grape-input' },
      _react2['default'].createElement(_globalEventGlobalEvent2['default'], { event: 'blur', handler: this.onBlurWindow.bind(this) }),
      _react2['default'].createElement(
        'div',
        { className: classes.completeWrapper, 'data-test': 'complete-wrapper' },
        browser
      ),
      _react2['default'].createElement(
        _maxSizeMaxSize2['default'],
        {
          onResize: this.onInputResize.bind(this) },
        _react2['default'].createElement(_highlightedTextareaHighlightedTextarea2['default'], {
          onAbort: this.onAbort.bind(this),
          onResize: this.onInputResize.bind(this),
          onChange: this.onChangeInput.bind(this),
          onSubmit: this.onSubmit.bind(this),
          onEditPrevious: this.onEditPrevious.bind(this),
          onDidMount: this.onDidMount.bind(this, 'textarea'),
          browser: this.state.browser,
          placeholder: this.props.placeholder,
          disabled: this.props.disabled,
          focused: this.state.textareaFocused,
          content: this.getTextContent() })
      )
    );
  };

  var _Input = Input;
  Input = _grapeWebLibJss.useSheet(_style2['default'])(Input) || Input;
  return Input;
})(_react.Component);

exports['default'] = Input;
module.exports = exports['default'];