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

var _reactPureRender = require('react-pure-render');

var _scribeEditor = require('scribe-editor');

var _scribeEditor2 = _interopRequireDefault(_scribeEditor);

var _scribePluginFormatterPlainTextConvertNewLinesToHtml = require('scribe-plugin-formatter-plain-text-convert-new-lines-to-html');

var _scribePluginFormatterPlainTextConvertNewLinesToHtml2 = _interopRequireDefault(_scribePluginFormatterPlainTextConvertNewLinesToHtml);

var _lodashFunctionDebounce = require('lodash/function/debounce');

var _lodashFunctionDebounce2 = _interopRequireDefault(_lodashFunctionDebounce);

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

var _keyname = require('keyname');

var _keyname2 = _interopRequireDefault(_keyname);

var _emoji = require('../emoji');

var emoji = _interopRequireWildcard(_emoji);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _markdown = require('./markdown');

var markdown = _interopRequireWildcard(_markdown);

var _Caret = require('./Caret');

var _Caret2 = _interopRequireDefault(_Caret);

var _AccentMode = require('./AccentMode');

var _AccentMode2 = _interopRequireDefault(_AccentMode);

var _queryConstants = require('../query/constants');

var _queryParse = require('../query/parse');

var _queryParse2 = _interopRequireDefault(_queryParse);

var Editable = (function (_Component) {
  _inherits(Editable, _Component);

  _createClass(Editable, null, [{
    key: 'defaultProps',
    value: {
      placeholder: '',
      focused: false,
      disabled: false,
      onAbort: undefined,
      onEditPrevious: undefined,
      onSubmit: undefined,
      onChange: undefined,
      onBlur: undefined,
      onDidMount: undefined
    },
    enumerable: true
  }]);

  function Editable(props) {
    _classCallCheck(this, _Editable);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = this.createState(this.props);
    this.onKeyDownDebounced = _lodashFunctionDebounce2['default'](this.onKeyDownDebounced.bind(this), 20);
    this.onPaste = this.onPaste.bind(this);
  }

  Editable.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps));
  };

  Editable.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.state.focused && !prevState.focused) {
      this.focus();
    }
  };

  Editable.prototype.componentDidMount = function componentDidMount() {
    this.node = _react2['default'].findDOMNode(this);
    this.node.addEventListener('paste', this.onPaste);

    // Todo add desroy method to scribe so that we can recreate everything on
    // mount. Right now this
    if (!this.scribe) {
      this.scribe = new _scribeEditor2['default'](this.node);
      this.scribe.use(_scribePluginFormatterPlainTextConvertNewLinesToHtml2['default']());
      this.caret = new _Caret2['default'](this.scribe);
      this.accentMode = new _AccentMode2['default'](this.node);
    }

    var onDidMount = this.props.onDidMount;

    if (onDidMount) onDidMount(this);
  };

  Editable.prototype.componentWillUnmount = function componentWillUnmount() {
    this.node.removeEventListener('paste', this.onPaste);
  };

  Editable.prototype.createState = function createState(_ref) {
    var focused = _ref.focused;

    return { focused: focused };
  };

  Editable.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var _props = this.props;
    var placeholder = _props.placeholder;
    var disabled = _props.disabled;

    var className = classes.editable;

    if (utils.isEmpty(this.node) && !this.state.focused) {
      className += ' ' + classes.placeholder;
    }

    return _react2['default'].createElement('div', {
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
      onInput: this.onInput.bind(this),
      onKeyPress: this.onKeyPress.bind(this),
      onKeyDown: this.onKeyDown.bind(this),
      onMouseDown: this.onMouseDown.bind(this),
      className: className,
      // CSS will take it from here.
      'data-placeholder': placeholder,
      contentEditable: !disabled,
      'data-test': 'editable' });
  };

  /**
   * Replace query.
   */

  Editable.prototype.replaceQuery = function replaceQuery(replacement) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var markers = this.caret.getMarkers({ grape: true });
    if (markers.length) {
      _Caret2['default'].renameMarkers(markers, 'scribe');
      var selection = this.caret.createSelection(true);
      selection.selectMarkers();
    }

    var query = this.getQuery();
    if (!query) return false;

    return this.modifyAtCaret(function (left, right) {
      var newLeft = utils.replaceLastQuery(replacement, query.query, left);
      return [newLeft, right];
    }, _extends({}, options, { silent: true }));
  };

  /**
   * Modify text at caret position.
   * Passed function will receive an array with text before and after the caret.
   */

  Editable.prototype.modifyAtCaret = function modifyAtCaret(modifier) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selection = this.caret.createSelection(true);
    var caretsParent = this.caret.getParent(selection);

    if (!caretsParent) return false;

    this.caret.placeMarker(selection);

    this.modify(caretsParent, modifier, options, function () {
      selection.selectMarkers(options.keepMarkers);
      if (options.keepMarkers) {
        var markers = _this.caret.getMarkers({ selection: selection });
        _Caret2['default'].renameMarkers(markers, 'grape');
      }
    });

    return true;
  };

  Editable.prototype.modify = function modify(el, modifier, options, callback) {
    var _this2 = this;

    var html = utils.htmlWhitespacesToText(el.innerHTML);
    var parts = html.split(_Caret2['default'].MARKER_HTML);
    parts = modifier.apply(undefined, parts);
    var newHtml = parts.join(_Caret2['default'].MARKER_HTML);
    this.scribe.transactionManager.run(function () {
      el.innerHTML = newHtml;
      _this2.afterInsertionAnimation();
      callback();
      if (!options.silent) _this2.props.onChange(options);
    });
  };

  /**
   * Set focus.
   */

  Editable.prototype.focus = function focus() {
    if (!this.caret.focus()) return;

    var selection = this.caret.createSelection();

    // Insert a marker into the first paragraph if there are no markers.
    if (!this.caret.getMarkers({ selection: selection }).length) {
      var rootP = this.node.firstChild;
      rootP.innerHTML = _Caret2['default'].MARKER_HTML + rootP.innerHTML;
    }

    selection.selectMarkers();
  };

  /**
   * Get search key and trigger.
   */

  Editable.prototype.getQuery = function getQuery() {
    var selection = this.caret.createSelection(true);
    var caretsParent = this.caret.getParent(selection);

    if (!caretsParent || utils.isGrapeObject(caretsParent)) return undefined;

    var text = this.caret.getText('before', selection);

    text = utils.htmlWhitespacesToText(text);
    var matches = text.split(_queryConstants.REGEX);

    if (matches.length < 3) return undefined;

    var key = matches.pop();
    var trigger = matches.pop();

    return _queryParse2['default'](trigger + key);
  };

  /**
   * Getter for text content.
   *
   * Serialize content to text, use data-object strings instead of
   * textContent if given.
   */

  Editable.prototype.getTextContent = function getTextContent() {
    return utils.getText(this.node);
  };

  /**
   * Setter for text content.
   *
   * When content passed - set text content and put caret at the end, otherwise
   * clean up the content.
   */

  Editable.prototype.setTextContent = function setTextContent(text) {
    var _this3 = this;

    var html = '';

    if (text) {
      html = _lodashStringEscape2['default'](text);
      html = markdown.replace(html);
      html = emoji.replace(html);
    }

    // Insert marker to put caret there later.
    html += _Caret2['default'].MARKER_HTML;

    // Safari/Chrome will insert another paragraph if there is no text and no br.
    html += '<br />';

    html = utils.splitTextInParagraphs(html);

    this.scribe.transactionManager.run(function () {
      _this3.node.innerHTML = html;
      _this3.caret.move();
      _this3.onChange();
    });
    return text;
  };

  /**
   * Handle keydown events.
   */

  Editable.prototype.handleKeyDown = function handleKeyDown(key, e) {
    var _this4 = this;

    var caretsParent = this.caret.getParent();
    var inNonEditable = utils.isGrapeObject(caretsParent);

    switch (key) {
      // Remove the element when user hits backspace.
      case 'backspace':
        if (inNonEditable) {
          e.preventDefault();
          this.scribe.transactionManager.run(function () {
            var parent = caretsParent.parentNode;
            if (!parent) return;
            parent.removeChild(caretsParent);
            utils.removeEmpty(parent, _this4.node);
          });
        }
        break;
      case 'esc':
        this.onAbort('esc');
        e.preventDefault();
        break;
      case 'up':
        if (utils.isEmpty(this.node)) {
          this.props.onEditPrevious();
          e.preventDefault();
        }
        break;
      // We try to jump over non-editable elements.
      case 'down':
        break;
      case 'right':
        if (inNonEditable) this.caret.move('after', caretsParent);
        break;
      case 'left':
        if (inNonEditable) this.caret.move('before', caretsParent);
        break;
      default:
        // Anything typed within non editable will be triggered after we move
        // the caret before/after that element.
        if (inNonEditable) {
          // We detect if caret is closer to the end of the element or beginning.
          if (this.caret.getText('before').length > this.caret.getText('after').length) {
            this.caret.move('after', caretsParent);
          } else this.caret.move('before', caretsParent);
        }
    }
  };

  /**
   * Trigger submit event when user hits enter.
   * Do nothing when alt, ctrl, shift or cmd used.
   */

  Editable.prototype.submit = function submit(e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (_keyname2['default'](e.keyCode) !== 'enter') return;

    e.preventDefault();
    if (utils.isEmpty(this.node)) return;

    var content = this.getTextContent();
    var objects = utils.getResultsFromGrapeObjects(this.node);
    this.props.onSubmit({ content: content, objects: objects });
  };

  /**
   * Remove animate class from grape objects so that they don't get animated
   * again when reinserted into dom.
   */

  Editable.prototype.afterInsertionAnimation = function afterInsertionAnimation() {
    var _this5 = this;

    // Wait until animation is done.
    setTimeout(function () {
      utils.findGrapeObjects(_this5.node).forEach(function (el) {
        el.classList.remove('animate');
      });
    }, this.props.insertAnimationDuration);
  };

  /**
   * Ensure always to use paragraphs for new line.
   * Browser inserts br's when user hits shift + enter by default.
   * Otherwise we have an issue when parsing grape query #1862.
   */

  Editable.prototype.ensureNewLine = function ensureNewLine(key, e) {
    var _this6 = this;

    if (key !== 'enter' || !e.shiftKey) return;

    e.preventDefault();

    this.scribe.transactionManager.run(function () {
      var selection = _this6.caret.placeMarker();
      var caretsParent = _this6.caret.getParent(selection);

      var lines = caretsParent.innerHTML.split(_Caret2['default'].MARKER_HTML);

      var p = undefined;
      var fragment = document.createDocumentFragment();
      lines.forEach(function (line) {
        p = document.createElement('p');
        p.innerHTML = line;
        // Ensure always to have a br at the end.
        if (!p.lastChild || p.lastChild.nodeName !== 'BR') {
          p.appendChild(document.createElement('br'));
        }
        fragment.appendChild(p);
      });
      caretsParent.parentNode.replaceChild(fragment, caretsParent);
      p.innerHTML = _Caret2['default'].MARKER_HTML + p.innerHTML;
      selection.selectMarkers();
    });
  };

  Editable.prototype.onKeyDown = function onKeyDown(e) {
    var key = _keyname2['default'](e.keyCode);
    var nativeEvent = e.nativeEvent;

    this.ensureNewLine(key, nativeEvent);
    this.onKeyDownDebounced(key, nativeEvent);
  };

  Editable.prototype.onKeyDownDebounced = function onKeyDownDebounced() {
    // Only handle key down when editable is still focused.
    // As this function is called with a  delay, focus might have changed
    // already for a good reason.
    if (this.state.focused) this.handleKeyDown.apply(this, arguments);
  };

  Editable.prototype.onInput = function onInput() {
    // During this mode we shouldn't place markers as they will end accent mode.
    if (!this.accentMode.active) this.onChange();
  };

  Editable.prototype.onKeyPress = function onKeyPress(e) {
    this.submit(e.nativeEvent);
  };

  Editable.prototype.onMouseDown = function onMouseDown(e) {
    if (!this.state.focused) this.props.onFocus();
    if (utils.isGrapeObject(e.target)) {
      e.preventDefault();
      this.caret.move('after', e.target);
    }
  };

  Editable.prototype.onPaste = function onPaste(e) {
    if (!e.clipboardData) return;
    var text = e.clipboardData.getData('text/plain');
    if (!text) return;
    e.preventDefault();
    // Prevent scribe's "paste" handler from execution.
    e.stopImmediatePropagation();
    var html = utils.textToHtml(text);
    this.scribe.insertHTML(html);
  };

  Editable.prototype.onAbort = function onAbort(reason) {
    this.props.onAbort({
      reason: reason,
      query: this.getQuery()
    });
  };

  Editable.prototype.onChange = function onChange() {
    this.props.onChange({ query: this.getQuery() });
  };

  var _Editable = Editable;
  Editable = _jss.useSheet(_style2['default'])(Editable) || Editable;
  return Editable;
})(_react.Component);

exports['default'] = Editable;
module.exports = exports['default'];