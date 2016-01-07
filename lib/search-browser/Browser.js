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

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashObjectPick = require('lodash/object/pick');

var _lodashObjectPick2 = _interopRequireDefault(_lodashObjectPick);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _keyname = require('keyname');

var _keyname2 = _interopRequireDefault(_keyname);

var _reactPureRender = require('react-pure-render');

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

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

var _dataUtils = require('./dataUtils');

var dataUtils = _interopRequireWildcard(_dataUtils);

var _queryBuild = require('../query/build');

var _queryBuild2 = _interopRequireDefault(_queryBuild);

var _queryConstants = require('../query/constants');

var PUBLIC_METHODS = ['selectTab', 'focusItem', 'getFocusedItem'];

/**
 * Main search browser component.
 */

var Browser = (function (_Component) {
  _inherits(Browser, _Component);

  _createClass(Browser, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      onDidMount: _react.PropTypes.func,
      onSelectFilter: _react.PropTypes.func,
      onSelectItem: _react.PropTypes.func,
      onInput: _react.PropTypes.func,
      onAbort: _react.PropTypes.func,
      onBlur: _react.PropTypes.func,
      data: _react.PropTypes.object,
      maxItemsPerSectionInAll: _react.PropTypes.number,
      container: _react.PropTypes.element,
      focused: _react.PropTypes.bool,
      isExternal: _react.PropTypes.bool,
      externalServicesInputDelay: _react.PropTypes.number,
      isLoading: _react.PropTypes.bool,
      images: _react.PropTypes.object,
      height: _react.PropTypes.number,
      className: _react.PropTypes.string
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      height: 400,
      className: '',
      maxItemsPerSectionInAll: 5,
      isExternal: false,
      isLoading: false,
      canAddIntegrations: false,
      externalServicesInputDelay: 500,
      onAddIntegration: _lodashUtilityNoop2['default'],
      onSelectItem: _lodashUtilityNoop2['default'],
      onSelectFilter: _lodashUtilityNoop2['default'],
      onDidMount: _lodashUtilityNoop2['default'],
      onChange: _lodashUtilityNoop2['default'],
      onAbort: _lodashUtilityNoop2['default'],
      onBlur: _lodashUtilityNoop2['default']
    },
    enumerable: true
  }]);

  function Browser(props) {
    _classCallCheck(this, _Browser);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = this.createState(this.props);
    this.exposePublicMethods();
  }

  Browser.prototype.componentDidMount = function componentDidMount() {
    this.props.onDidMount(this);
  };

  Browser.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    this.setState(this.createState(props));
  };

  Browser.prototype.onFocusItem = function onFocusItem(_ref) {
    var id = _ref.id;

    this.focusItem(id);
  };

  Browser.prototype.onSelectItem = function onSelectItem() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var id = _ref2.id;

    if (id) this.focusItem(id);
    var item = this.getFocusedItem();
    var trigger = _queryConstants.TYPES.search;

    if (item.type === 'filters') {
      var service = dataUtils.findById(this.props.data.services, item.id);
      var filters = service ? [service.key] : [];
      this.setState({
        search: '',
        filters: filters
      });
      var _query = _queryBuild2['default']({ trigger: trigger, filters: filters });
      this.props.onSelectFilter(_query);
      return;
    }

    var query = _queryBuild2['default']({
      trigger: trigger,
      filters: this.state.filters,
      search: this.state.search
    });

    // After selection we don't care about scheduled inputs.
    clearTimeout(this.onInputTimeoutId);

    this.props.onSelectItem({ item: item, query: query });
  };

  Browser.prototype.onSelectTab = function onSelectTab(_ref3) {
    var id = _ref3.id;

    this.selectTab(id);
  };

  Browser.prototype.onKeyDown = function onKeyDown(e) {
    this.navigate(e);
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

  Browser.prototype.getFocusedItem = function getFocusedItem() {
    return dataUtils.getFocusedItem(this.state.sections);
  };

  Browser.prototype.focusItem = function focusItem(selector) {
    var sections = this.state.sections;

    var id = undefined;

    if (selector === 'next' || selector === 'prev') {
      var selectedSection = dataUtils.getSelectedSection(sections);
      var items = selectedSection ? selectedSection.items : dataUtils.extractItems(sections);
      var focusedIndex = _lodashArrayFindIndex2['default'](items, function (item) {
        return item.focused;
      });
      var newItem = undefined;

      if (selector === 'next') {
        newItem = items[focusedIndex + 1];
        if (!newItem) newItem = items[0];
      } else if (selector === 'prev') {
        newItem = items[focusedIndex - 1];
        if (!newItem) newItem = items[items.length - 1];
      }

      id = newItem.id;
    } else id = selector;

    if (id) {
      dataUtils.setFocusedItem(sections, id);
      this.setState({ sections: [].concat(sections) });
    }
  };

  Browser.prototype.createState = function createState(props) {
    var data = props.data;

    var inputDelay = props.isExternal ? props.externalServicesInputDelay : undefined;

    if (!data) {
      return {
        sections: [],
        tabs: [],
        inputDelay: inputDelay
      };
    }

    var serviceId = undefined;
    if (this.state && this.state.filters) {
      serviceId = dataUtils.filtersToServiceId(data, this.state.filters);
    }

    var sections = dataUtils.getSections(data, serviceId, props.maxItemsPerSectionInAll);

    var tabs = dataUtils.getTabs(data.services, serviceId);

    return { sections: sections, tabs: tabs, inputDelay: inputDelay };
  };

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   */

  Browser.prototype.selectTab = function selectTab(selector) {
    var tabs = this.state.tabs;

    var currIndex = _lodashArrayFindIndex2['default'](tabs, function (tab) {
      return tab.selected;
    });
    var newIndex = undefined;

    if (selector === 'next') {
      newIndex = currIndex + 1;
      if (!tabs[newIndex]) newIndex = 0;
    } else if (selector === 'prev') {
      newIndex = currIndex - 1;
      if (newIndex < 0) newIndex = tabs.length - 1;
    } else {
      newIndex = _lodashArrayFindIndex2['default'](tabs, function (tab) {
        return tab.id === selector;
      });
    }

    var id = tabs[newIndex].id;

    dataUtils.setSelectedTab(tabs, newIndex);
    var sections = dataUtils.getSections(this.props.data, id, this.props.maxItemsPerSectionInAll);
    dataUtils.setSelectedSection(sections, id);
    dataUtils.setFocusedItemAt(sections, id, 0);
    var service = dataUtils.findById(this.props.data.services, id);
    var filters = service ? [service.key] : [];
    this.setState({ tabs: tabs, sections: sections, filters: filters });
  };

  Browser.prototype.exposePublicMethods = function exposePublicMethods() {
    var _this2 = this;

    var container = this.props.container;

    if (!container) return;
    PUBLIC_METHODS.forEach(function (method) {
      return container[method] = _this2[method].bind(_this2);
    });
  };

  /**
   * Keyboard navigation.
   */

  Browser.prototype.navigate = function navigate(e) {
    if (!this.props.data) return;
    switch (_keyname2['default'](e.keyCode)) {
      case 'down':
        this.focusItem('next');
        e.preventDefault();
        break;
      case 'up':
        this.focusItem('prev');
        e.preventDefault();
        break;
      case 'tab':
        this.selectTab(e.shiftKey ? 'prev' : 'next');
        e.preventDefault();
        break;
      case 'enter':
        this.onSelectItem();
        e.preventDefault();
        break;
      default:
    }
  };

  Browser.prototype.renderContent = function renderContent() {
    var sections = this.state.sections;
    var data = this.props.data;

    if (!data) return null;

    var selectedSection = dataUtils.getSelectedSection(sections);
    if (selectedSection) sections = [selectedSection];

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
    var props = _lodashObjectPick2['default'](this.props, 'hasIntegrations', 'canAddIntegrations', 'images', 'onAddIntegration', 'orgName', 'orgOwner');

    return _react2['default'].createElement(Service, _extends({}, props, {
      Item: _itemItem2['default'],
      data: data,
      focusedItem: this.getFocusedItem(),
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
          onInput: this.onInput.bind(this),
          onChangeFilters: this.props.onSelectFilter,
          onBlur: this.props.onBlur,
          onKeyDown: this.onKeyDown.bind(this),
          focused: this.props.focused,
          filters: this.state.filters,
          search: this.state.search,
          className: classes.input,
          type: 'search',
          placeholder: 'Grape Search' })
      ),
      this.state.tabs && _react2['default'].createElement(_tabsTabsWithControls2['default'], { data: this.state.tabs, onSelect: this.onSelectTab.bind(this) }),
      content,
      this.props.isLoading && _react2['default'].createElement(_grapeWebLibSpinnerSpinner2['default'], { image: this.props.images.spinner })
    );
  };

  var _Browser = Browser;
  Browser = _grapeWebLibJss.useSheet(_browserStyle2['default'])(Browser) || Browser;
  return Browser;
})(_react.Component);

exports['default'] = Browser;
module.exports = exports['default'];