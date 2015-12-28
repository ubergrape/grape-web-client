'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserStyle = require('../browser/style');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

exports['default'] = _extends({}, _browserStyle2['default'], {
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
  },
  browser: _extends({}, _browserStyle2['default'].browser, {
    position: 'relative',
    margin: '0 10%'
  })
});
module.exports = exports['default'];