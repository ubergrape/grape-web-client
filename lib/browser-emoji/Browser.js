'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashFunctionDebounce = require('lodash/function/debounce');

var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

var _keyname = require('keyname');

var _keyname2 = _interopRequireDefault(_keyname);

var _reactPureRender = require('react-pure-render');

var _jss = require('../jss');

var _browserStyle = require('./browserStyle');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

var _tabsTabsWithControls = require('../tabs/TabsWithControls');

var _tabsTabsWithControls2 = _interopRequireDefault(_tabsTabsWithControls);

var _gridGrid = require('../grid/Grid');

var _gridGrid2 = _interopRequireDefault(_gridGrid);

var _itemItem = require('./item/Item');

var _itemItem2 = _interopRequireDefault(_itemItem);

var _dataUtils = require('./dataUtils');

var dataUtils = _interopRequireWildcard(_dataUtils);

var _emojiIcon = require('../emoji/Icon');

var _emojiIcon2 = _interopRequireDefault(_emojiIcon);

var _emoji = require('../emoji');

var emoji = _interopRequireWildcard(_emoji);

var _inputInput = require('../input/Input');

var _inputInput2 = _interopRequireDefault(_inputInput);

var _emptyEmpty = require('../empty/Empty');

/**
 * Main emoji browser component.
 */

var _emptyEmpty2 = _interopRequireDefault(_emptyEmpty);

var Browser = (function (_Component) {
  _inherits(Browser, _Component);

  _createClass(Browser, null, [{
    key: 'defaultProps',
    value: {
      customEmojis: undefined,
      images: {},
      height: 400,
      maxWidth: 920,
      className: '',
      focused: undefined,
      onSelectItem: undefined,
      onDidMount: undefined
    },
    enumerable: true
  }]);

  function Browser(props) {
    _classCallCheck(this, Browser);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.exposePublicMethods();
    this.onResize = _lodashFunctionDebounce2['default'](this.cacheItemsPerRow.bind(this), 500);
    this.state = this.createState(this.props, {});
  }

  Browser.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
    _lodashObjectAssign2['default'](nextState, this.createState(nextProps, nextState));
  };

  Browser.prototype.componentDidUpdate = function componentDidUpdate() {
    this.cacheItemsPerRow();
  };

  Browser.prototype.componentWillMount = function componentWillMount() {
    window.addEventListener('resize', this.onResize);
  };

  Browser.prototype.componentWillUnmount = function componentWillUnmount() {
    this.grid = null;
    window.removeEventListener('resize', this.onResize);
  };

  Browser.prototype.componentDidMount = function componentDidMount() {
    var onDidMount = this.props.onDidMount;

    if (onDidMount) onDidMount(this);
    this.cacheItemsPerRow();
  };

  Browser.prototype.exposePublicMethods = function exposePublicMethods() {
    var _this = this;

    var container = this.props.container;

    if (!container) return;
    ['focusItem', 'getFocusedItem'].forEach(function (method) {
      container[method] = _this[method].bind(_this);
    });
  };

  Browser.prototype.createState = function createState(nextProps, nextState) {
    var currEmojiSheet = _lodashObjectGet2['default'](this.props, 'images.emojiSheet');
    var newEmojiSheet = _lodashObjectGet2['default'](nextProps, 'images.emojiSheet');
    if (newEmojiSheet && (newEmojiSheet !== currEmojiSheet || !emoji.get())) {
      PublicBrowser.init({
        emojiSheet: newEmojiSheet,
        customEmojis: nextProps.customEmojis
      });
    }

    var facet = nextState.facet;
    var search = nextState.search;

    if (facet !== 'search') search = null;
    var sections = dataUtils.getSections(search, facet);

    var tabs = dataUtils.getTabs({
      orgLogo: nextProps.images.orgLogo,
      selected: facet,
      hasSearch: Boolean(nextState.search)
    });

    return { tabs: tabs, facet: facet, sections: sections };
  };

  Browser.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var sections = this.state.sections;

    return _react2['default'].createElement(
      'div',
      {
        className: classes.browser + ' ' + this.props.className,
        style: _lodashObjectPick2['default'](this.props, 'height', 'maxWidth') },
      _react2['default'].createElement(_inputInput2['default'], {
        onInput: this.onInput.bind(this),
        onKeyDown: this.onKeyDown.bind(this),
        focused: this.props.focused }),
      _react2['default'].createElement(_tabsTabsWithControls2['default'], { data: this.state.tabs, onSelect: this.onSelectTab.bind(this) }),
      !sections.length && _react2['default'].createElement(_emptyEmpty2['default'], { text: "No emoji found." }),
      sections.length > 0 && _react2['default'].createElement(
        'div',
        { className: classes.column },
        _react2['default'].createElement(
          'div',
          { className: classes.row },
          _react2['default'].createElement(_gridGrid2['default'], {
            data: sections,
            images: this.props.images,
            Item: _itemItem2['default'],
            focusedItem: dataUtils.getFocusedItem(sections),
            className: classes.leftColumn,
            section: { contentClassName: classes.sectionContent },
            onFocus: this.onFocusItem.bind(this),
            onSelect: this.onSelectItem.bind(this),
            onDidMount: this.onGridDidMount.bind(this) })
        )
      )
    );
  };

  Browser.prototype.getFocusedItem = function getFocusedItem() {
    return dataUtils.getFocusedItem(this.state.sections);
  };

  Browser.prototype.cacheItemsPerRow = function cacheItemsPerRow() {
    var sections = this.state.sections;

    if (!sections.length) return;

    var sectionComponent = this.grid.getSectionComponent(sections[0].id);
    var contentComponent = sectionComponent.getContentComponent();

    var _React$findDOMNode$getBoundingClientRect = _react2['default'].findDOMNode(contentComponent).getBoundingClientRect();

    // Speed up if grid width didn't change.
    var gridWidth = _React$findDOMNode$getBoundingClientRect.width;
    if (this.itemsPerRow && gridWidth === this.gridWidth) return;
    this.gridWidth = gridWidth;

    var id = _lodashObjectGet2['default'](this.state, 'sections[0].items[0].id');
    if (!id) return;

    var component = this.grid.getItemComponent(id);
    var itemWidth = _react2['default'].findDOMNode(component).offsetWidth;
    this.itemsPerRow = Math.floor(gridWidth / itemWidth);
  };

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   */

  Browser.prototype.selectTab = function selectTab(selector) {
    var tabs = this.state.tabs;

    var facet = selector;
    if (selector === 'next') {
      var currIndex = _lodashArrayFindIndex2['default'](tabs, function (tab) {
        return tab.selected;
      });
      if (tabs[currIndex + 1]) facet = tabs[currIndex + 1].id;else facet = tabs[0].id;
    }
    var newIndex = _lodashArrayFindIndex2['default'](tabs, function (tab) {
      return tab.id === facet;
    });
    facet = tabs[newIndex].id;
    this.setState({ facet: facet });
  };

  Browser.prototype.focusItem = function focusItem(id) {
    var sections = this.state.sections;

    if (!sections.length) return;
    var nextItemId = id;
    var nextItem = dataUtils.getItem(sections, nextItemId, this.itemsPerRow);
    if (nextItem) nextItemId = nextItem.id;

    var prevItem = dataUtils.getFocusedItem(sections);

    var prevComponent = this.grid.getItemComponent(prevItem.id);
    if (prevComponent) prevComponent.setState({ focused: false });

    var nextComponent = this.grid.getItemComponent(nextItemId);
    if (nextComponent) nextComponent.setState({ focused: true });

    dataUtils.setFocusedItem(sections, nextItemId);
  };

  Browser.prototype.selectItem = function selectItem(id) {
    this.focusItem(id);
    this.props.onSelectItem(this.getFocusedItem());
  };

  /**
   * Keyboard navigation.
   */

  Browser.prototype.navigate = function navigate(e) {
    switch (_keyname2['default'](e.keyCode)) {
      case 'down':
        this.focusItem('nextRow');
        e.preventDefault();
        break;
      case 'up':
        this.focusItem('prevRow');
        e.preventDefault();
        break;
      case 'left':
        this.focusItem('prev');
        e.preventDefault();
        break;
      case 'right':
        this.focusItem('next');
        e.preventDefault();
        break;
      case 'enter':
        this.props.onSelectItem(this.getFocusedItem());
        e.preventDefault();
        break;
      case 'tab':
        this.selectTab('next');
        e.preventDefault();
        break;
      default:
    }
  };

  Browser.prototype.onFocusItem = function onFocusItem(_ref) {
    var id = _ref.id;

    this.focusItem(id);
  };

  Browser.prototype.onSelectItem = function onSelectItem(_ref2) {
    var id = _ref2.id;

    this.selectItem(id);
  };

  Browser.prototype.onSelectTab = function onSelectTab(_ref3) {
    var id = _ref3.id;

    this.selectTab(id);
  };

  Browser.prototype.onGridDidMount = function onGridDidMount(grid) {
    this.grid = grid;
  };

  Browser.prototype.onInput = function onInput(_ref4) {
    var value = _ref4.value;

    this.setState({
      search: value,
      facet: value ? 'search' : undefined
    });
  };

  Browser.prototype.onKeyDown = function onKeyDown(e) {
    this.navigate(e);
  };

  return Browser;
})(_react.Component);

var PublicBrowser = _jss.useSheet(Browser, _browserStyle2['default']);
PublicBrowser.init = function (options) {
  var emojiSheet = options.emojiSheet;
  var customEmojis = options.customEmojis;

  if (emojiSheet) emoji.setSheet(emojiSheet);
  if (customEmojis) emoji.defineCustom(customEmojis);
  dataUtils.init();
};

PublicBrowser.replace = emoji.replace;
PublicBrowser.get = emoji.get;
PublicBrowser.Icon = _emojiIcon2['default'];

exports['default'] = PublicBrowser;
module.exports = exports['default'];