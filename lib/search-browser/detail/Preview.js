'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _imagesLoader = require('images-loader');

var _imagesLoader2 = _interopRequireDefault(_imagesLoader);

var _reactPureRender = require('react-pure-render');

var _jss = require('../../jss');

var _spinnerSpinner = require('../../spinner/Spinner');

var _spinnerSpinner2 = _interopRequireDefault(_spinnerSpinner);

var _previewStyle = require('./previewStyle');

var _previewStyle2 = _interopRequireDefault(_previewStyle);

var loader = new _imagesLoader2['default']();

/**
 * Detail view for objects.
 */

var Preview = (function (_Component) {
  _inherits(Preview, _Component);

  _createClass(Preview, null, [{
    key: 'defaultProps',
    value: {
      image: undefined,
      spinner: undefined
    },
    enumerable: true
  }]);

  function Preview(props) {
    _classCallCheck(this, _Preview);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = {
      loading: false,
      error: null
    };
  }

  Preview.prototype.componentDidMount = function componentDidMount() {
    this.load(this.props.image);
  };

  Preview.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      error: null
    });
    this.load(nextProps.image);
  };

  Preview.prototype.render = function render() {
    var classes = this.props.sheet.classes;
    var error = this.state.error;

    if (this.state.loading && !error) {
      return _react2['default'].createElement(_spinnerSpinner2['default'], { image: this.props.spinner, active: true });
    }

    // TODO maybe show an error image.
    var image = error ? _imagesLoader2['default'].emptyGif : this.props.image;
    return _react2['default'].createElement('img', { src: image, className: classes.preview });
  };

  Preview.prototype.load = function load(image) {
    var _this = this;

    loader.load(image, function (err) {
      _this.setState({
        loading: false,
        error: err
      });
    });
  };

  var _Preview = Preview;
  Preview = _jss.useSheet(_previewStyle2['default'])(Preview) || Preview;
  return Preview;
})(_react.Component);

exports['default'] = Preview;
module.exports = exports['default'];