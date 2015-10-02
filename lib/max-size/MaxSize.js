'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _reactPureRender = require('react-pure-render');

/**
 * Limits the size of an outer container by allowing to scroll it if inner size
 * is bigger than defined max props.
 * Triggers resize callbacks if container size is changed and limits are not
 * applied.
 */

var MaxSize = (function (_Component) {
  _inherits(MaxSize, _Component);

  _createClass(MaxSize, null, [{
    key: 'defaultProps',
    value: {
      innerHeight: undefined,
      innerWidth: undefined,
      maxHeight: 160,
      maxWidth: Infinity,
      onResize: _lodashUtilityNoop2['default']
    },
    enumerable: true
  }]);

  function MaxSize(props) {
    _classCallCheck(this, MaxSize);

    _Component.call(this, props);
    this.shouldComponentUpdate = _reactPureRender.shouldPureComponentUpdate;
    this.state = this.createState(props);
  }

  MaxSize.prototype.render = function render() {
    return _react2['default'].createElement(
      'div',
      { style: this.state },
      this.props.children
    );
  };

  MaxSize.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var resized = false;

    if (this.props.innerWidth !== nextProps.innerWidth && nextProps.innerWidth < this.props.maxWidth) {
      resized = true;
    }

    if (this.props.innerHeight !== nextProps.innerHeight && nextProps.innerHeight < this.props.maxHeight) {
      resized = true;
    }

    // We don't call resize callback when inner height/width is lower
    // than its maxHeight/maxWidth because container has a maxHeight and
    // it's size won't change.
    if (resized) this.props.onResize();

    this.setState(this.createState(nextProps));
  };

  MaxSize.prototype.createState = function createState(props) {
    var state = {
      overflow: 'hidden',
      maxHeight: props.maxHeight
    };
    if (props.maxWidth < Infinity) state.maxWidth = props.maxWidth;
    if (props.innerWidth > props.maxWidth) state.overflowX = 'auto';
    if (props.innerHeight > props.maxHeight) state.overflowY = 'auto';
    return state;
  };

  return MaxSize;
})(_react.Component);

exports['default'] = MaxSize;
module.exports = exports['default'];