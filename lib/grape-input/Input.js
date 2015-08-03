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

var _jss = require('../jss');

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

var _editableEditable = require('../editable/Editable');

var _editableEditable2 = _interopRequireDefault(_editableEditable);

var _datalistDatalist = require('../datalist/Datalist');

var _datalistDatalist2 = _interopRequireDefault(_datalistDatalist);

var _mentionsMentions = require('../mentions/mentions');

var mentions = _interopRequireWildcard(_mentionsMentions);

var _queryConstants = require('../query/constants');

var _queryModel = require('../query/Model');

var _queryModel2 = _interopRequireDefault(_queryModel);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _utils = require('./utils');

/**
 * Uses all types of auto completes and content editable to provide end component.
 */

var utils = _interopRequireWildcard(_utils);

var Input = (function (_Component) {
  _inherits(Input, _Component);

  _createClass(Input, null, [{
    key: 'defaultProps',
    value: {
      maxCompleteItems: 12,
      changeDelay: 500,
      type: undefined,
      data: undefined,
      images: {},
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
      onComplete: undefined,
      onChange: undefined,
      onAddIntegration: undefined,
      onFilterSelect: undefined,
      onSearch: undefined,
      onInsertItem: undefined,
      onFocus: undefined,
      onBlur: undefined,
      onDidMount: undefined
    },
    enumerable: true
  }]);

  function Input(props) {
    _classCallCheck(this, _Input);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.query = new _queryModel2['default']({ onChange: this.onQueryChange.bind(this) });
    this.exposePublicMethods();
    this.onWindowBlur = this.onWindowBlur.bind(this);
    this.state = this.createState(this.props);
  }

  Input.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var newEmojiSheet = _lodashObjectGet2['default'](nextProps, 'images.emojiSheet');
    var currEmojiSheet = _lodashObjectGet2['default'](this.props, 'images.emojiSheet');
    if (newEmojiSheet !== currEmojiSheet) {
      _emojiBrowserBrowser2['default'].init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis
      });
    }

    var nextState = this.createState(nextProps);

    if (nextState.type && nextState.type !== this.state.type) {
      this.onSearch({ type: nextState.type });
    }

    this.setState(nextState);
  };

  Input.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener('blur', this.onWindowBlur);
    objectStyle.sheet.attach();
    var onDidMount = this.props.onDidMount;

    if (onDidMount) onDidMount(this);
  };

  Input.prototype.componentDidUnmount = function componentDidUnmount() {
    window.removeEventListener('blur', this.onWindowBlur);
    objectStyle.sheet.detach();
  };

  Input.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var type = this.state.type;

    if (type && type !== prevState.type) {
      // Ensure a trigger inserted. For e.g. when triggering emoji
      // browser via icon, there might be no trigger in editable.
      this.query.set('trigger', _queryConstants.TYPES[type]);
    }
  };

  Input.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var data = this.state.data;

    var isExternal = utils.isExternalSearch(data);
    var viewer = this.getViewer({
      isExternal: isExternal,
      className: classes.browser,
      images: this.props.images
    });
    return _react2['default'].createElement(
      'div',
      {
        onKeyDown: this.onKeyDown.bind(this),
        className: classes.input,
        'data-test': 'input' },
      _react2['default'].createElement(
        'div',
        { className: classes.completeWrapper, 'data-test': 'complete-wrapper' },
        viewer
      ),
      _react2['default'].createElement(_editableEditable2['default'], {
        placeholder: this.props.placeholder,
        disabled: this.props.disabled,
        focused: this.state.focused,
        insertAnimationDuration: objectStyle.INSERT_ANIMATION_DURATION,
        onAbort: this.onAbort.bind(this),
        onEditPrevious: this.onEditPrevious.bind(this),
        changeDelay: isExternal ? this.props.changeDelay : undefined,
        onSubmit: this.onSubmit.bind(this),
        onChange: this.onChange.bind(this),
        onFocus: this.onFocus.bind(this),
        onBlur: this.onBlur.bind(this),
        onDidMount: this.onDidMount.bind(this, 'editable') })
    );
  };

  Input.prototype.createState = function createState(nextProps) {
    var state = _lodashObjectPick2['default'](nextProps, 'focused', 'type', 'data', 'disabled');
    if (state.type === 'user') state.data = mentions.map(state.data);
    if (_lodashLangIsArray2['default'](state.data)) state.data = state.data.slice(0, nextProps.maxCompleteItems);
    state.query = this.query.toJSON();
    var canSuggest = utils.canSuggest(this.state, state);
    if (!canSuggest) state.type = null;

    return state;
  };

  Input.prototype.exposePublicMethods = function exposePublicMethods() {
    var _this = this;

    var container = this.props.container;

    if (!container) return;
    ['setTextContent', 'getTextContent'].forEach(function (method) {
      container[method] = _this[method].bind(_this);
    });
  };

  Input.prototype.getViewer = function getViewer(options) {
    var _state = this.state;
    var type = _state.type;
    var data = _state.data;

    if (!type) return null;

    var query = this.query.toJSON();

    if (type === 'search') {
      return _react2['default'].createElement(_searchBrowserBrowser2['default'], _extends({}, options, {
        data: data,
        serviceId: utils.detectService(query, data),
        isLoading: this.props.isLoading,
        hasIntegrations: this.props.hasIntegrations,
        canAddIntegrations: this.props.canAddIntegrations,
        onSelectItem: this.onSelectSearchBrowserItem.bind(this),
        onSelectTab: this.onFacetChange.bind(this),
        onAddIntegration: this.onAddIntegration.bind(this),
        onDidMount: this.onDidMount.bind(this, 'browser') }));
    }

    if (type === 'emoji') {
      return _react2['default'].createElement(_emojiBrowserBrowser2['default'], _extends({}, options, {
        customEmojis: this.props.customEmojis,
        search: query.key,
        onSelectItem: this.onSelectEmojiBrowserItem.bind(this),
        onNotFound: this.onAbort.bind(this),
        onDidMount: this.onDidMount.bind(this, 'browser') }));
    }

    return _react2['default'].createElement(_datalistDatalist2['default'], _extends({}, options, {
      data: data,
      onSelect: this.onSelectDatalistItem.bind(this),
      onDidMount: this.onDidMount.bind(this, 'datalist') }));
  };

  Input.prototype.getTextContent = function getTextContent() {
    return this.editable.getTextContent();
  };

  Input.prototype.setTextContent = function setTextContent(text) {
    this.query.reset();
    return this.editable.setTextContent(text);
  };

  Input.prototype.closeViewer = function closeViewer() {
    this.setState({ type: null });
  };

  /**
   * Keyboard navigation for the search browser.
   */

  Input.prototype.navigateSearchBrowser = function navigateSearchBrowser(e) {
    var browser = this.browser;

    if (!browser) return;

    switch (_keyname2['default'](e.keyCode)) {
      case 'down':
        browser.focusItem('next');
        e.preventDefault();
        break;
      case 'up':
        browser.focusItem('prev');
        e.preventDefault();
        break;
      case 'right':
      case 'tab':
        browser.selectTab('next');
        e.preventDefault();
        break;
      case 'left':
        browser.selectTab('prev');
        e.preventDefault();
        break;
      case 'enter':
        this.onSelectSearchBrowserItem(browser.getFocusedItem());
        e.preventDefault();
        break;
      default:
    }
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

  /**
   * Keyboard navigation for the emoji browser.
   */

  Input.prototype.navigateEmojiBrowser = function navigateEmojiBrowser(e) {
    var browser = this.browser;

    if (!browser) return;
    switch (_keyname2['default'](e.keyCode)) {
      case 'down':
        browser.focusItem('nextRow');
        e.preventDefault();
        break;
      case 'up':
        browser.focusItem('prevRow');
        e.preventDefault();
        break;
      case 'left':
        browser.focusItem('prev');
        e.preventDefault();
        break;
      case 'right':
        browser.focusItem('next');
        e.preventDefault();
        break;
      case 'enter':
        this.insertItem(browser.getFocusedItem());
        e.preventDefault();
        break;
      case 'tab':
        browser.selectTab('next');
        e.preventDefault();
        break;
      default:
    }
  };

  Input.prototype.insertItem = function insertItem(item) {
    if (item) {
      var results = _lodashObjectGet2['default'](this.state, 'data.results');
      var data = _lodashCollectionFind2['default'](results, function (res) {
        return res.id === item.id;
      }) || item;
      var Obj = objects[data.type] || objects.search;
      var object = new Obj(data);
      // Add space to let user type next thing faster.
      this.replaceQuery(object.toHTML() + '&nbsp;');
    }
    this.onInsertItem(item);
    this.closeViewer();
    this.query.reset();
  };

  Input.prototype.replaceQuery = function replaceQuery(replacement) {
    return this.editable.replaceQuery(replacement, {
      query: this.query.toJSON()
    });
  };

  Input.prototype.insertQuery = function insertQuery(queryStr) {
    this.editable.modify(function (left, right) {
      var newLeft = left;
      // Add space after text if there is no.
      if (newLeft[newLeft.length - 1] !== ' ') newLeft += ' ';
      newLeft += queryStr;
      return [newLeft, right];
    }, { query: this.query.toJSON() });
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
    _react2['default'].findDOMNode(this).dispatchEvent(event);
    name = 'on' + capType;
    var callback = this.props[name];
    if (callback) callback(data);
  };

  Input.prototype.onAbort = function onAbort() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    this.closeViewer();
    var type = this.state.type;

    this.emit('abort', _extends({}, data, { type: type }));
  };

  Input.prototype.onEditPrevious = function onEditPrevious() {
    this.emit('editPrevious');
  };

  Input.prototype.onSubmit = function onSubmit(data) {
    this.query.reset();
    this.emit('submit', data);
  };

  Input.prototype.onChange = function onChange(query) {
    if (query) {
      var changed = this.query.set(query, { silent: true });
      if (changed) this.emit('complete', this.query.toJSON());
    }
    // Query has been removed or caret position changed.
    else if (!this.query.isEmpty()) {
        this.query.reset();
        this.onAbort({ reason: 'deleteQuery' });
      }

    this.emit('change');
  };

  Input.prototype.onFacetChange = function onFacetChange(data) {
    var filters = undefined;
    if (data.id) {
      var service = utils.findServiceById(data.id, this.state.data);
      if (service) filters = [service.key];
    }
    this.query.set('filters', filters);
  };

  Input.prototype.onSelectSearchBrowserItem = function onSelectSearchBrowserItem(data) {
    if (data.type === 'filters') this.onFilterSelect(data);else this.insertItem(data);
  };

  Input.prototype.onSelectEmojiBrowserItem = function onSelectEmojiBrowserItem(data) {
    this.insertItem(data);
  };

  Input.prototype.onSelectDatalistItem = function onSelectDatalistItem(data) {
    this.insertItem(data);
  };

  Input.prototype.onAddIntegration = function onAddIntegration() {
    this.closeViewer();
    this.emit('addIntegration');
  };

  Input.prototype.onFilterSelect = function onFilterSelect(data) {
    this.query.set('filters', [data.id]);
    this.query.set('search', '');
    this.emit('filterSelect', this.query.toJSON());
  };

  Input.prototype.onSearch = function onSearch(data) {
    this.emit('search', data);
  };

  Input.prototype.onInsertItem = function onInsertItem(item) {
    var query = this.query.toJSON();
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
    switch (this.state.type) {
      case 'search':
        this.navigateSearchBrowser(e);
        break;
      case 'emoji':
        this.navigateEmojiBrowser(e);
        break;
      case 'user':
        this.navigateDatalist(e);
        break;
      default:
    }
  };

  Input.prototype.onFocus = function onFocus() {
    this.setState({ focused: true });
    this.emit('focus');
  };

  Input.prototype.onBlur = function onBlur() {
    var _this2 = this;

    // We use the timeout to avoid closing suggestions when whole window
    // got unfocused. We want still to close it when
    this.blurTimeoutId = setTimeout(function () {
      _this2.query.reset();
      _this2.setState({ type: null, focused: false });
      _this2.emit('blur');
    }, 50);
  };

  Input.prototype.onWindowBlur = function onWindowBlur() {
    clearTimeout(this.blurTimeoutId);
  };

  Input.prototype.onQueryChange = function onQueryChange(newQueryStr) {
    var replaced = this.replaceQuery(newQueryStr);
    if (!replaced) this.insertQuery(newQueryStr);
  };

  var _Input = Input;
  Input = _jss.useSheet(_style2['default'])(Input) || Input;
  return Input;
})(_react.Component);

exports['default'] = Input;
module.exports = exports['default'];