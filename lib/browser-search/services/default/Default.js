'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRender = require('react-pure-render');

var _jss = require('../../../jss');

var _browserStyle = require('../../../browser/style');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _gridGrid = require('../../../grid/Grid');

var _gridGrid2 = _interopRequireDefault(_gridGrid);

var _sidebarSidebar = require('../../../sidebar/Sidebar');

var _sidebarSidebar2 = _interopRequireDefault(_sidebarSidebar);

var _detailDetail = require('../../detail/Detail');

/**
 * Default search rendering.
 */

var _detailDetail2 = _interopRequireDefault(_detailDetail);

var Default = (function (_Component) {
  _inherits(Default, _Component);

  function Default() {
    _classCallCheck(this, _Default);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Default.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var props = this.props;

    var sidebarContent = undefined;

    if (props.focusedItem.type === 'filters') {
      sidebarContent = _react2['default'].createElement(_Info2['default'], props);
    } else {
      sidebarContent = _react2['default'].createElement(_detailDetail2['default'], _extends({}, props, { data: props.focusedItem.detail }));
    }

    return _react2['default'].createElement(
      'div',
      { className: classes.column },
      _react2['default'].createElement(
        'div',
        { className: classes.row },
        _react2['default'].createElement(_gridGrid2['default'], _extends({}, props, { className: classes.leftColumn })),
        _react2['default'].createElement(
          _sidebarSidebar2['default'],
          { className: classes.rightColumn },
          sidebarContent
        )
      )
    );
  };

  _createClass(Default, null, [{
    key: 'defaultProps',
    value: {
      focusedItem: undefined,
      headerHeight: 128
    },
    enumerable: true
  }]);

  var _Default = Default;
  Default = _jss.useSheet(_browserStyle2['default'])(Default) || Default;
  return Default;
})(_react.Component);

exports['default'] = Default;
module.exports = exports['default'];