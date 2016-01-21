'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashObjectGet = require('lodash/object/get');

var _lodashObjectGet2 = _interopRequireDefault(_lodashObjectGet);

var _lodashLangIsEmpty = require('lodash/lang/isEmpty');

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _Preview = require('./Preview');

var _Preview2 = _interopRequireDefault(_Preview);

var _DetailEmpty = require('./DetailEmpty');

var _DetailEmpty2 = _interopRequireDefault(_DetailEmpty);

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _detailStyle = require('./detailStyle');

var _detailStyle2 = _interopRequireDefault(_detailStyle);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _constantsSearchBrowser = require('../../../constants/searchBrowser');

/**
 * Detail view for objects.
 */

var Detail = (function (_Component) {
  _inherits(Detail, _Component);

  function Detail() {
    _classCallCheck(this, _Detail);

    _Component.apply(this, arguments);
  }

  Detail.prototype.renderPreview = function renderPreview() {
    var classes = this.props.sheet.classes;
    var _props = this.props;
    var data = _props.data;
    var images = _props.images;

    var previewUrl = _lodashObjectGet2['default'](data, 'preview.image.url');

    if (!previewUrl) return null;

    return _react2['default'].createElement(
      'div',
      { className: classes.previewContainer },
      _react2['default'].createElement(_Preview2['default'], {
        image: previewUrl,
        spinner: images.spinner })
    );
  };

  Detail.prototype.renderInfo = function renderInfo() {
    var classes = this.props.sheet.classes;
    var _props$data = this.props.data;
    var iconUrl = _props$data.iconUrl;
    var title = _props$data.title;
    var subtitle = _props$data.subtitle;
    var description = _props$data.description;

    if (!title && !subtitle && !description) return null;

    return _react2['default'].createElement(
      'div',
      { className: classes.article },
      iconUrl && _react2['default'].createElement('img', { src: iconUrl, className: classes.articleIcon }),
      _react2['default'].createElement(
        'div',
        { className: classes.articleBody },
        title && _react2['default'].createElement(
          'h2',
          { className: classes.title },
          title
        ),
        subtitle && _react2['default'].createElement(
          'h3',
          { className: classes.subtitle },
          subtitle
        ),
        description && _react2['default'].createElement(
          'p',
          { className: classes.description },
          description
        )
      )
    );
  };

  Detail.prototype.renderMeta = function renderMeta() {
    var classes = this.props.sheet.classes;
    var data = this.props.data;

    if (!data.meta) return null;

    return _react2['default'].createElement(
      'div',
      { className: classes.metaContainer },
      data.meta.map(function (item, i) {
        return _react2['default'].createElement(
          'div',
          { className: classes.metaRow, key: i },
          _react2['default'].createElement(
            'div',
            { className: classes.metaLabel },
            item.label
          ),
          _react2['default'].createElement(
            'div',
            { className: classes.metaValue },
            utils.formatDateMaybe(item.label, item.value)
          )
        );
      })
    );
  };

  Detail.prototype.render = function render() {
    var classes = this.props.sheet.classes;

    if (_lodashLangIsEmpty2['default'](this.props.data)) return _react2['default'].createElement(_DetailEmpty2['default'], { images: this.props.images });

    return _react2['default'].createElement(
      'div',
      { className: classes.detail },
      _react2['default'].createElement(
        'div',
        { className: classes.content },
        this.renderPreview(),
        this.renderInfo(),
        this.renderMeta()
      ),
      _react2['default'].createElement(_Actions2['default'], {
        focused: this.props.focusedList === 'actions',
        items: this.props.actions,
        focusedAction: this.props.focusedAction,
        hoveredAction: this.props.hoveredAction,
        onSelect: this.props.execSearchBrowserAction,
        onFocus: this.props.focusSearchBrowserAction,
        onBlur: this.props.blurSearchBrowserAction })
    );
  };

  _createClass(Detail, null, [{
    key: 'propTypes',
    value: {
      sheet: _react.PropTypes.object.isRequired,
      data: _react.PropTypes.object,
      images: _react.PropTypes.object,
      focusedList: _react.PropTypes.oneOf(_constantsSearchBrowser.listTypes),
      actions: _react.PropTypes.array,
      focusedAction: _react.PropTypes.object,
      hoveredAction: _react.PropTypes.object,
      onFocusAction: _react.PropTypes.func,
      execSearchBrowserAction: _react.PropTypes.func,
      focusSearchBrowserAction: _react.PropTypes.func,
      blurSearchBrowserAction: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      data: {},
      images: {}
    },
    enumerable: true
  }]);

  var _Detail = Detail;
  Detail = _grapeWebLibJss.useSheet(_detailStyle2['default'])(Detail) || Detail;
  return Detail;
})(_react.Component);

exports['default'] = Detail;
module.exports = exports['default'];