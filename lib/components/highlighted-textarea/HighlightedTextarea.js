'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _keyname = require('keyname');

var _keyname2 = _interopRequireDefault(_keyname);

var _objects = require('../objects');

var _grapeWebLibJss = require('grape-web/lib/jss');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var HighlightedTextarea = (function (_Component) {
  _inherits(HighlightedTextarea, _Component);

  _createClass(HighlightedTextarea, null, [{
    key: 'propTypes',
    value: {
      onDidMount: _react.PropTypes.func.isRequired,
      onChange: _react.PropTypes.func.isRequired,
      onAbort: _react.PropTypes.func.isRequired,
      onEditPrevious: _react.PropTypes.func.isRequired,
      onSubmit: _react.PropTypes.func.isRequired,
      onResize: _react.PropTypes.func.isRequired,
      onBlur: _react.PropTypes.func.isRequired,
      sheet: _react.PropTypes.object.isRequired,
      preventSubmit: _react.PropTypes.bool,
      focused: _react.PropTypes.bool,
      disabled: _react.PropTypes.bool,
      placeholder: _react.PropTypes.string
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      content: '',
      placeholder: '',
      focused: true,
      disabled: false
    },
    enumerable: true
  }]);

  function HighlightedTextarea(props) {
    _classCallCheck(this, _HighlightedTextarea);

    _Component.call(this, props);

    this.initialState = {
      text: '',
      caretPos: 0,
      objects: {},
      textWithObjects: [],
      objectsPositions: {}
    };
    this.state = _extends({}, this.initialState);
  }

  HighlightedTextarea.prototype.componentDidMount = function componentDidMount() {
    var onDidMount = this.props.onDidMount;

    if (onDidMount) onDidMount(this);
    this.bindedOnWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.bindedOnWindowResize);
  };

  HighlightedTextarea.prototype.componentDidUpdate = function componentDidUpdate() {
    var textarea = this.refs.textarea;

    if (this.props.focused) textarea.focus();

    if (_utils.isFocused(textarea)) {
      var caretPos = this.state.caretPos;

      textarea.selectionStart = caretPos;
      textarea.selectionEnd = caretPos;
    }

    this.refs.wrapper.style.height = this.refs.highlighter.offsetHeight + 'px';
    this.onResize();
  };

  HighlightedTextarea.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.bindedOnWindowResize);
  };

  HighlightedTextarea.prototype.onWindowResize = function onWindowResize() {
    if (this.state.text.trim()) this.forceUpdate();
  };

  HighlightedTextarea.prototype.onChange = function onChange(e) {
    var _e$target = e.target;
    var value = _e$target.value;
    var selectionEnd = _e$target.selectionEnd;

    var objects = _utils.updateIfNewEmoji(this.state.objects, value);

    this.setState({
      objects: objects,
      text: value,
      textWithObjects: _utils.getTextAndObjects(objects, value),
      caretPos: selectionEnd,
      objectsPositions: _utils.getObjectsPositions(objects, value)
    });

    this.props.onChange(_utils.getQuery(value, selectionEnd));
  };

  HighlightedTextarea.prototype.onAbort = function onAbort(reason) {
    var _refs$textarea = this.refs.textarea;
    var value = _refs$textarea.value;
    var selectionEnd = _refs$textarea.selectionEnd;

    var query = _utils.getQuery(value, selectionEnd);
    this.props.onAbort({ reason: reason, query: query });
  };

  HighlightedTextarea.prototype.onKeyDown = function onKeyDown(e) {
    var key = _keyname2['default'](e.keyCode);
    switch (key) {
      case 'esc':
        this.onAbort(key);
        e.preventDefault();
        break;
      case 'up':
        if (!this.refs.textarea.value) {
          this.props.onEditPrevious();
          e.preventDefault();
        }
        break;
      case 'backspace':
      case 'del':
        this.onDelete(e, key);
        break;
      case 'enter':
        this.submit(e);
        break;
      default:
    }
  };

  // TODO: possibly improve speed with fake caret in highlighter
  // so you can check if caret is inside/near the grape object

  HighlightedTextarea.prototype.onDelete = function onDelete(e, key) {
    var _state = this.state;
    var text = _state.text;
    var objectsPositions = _state.objectsPositions;
    var _refs$textarea2 = this.refs.textarea;
    var selectionStart = _refs$textarea2.selectionStart;
    var selectionEnd = _refs$textarea2.selectionEnd;

    var positionsToDelete = undefined;

    Object.keys(objectsPositions).some(function (object) {
      objectsPositions[object].some(function (positions) {
        // Check if carret inside object
        if (positions[0] <= selectionStart && positions[1] >= selectionEnd) {
          // If selectionStart or selectionEnd
          // not inside object —> do nothing
          if (key === 'del' && positions[1] === selectionEnd || key === 'backspace' && positions[0] === selectionStart) {
            return false;
          }
          positionsToDelete = positions;
          return true;
        }
      });
      if (positionsToDelete) return true;
    });

    // Now we know that caret is inside object
    if (positionsToDelete) {
      e.preventDefault();

      var _positionsToDelete = positionsToDelete;
      var start = _positionsToDelete[0];
      var end = _positionsToDelete[1];

      var newText = '' + text.slice(0, start) + text.slice(end, text.length);

      this.setState({
        text: newText,
        textWithObjects: _utils.getTextAndObjects(this.state.objects, newText),
        objectsPositions: _utils.getObjectsPositions(this.state.objects, newText),
        caretPos: start
      });
    }
  };

  HighlightedTextarea.prototype.onResize = function onResize() {
    this.props.onResize();
  };

  HighlightedTextarea.prototype.onBlur = function onBlur() {
    this.props.onBlur();
  };

  /**
   * Setter for text content.
   *
   * When content passed - set text content and put caret at the end, otherwise
   * clean up the content.
   */

  HighlightedTextarea.prototype.setTextContent = function setTextContent(content) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!this.props.focused) return false;

    var _parseAndReplace = _utils.parseAndReplace(content);

    var configs = _parseAndReplace.configs;
    var text = _parseAndReplace.text;

    var objects = _utils.clearIfLarge(this.state.objects);

    configs.forEach(function (config) {
      var object = _objects.create(config.type, config);
      objects[object.content] = object;
    });

    this.setState({
      text: text,
      objects: objects,
      textWithObjects: _utils.getTextAndObjects(objects, text),
      caretPos: text.length,
      objectsPositions: _utils.getObjectsPositions(objects, text)
    });

    if (!options.silent) this.props.onChange(_utils.getQuery(text, text.length));

    return true;
  };

  HighlightedTextarea.prototype.getTextWithMarkdown = function getTextWithMarkdown() {
    return this.state.textWithObjects.map(function (item) {
      return item.str ? item.str : item;
    }).join('');
  };

  HighlightedTextarea.prototype.insertQueryString = function insertQueryString(str) {
    var textarea = this.refs.textarea;
    var value = textarea.value;
    var selectionEnd = textarea.selectionEnd;

    var textBefore = value.substring(0, selectionEnd);
    var textAfter = value.substring(selectionEnd);

    if (textBefore) textBefore = _utils.ensureSpace('after', textBefore);
    if (textAfter) textAfter = _utils.ensureSpace('before', textAfter);
    textBefore += str;

    textarea.value = textBefore + textAfter;
    textarea.selectionStart = textBefore.length;
    textarea.selectionEnd = textBefore.length;

    this.onChange({ target: textarea });
  };

  /**
   * Replace text string to token in state
   */

  HighlightedTextarea.prototype.replaceQuery = function replaceQuery(replacement) {
    var _extends2;

    var textarea = this.refs.textarea;
    var selectionEnd = textarea.selectionEnd;
    var text = this.state.text;

    var token = _utils.getTokenUnderCaret(textarea.value, selectionEnd);
    var textBefore = text.slice(0, token.position[0]);
    var textAfter = text.slice(token.position[1], text.length);
    textAfter = _utils.ensureSpace('before', textAfter);

    text = textBefore + replacement.content + textAfter;
    var objects = _extends({}, this.state.objects, (_extends2 = {}, _extends2[replacement.content] = replacement, _extends2));
    var caretPos = selectionEnd + replacement.content.length;

    this.setState({
      text: text,
      objects: objects,
      caretPos: caretPos,
      textWithObjects: _utils.getTextAndObjects(objects, text),
      objectsPositions: _utils.getObjectsPositions(objects, text)
    });
  };

  HighlightedTextarea.prototype.insertLineBreak = function insertLineBreak() {
    var textarea = this.refs.textarea;
    var selectionStart = textarea.selectionStart;

    textarea.value = textarea.value.substring(0, selectionStart) + '\n' + textarea.value.substring(selectionStart);

    textarea.selectionEnd = selectionStart + 1;

    this.onChange({ target: textarea });
  };

  /**
   * Trigger submit event when user hits enter.
   * Do nothing when alt, ctrl, shift or cmd used.
   */

  HighlightedTextarea.prototype.submit = function submit(e) {
    if (e.altKey || e.ctrlKey) {
      e.preventDefault();
      return this.insertLineBreak();
    }

    if (e.metaKey || e.shiftKey || !this.state.text.trim() || this.props.preventSubmit) return false;

    e.preventDefault();

    var content = this.getTextWithMarkdown();
    var textWithObjects = this.state.textWithObjects;

    var objects = textWithObjects.reduce(function (onlyObjects, item) {
      if (typeof item === 'object') {
        onlyObjects.push(item.result || item);
      }
      return onlyObjects;
    }, []);

    var objectsOnly = !textWithObjects.filter(function (item) {
      return typeof item === 'string' && item.trim().length;
    }).length;

    this.props.onSubmit({ content: content, objects: objects, objectsOnly: objectsOnly });
    this.setState(_extends({}, this.initialState));
  };

  HighlightedTextarea.prototype.renderTokens = function renderTokens() {
    var _this = this;

    var content = this.state.textWithObjects.map(function (item, index) {
      if (item.content) return _this.renderToken(item, index);
      return _react2['default'].createElement(
        'span',
        { key: index },
        item
      );
    });

    // The last item is space,
    // to make highlight height equal
    // to content in textarea
    content.push(' ');
    return content;
  };

  HighlightedTextarea.prototype.renderToken = function renderToken(object, index) {
    var _props$sheet$classes = this.props.sheet.classes;
    var token = _props$sheet$classes.token;
    var user = _props$sheet$classes.user;
    var room = _props$sheet$classes.room;
    var search = _props$sheet$classes.search;
    var emoji = _props$sheet$classes.emoji;

    var tokenType = undefined;
    switch (object.tokenType) {
      case 'user':
        tokenType = user;
        break;
      case 'room':
        tokenType = room;
        break;
      case 'search':
        tokenType = search;
        break;
      case 'emoji':
        tokenType = emoji;
        break;
      default:
        tokenType = '';
    }

    return _react2['default'].createElement(
      'span',
      {
        key: index,
        className: token + ' ' + tokenType },
      object.content
    );
  };

  HighlightedTextarea.prototype.renderHighlighter = function renderHighlighter() {
    var _props$sheet$classes2 = this.props.sheet.classes;
    var common = _props$sheet$classes2.common;
    var highlighter = _props$sheet$classes2.highlighter;

    return _react2['default'].createElement(
      'div',
      {
        ref: 'highlighter',
        className: highlighter + ' ' + common },
      this.renderTokens()
    );
  };

  HighlightedTextarea.prototype.render = function render() {
    var _props$sheet$classes3 = this.props.sheet.classes;
    var common = _props$sheet$classes3.common;
    var wrapper = _props$sheet$classes3.wrapper;
    var textarea = _props$sheet$classes3.textarea;

    return _react2['default'].createElement(
      'div',
      {
        ref: 'wrapper',
        className: wrapper,
        'data-test': 'highlighted-textarea' },
      this.renderHighlighter(),
      _react2['default'].createElement('textarea', {
        ref: 'textarea',
        className: textarea + ' ' + common,
        placeholder: this.props.placeholder,
        disabled: this.props.disabled,
        onKeyDown: this.onKeyDown.bind(this),
        onChange: this.onChange.bind(this),
        onBlur: this.onBlur.bind(this),
        value: this.state.text,
        autoFocus: true })
    );
  };

  var _HighlightedTextarea = HighlightedTextarea;
  HighlightedTextarea = _grapeWebLibJss.useSheet(_style2['default'])(HighlightedTextarea) || HighlightedTextarea;
  return HighlightedTextarea;
})(_react.Component);

exports['default'] = HighlightedTextarea;
module.exports = exports['default'];