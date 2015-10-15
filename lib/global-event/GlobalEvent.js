'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

// TODO
// - rename to react-event
// - enable children to be emitter
// - enable debounce, throttle
// - use onClick etc instead of events

var GlobalEvent = (function (_Component) {
  _inherits(GlobalEvent, _Component);

  _createClass(GlobalEvent, null, [{
    key: 'defaultProps',
    value: {
      emitter: window,
      event: undefined,
      handler: undefined,
      debounce: 0
    },
    enumerable: true
  }]);

  function GlobalEvent(props) {
    _classCallCheck(this, GlobalEvent);

    _Component.call(this, props);
    this.handler = this.handler.bind(this);
  }

  GlobalEvent.prototype.componentDidMount = function componentDidMount() {
    this.props.emitter.addEventListener(this.props.event, this.handler);
  };

  GlobalEvent.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.emitter.removeEventListener(this.props.event, this.handler);
  };

  GlobalEvent.prototype.handler = function handler(e) {
    var _this = this;

    if (this.props.debounce) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(function () {
        _this.props.handler(e);
      });
    } else this.props.handler(e);
  };

  GlobalEvent.prototype.render = function render() {
    return this.children || null;
  };

  return GlobalEvent;
})(_react.Component);

exports['default'] = GlobalEvent;
module.exports = exports['default'];