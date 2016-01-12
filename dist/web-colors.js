'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _baseColors = require('./base-colors');

var _baseColors2 = _interopRequireDefault(_baseColors);

exports['default'] = {
  link: _baseColors2['default'].blue,
  button: _baseColors2['default'].grayBlue,
  buttonBgDefault: _baseColors2['default'].blue,
  buttonColorDefault: _baseColors2['default'].white,
  buttonBgPrimary: _baseColors2['default'].green,
  buttonColorPrimary: _baseColors2['default'].white,
  alertInfo: _baseColors2['default'].aquaDark,
  alertSuccess: _baseColors2['default'].grassDark,
  alertWarning: _baseColors2['default'].gold,
  alertDanger: _baseColors2['default'].bittersweetDark,
  roomHeaderBackground: _baseColors2['default'].blue,
  chatBackground: _baseColors2['default'].white,
  chatContent: _baseColors2['default'].silverLight,
  navigationBackground: _baseColors2['default'].silverLight,
  organisationBackground: _baseColors2['default'].grapeDark,
  searchHighlightColor: _baseColors2['default'].yellow,
  borderLight: 'rgba(0,0,0,0.05)',
  borderDefault: 'rgba(0,0,0,0.10)',
  borderDark: 'rgba(0,0,0,0.15)'
};
module.exports = exports['default'];