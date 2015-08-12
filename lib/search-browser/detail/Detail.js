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

var _reactPureRender = require('react-pure-render');

var _jss = require('../../jss');

var _Preview = require('./Preview');

var _Preview2 = _interopRequireDefault(_Preview);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

/**
 * Detail view for objects.
 */

var Detail = (function (_Component) {
  _inherits(Detail, _Component);

  function Detail() {
    _classCallCheck(this, _Detail);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Detail.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var data = this.props.data;

    var previewUrl = _lodashObjectGet2['default'](data, 'preview.image.url');
    var iconUrl = data.iconUrl;

    var header = undefined;
    if (previewUrl || iconUrl) {
      var image = undefined;

      if (previewUrl) {
        image = _react2['default'].createElement(_Preview2['default'], { image: previewUrl, spinner: this.props.images.spinner });
      } else {
        image = _react2['default'].createElement('img', { src: iconUrl, className: classes.icon });
      }

      header = _react2['default'].createElement(
        'header',
        {
          className: classes.header,
          style: { height: this.props.headerHeight } },
        image
      );
    }

    if (_lodashLangIsEmpty2['default'](data)) {
      return _react2['default'].createElement(
        'div',
        { className: classes.detail + ' ' + classes.empty },
        _react2['default'].createElement('img', { src: this.props.images.noDetail }),
        _react2['default'].createElement(
          'span',
          { className: classes.emptyNote },
          'No Detail Infos for this Item'
        )
      );
    }

    return _react2['default'].createElement(
      'div',
      { className: classes.detail },
      header,
      _react2['default'].createElement(
        'div',
        { className: classes.body },
        _react2['default'].createElement(
          'h2',
          { className: classes.title },
          data.title
        ),
        _react2['default'].createElement(
          'h3',
          { className: classes.subtitle },
          data.subtitle
        ),
        _react2['default'].createElement(
          'p',
          { className: classes.description },
          data.description
        ),
        data.meta && _react2['default'].createElement(
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
        )
      )
    );
  };

  _createClass(Detail, null, [{
    key: 'defaultProps',
    value: {
      data: {},
      headerHeight: undefined,
      images: undefined
    },
    enumerable: true
  }]);

  var _Detail = Detail;
  Detail = _jss.useSheet(_style2['default'])(Detail) || Detail;
  return Detail;
})(_react.Component);

exports['default'] = Detail;
module.exports = exports['default'];