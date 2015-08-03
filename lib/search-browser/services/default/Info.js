'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRender = require('react-pure-render');

var _infoStyle = require('./infoStyle');

var _infoStyle2 = _interopRequireDefault(_infoStyle);

var _infoContents = require('./infoContents');

var contents = _interopRequireWildcard(_infoContents);

var _buttonButton = require('../../../button/Button');

var _buttonButton2 = _interopRequireDefault(_buttonButton);

var _jss = require('../../../jss');

/**
 * Info messages for the user for e.g. to explain integrations.
 */

var Info = (function (_Component) {
  _inherits(Info, _Component);

  function Info() {
    _classCallCheck(this, _Info);

    _Component.apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
  }

  Info.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var images = this.props.images;

    var addIntegration = undefined;
    if (this.props.canAddIntegrations) {
      addIntegration = _react2['default'].createElement(_buttonButton2['default'], {
        onClick: this.onAddIntegration.bind(this),
        text: 'Add a Service Integration',
        className: classes.button });
    }

    var headerStyle = {
      height: this.props.headerHeight + 'px',
      backgroundImage: 'url(' + images.traubyReading + ')'
    };

    var selected = 'basic';
    if (!this.props.hasIntegrations) {
      selected = this.props.canAddIntegrations ? 'canAdd' : 'needsHelp';
      headerStyle.backgroundImage = 'url(' + images.traubyJuggling + ')';
    }
    var content = contents[selected](this.props);

    return _react2['default'].createElement(
      'article',
      { className: content.ok ? classes.infoOk : classes.infoNok },
      _react2['default'].createElement('header', { style: headerStyle, className: content.ok ? classes.headerOk : classes.headerNok }),
      _react2['default'].createElement(
        'div',
        { className: classes.body },
        content.title,
        content.description,
        addIntegration
      )
    );
  };

  Info.prototype.onAddIntegration = function onAddIntegration() {
    this.props.onAddIntegration();
  };

  _createClass(Info, null, [{
    key: 'defaultProps',
    value: {
      canAddIntegrations: true,
      hasIntegrations: false,
      orgName: 'Organisation',
      orgOwner: 'org owner',
      headerHeight: undefined,
      images: undefined,
      onAddIntegration: undefined
    },
    enumerable: true
  }]);

  var _Info = Info;
  Info = _jss.useSheet(_infoStyle2['default'])(Info) || Info;
  return Info;
})(_react.Component);

exports['default'] = Info;
module.exports = exports['default'];